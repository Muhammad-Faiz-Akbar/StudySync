# PRD: StudySync

## 1. Visi
Setiap mahasiswa bisa menemukan teman belajar yang cocok mata kuliah dan jadwalnya, dan menjadwalkan sesi belajar bersama, dalam hitungan menit.

## 2. Pengguna
Mahasiswa aktif yang mencari teman belajar, peer tutor, atau kelompok untuk mata kuliah dan persiapan ujian tertentu.

Persona (fiktif, untuk perancangan):
- **Rani, semester 3.** Kesulitan di Kalkulus, tidak kenal siapa pun di kelas lain, jadwal padat. Butuh orang yang sudah paham dan senggang di jam yang sama.
- **Dimas, semester 5.** Cukup paham Struktur Data, ingin mengulang materi sambil mengajar. Butuh kelompok yang serius dan tepat waktu.

## 3. Cakupan

| Prioritas | Fitur |
|---|---|
| P0 | US-01 s.d. US-10 |
| P1 | US-11 s.d. US-15 |
| P2 | US-16, US-17 |

**Non-goals:** AI/LLM, chat in-app, aplikasi native, pembayaran, SSO resmi kampus, video call, gamifikasi selain yang tertulis.

## 4. User story dan kriteria penerimaan

**US-01 Login kampus (P0).** Sebagai mahasiswa, aku login dengan email kampus.
- Email di luar domain yang diizinkan ditolak dengan pesan jelas.
- Setelah memasukkan kode OTP yang benar, aku masuk; jika belum onboarding, diarahkan ke `/onboarding`.
- Rute selain `/`, `/login` tidak bisa diakses tanpa sesi.

**US-02 Onboarding cepat (P0).** Aku bisa menyelesaikan profil dalam ≤ 2 menit.
- Alur: nama + prodi, lalu mata kuliah, lalu jadwal, lalu kontak + privasi. Selesai langsung menampilkan rekomendasi.
- Event `onboarding_started` dan `onboarding_completed` tercatat (M1).
- Bisa dilanjutkan jika tab ditutup di tengah jalan (progres tersimpan per langkah).

**US-03 Input mata kuliah (P0).**
- Pilih dari katalog (pencarian by nama/kode). Wajib 1–8 mata kuliah.
- Tiap mata kuliah: level 1–5, peran (`learn` ingin belajar / `help` bisa membantu / `both`), tujuan (`exam_prep`, `assignment`, `project`, `concept`).

**US-04 Input jadwal kosong (P0).**
- Grid mingguan Senin–Minggu, slot 30 menit, rentang tampil 07.00–21.00 (konfigurasi).
- Bisa tap/seret di layar sentuh; ada template cepat (Pagi, Siang, Sore, Malam) dan "salin ke hari lain".
- Minimal 2 jam total sebelum bisa lanjut.

**US-05 Privasi (P0).**
- Toggle `discoverable`, pilihan `availability_reveal` (`overlap_only` / `after_connect`), dan tanda "jangan bagikan" per slot.
- Kontak tidak pernah tampil sebelum koneksi diterima.
- Halaman `/settings/privacy` menjelaskan efek tiap pilihan dengan bahasa awam.

**US-06 Rekomendasi (P0).**
- Maks 10 teman, urut skor (lihat `03-MATCHING_ALGORITHM.md`).
- Kartu: nama, prodi, mata kuliah bersama, skor, alasan (maks 3 chip), ringkasan irisan ("± 4 jam/minggu"; detail jam sesuai `availability_reveal`).
- Filter: per mata kuliah, per mode.
- State kosong: tawarkan Open Study Board (jika ada) dan tombol bagikan tautan undangan.
- Respons API ≤ 1,5 dtk (p95) untuk 500 kandidat.

**US-07 Kirim permintaan koneksi (P0).**
- Per mata kuliah, dengan pesan opsional ≤ 280 karakter. Tidak bisa kirim ganda untuk pasangan + mata kuliah yang sama.
- Event `connection_requested` tercatat (M2).

**US-08 Terima/tolak (P0).**
- Penerima melihat permintaan masuk. Terima memunculkan kontak kedua belah pihak lewat `get_contact()`.
- Tolak tidak memberi tahu alasan; peminta hanya melihat "belum cocok".

**US-09 Jadwalkan sesi (P0).**
- Dari koneksi yang diterima: sistem menyarankan 3 slot konkret (tanggal+jam) dari irisan jadwal dalam 14 hari ke depan.
- Isi: judul, topik, mode (online/offline), lokasi atau tautan. Partner mengonfirmasi atau menolak.
- Event `session_created` tercatat (M3).

**US-10 Daftar sesi (P0).**
- Sesi mendatang dan riwayat; bisa dibatalkan oleh host.

**US-11 Open Study Board (P1).** Aku bisa memposting sesi terbuka (mata kuliah, waktu, kuota 2–8) dan orang lain bisa bergabung hingga kuota penuh.

**US-12 Pengingat (P1).** Notifikasi in-app H-1 jam sebelum sesi (email opsional).

**US-13 Feedback sesi (P1).** Setelah sesi: "Hadir?" dan rating 1–5 + "mau belajar bareng lagi?" (1-tap).

**US-14 Block dan report (P1).** Memblokir pengguna menghilangkannya dari rekomendasi kedua arah. Report menyimpan alasan untuk ditinjau tim.

**US-15 Dashboard metrik (P1).** Halaman admin (dibatasi `ADMIN_EMAILS`) menampilkan M1–M5 dari tabel `events`.

**US-16 Ekspor .ics (P2).** **US-17 Matching grup 3–5 orang (P2).**

## 5. Layar dan rute

| Rute | Keterangan | Prioritas |
|---|---|---|
| `/` | Landing singkat + tombol masuk | P0 |
| `/login` | Email kampus + OTP | P0 |
| `/onboarding` | Wizard 4 langkah | P0 |
| `/matches` | Rekomendasi | P0 |
| `/connections` | Masuk/keluar/diterima | P0 |
| `/sessions`, `/sessions/new`, `/sessions/[id]` | Daftar, buat, detail | P0 |
| `/settings`, `/settings/privacy` | Profil dan privasi | P0 |
| `/board` | Open Study Board | P1 |
| `/admin/metrics` | Dashboard metrik | P1 |

Route handler: `GET /api/matches`, `POST /api/connections`, `PATCH /api/connections/[id]`, `POST /api/sessions`, `PATCH /api/sessions/[id]`, `POST /api/events`.

## 6. Kebutuhan non-fungsional
- **Kinerja:** `/api/matches` p95 ≤ 1,5 dtk (500 kandidat); LCP mobile ≤ 2,5 dtk di jaringan 4G.
- **Responsif:** 360×640 tanpa scroll horizontal; Chrome dan Safari terbaru.
- **Aksesibilitas:** kontras AA, label form, fokus terlihat.
- **Privasi dan keamanan:** `05-PRIVACY_AND_SAFETY.md` (wajib).
- **Observabilitas:** semua metrik M1–M5 bisa dihitung dari `events`.
- **Bahasa:** UI Bahasa Indonesia.

## 7. Akses juri
Juri mungkin tidak punya email kampus. Sediakan 2–3 akun demo (email + password) yang hanya aktif saat `DEMO_MODE=true` di lingkungan demo, dengan data sintetis (`is_demo`). Kredensial hanya di dokumen pitch/pengumpulan, tidak di repo.
