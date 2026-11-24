# Data Model

Sumber kebenaran skema: `supabase/migrations/0001_init.sql`. Perubahan skema = migrasi baru (jangan edit migrasi yang sudah dijalankan) + perbarui dokumen ini.

## 1. Tabel
| Tabel | Fungsi | Catatan |
|---|---|---|
| `profiles` | Profil + preferensi + privasi + kontak | 1:1 dengan `auth.users`, dibuat oleh trigger |
| `courses` | Katalog mata kuliah | Dibaca semua user login |
| `user_courses` | Mata kuliah user + level 1–5, peran, tujuan | PK (user, course) |
| `availability_slots` | Jadwal kosong mingguan | Menit sejak 00:00, kelipatan 30; `is_shareable` per slot |
| `connections` | Permintaan koneksi per mata kuliah | Unik parsial: satu koneksi aktif per pasangan + mata kuliah |
| `study_sessions` | Sesi belajar | `is_open` = tampil di Open Study Board (P1) |
| `session_participants` | Peserta sesi + status | |
| `session_feedback` | Rating dan "mau lagi?" | P1 |
| `user_blocks`, `reports` | Keamanan | P1 |
| `events` | Analitik M1–M5 | Tanpa PII di `props` |
| `allowed_email_domains` | Daftar domain kampus | Hanya service role |

## 2. Matriks akses data
Prinsip: **data lintas-user tidak pernah dibaca client langsung.** Client hanya membaca miliknya sendiri; data orang lain datang dalam bentuk DTO dari route handler server.

| Data | Pemilik (client) | Pengguna lain | Cara akses pengguna lain |
|---|---|---|---|
| `profiles` penuh | Baca/ubah (kolom terbatas) | Tidak | `public_profiles` (tanpa kontak) |
| Kontak | Ya | Hanya jika koneksi `accepted` | `get_contact(target)` |
| `availability_slots` | Ya | **Tidak pernah** | Hanya jendela irisan di DTO `/api/matches`, sesuai `availability_reveal` |
| `user_courses` | Ya | Tidak langsung | Mata kuliah bersama di DTO |
| `connections` | Sebagai peminta/penerima | Tidak | — |
| `study_sessions` | Sebagai host/peserta | Jika `is_open` | Query langsung (RLS) |
| `events`, `reports`, `allowed_email_domains` | Tulis saja | Tidak | Query via service role / SQL editor |

## 3. DTO utama (`GET /api/matches`)
```ts
interface MatchCardDTO {
  userId: string;                // untuk permintaan koneksi
  displayName: string;
  studyProgram: string | null;
  score: number;                 // 0..100
  bestCourse: { id: string; code: string; name: string };
  sharedCourses: { id: string; code: string; name: string }[];
  reasons: ReasonCode[];
  overlapSummary: { minutesPerWeek: number };         // selalu ada
  overlapWindows?: { day: number; startMin: number; endMin: number }[]; // hanya jika reveal diizinkan
  mode: 'online' | 'offline' | 'either';
}
```
`overlapWindows` hanya dikirim jika kandidat memilih `overlap_only`, atau jika sudah ada koneksi `accepted`. Untuk `after_connect`, hanya `overlapSummary`.

## 4. Katalog event (`events.name`)
| Event | Props (tanpa PII) | Dipakai untuk |
|---|---|---|
| `login_succeeded` | `is_first_login` | M2 (titik awal) |
| `onboarding_started` | — | M1 |
| `onboarding_completed` | `duration_ms` | M1 |
| `matches_viewed` | `count` | Diagnostik |
| `connection_requested` | `score` | M2, M4 |
| `connection_accepted` / `connection_declined` | — | M4 |
| `session_created` / `session_joined` | `is_open` | M3 |
| `feedback_submitted` | `rating` | M5 |

Contoh query M1 (median detik) dan M2 diletakkan di `docs/06-TESTING_AND_VALIDATION.md`.

## 5. Catatan implementasi
- Kapasitas sesi dan validitas bergabung ke sesi terbuka dicek di route handler (bukan di RLS). Tambahkan test.
- Status koneksi hanya bisa berubah sesuai policy: penerima → `accepted`/`declined`; peminta → `cancelled`. `responded_at` diisi aplikasi.
- Trigger domain email (`enforce_email_domain`) dikomentari di migrasi; aktifkan setelah daftar domain terisi.
- Migrasi belum pernah dijalankan. T-002 dan T-016 memverifikasinya (termasuk uji bahwa user A tidak bisa membaca `availability_slots` user B).
