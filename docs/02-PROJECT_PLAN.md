# Rencana Proyek

> **Perubahan prioritas (umpan balik juri Semifinal):** Fase V (bukti dan pembeda) setara pentingnya dengan pembangunan MVP. Skor P1 hanya 1/5 karena bukti kebutuhan dinilai tidak nyata. Mulai V-001 dan V-002 hari ini.

Rencana mengikuti abstrak: **3 minggu pengembangan**, dengan pilot pengguna di minggu ke-3. Isi tanggal setelah deadline pasti diketahui.

| Tonggak | Tanggal |
|---|---|
| Mulai | [isi] |
| Feature freeze (H-3 sebelum deadline) | [isi] |
| Latihan demo #1 / #2 | [isi] / [isi] |
| Deadline pengumpulan | [isi] |
| Demo/pitch final | [isi] |

## 1. Peran (usulan, isi nama)
| Peran | Fokus | Nama |
|---|---|---|
| Lead + Pitch | Koordinasi, dokumen kompetisi, pitch, uji pengguna | Aulia Akbar (leader) |
| Frontend | Onboarding, grid jadwal, UI rekomendasi dan sesi | [isi] |
| Backend + DB | Skema, RLS, route handler, auth, seed | [isi] |
| Algoritma + QA | Matching engine, test, verifikasi RLS, data sintetis | [isi] |

Aturan tim: `main` selalu bisa di-deploy. Perubahan lewat branch + review anggota lain (cukup 10 menit). Standup 10 menit setiap hari.

## 2. Jalur kritis
`T-001 → T-002 → T-003 → T-011/T-012 → T-021 → T-022 → T-023 → T-024 → T-026 → demo`.
Hambatan paling mungkin: **T-012 (grid jadwal di mobile)** dan **T-021 (engine)**. Mulai lebih awal dan paralelkan.

## 3. Daftar task
Estimasi dengan bantuan Cline: **S** ≤ 2 jam · **M** ≤ ½ hari · **L** ≤ 1–1,5 hari.

### Fase V: Bukti dan pembeda (PARALEL, mulai segera; lihat `10-EVIDENCE_PLAN.md`)
Dipicu skor juri P1 = 1/5 (bobot 30%) dan P3 = 3/5 (bobot 25%). Tidak butuh kode, jadi bisa jalan bersamaan dengan Fase 0–1.
| ID | Task | Pri | Est |
|---|---|---|---|
| V-001 | Finalisasi kuesioner + tetapkan ambang sebelum menyebar | P0 | S |
| V-002 | Sebar survei, kumpulkan minimal 50 responden (≥ 3 prodi) | P0 | M |
| V-003 | Wawancara 5–8 mahasiswa (15 menit) | P0 | M |
| V-004 | Analisis + ringkasan bukti 1 halaman (jujur soal n dan keterbatasan) | P0 | S |
| V-005 | Uji 3 alternatif nyata, susun tabel pembeda | P0 | S |
| V-006 | Tes baseline grup chat vs StudySync (dikerjakan bersama T-038) | P0 | M |

### Fase 0: Setup (hari 1–2)
| ID | Task | Pri | Est |
|---|---|---|---|
| T-001 | Scaffold Next.js + TS strict + Tailwind, lint, Vitest, `env.ts` | P0 | S |
| T-002 | Project Supabase dev, jalankan migrasi 0001 + seed katalog | P0 | S |
| T-003 | Auth email OTP, middleware sesi, rute terlindungi, cek domain | P0 | M |
| T-004 | App shell mobile-first, navigasi bawah, komponen UI dasar | P0 | S |
| T-005 | GitHub Actions (lint, typecheck, test) + deploy preview Vercel | P0 | S |

### Fase 1: Profil dan jadwal (minggu 1)
| ID | Task | Pri | Est |
|---|---|---|---|
| T-010 | Skema zod + aksi/API profil | P0 | S |
| T-011 | Wizard onboarding langkah 1–2 (profil, mata kuliah) | P0 | M |
| T-012 | Grid jadwal 30 menit (tap/seret, template, salin hari) | P0 | L |
| T-013 | Langkah kontak + privasi (reveal, discoverable, per-slot) | P0 | M |
| T-014 | Instrumentasi `events` + pencatatan M1 | P0 | S |
| T-015 | Halaman pengaturan: ubah profil, mata kuliah, jadwal, privasi | P0 | M |
| T-016 | Skrip verifikasi RLS (user A tidak bisa baca data user B) | P0 | S |

### Fase 2: Matching dan koneksi (minggu 2)
| ID | Task | Pri | Est |
|---|---|---|---|
| T-020 | Utilitas interval (merge, irisan) + test | P0 | M |
| T-021 | Matching engine v1 (filter, skor, alasan) + test | P0 | L |
| T-022 | `GET /api/matches` (DTO server-only, blokir, discoverable) | P0 | M |
| T-023 | UI rekomendasi + "kenapa cocok" + filter | P0 | L |
| T-024 | Koneksi: kirim/terima/tolak + reveal kontak | P0 | M |
| T-025 | Saran slot konkret dari irisan | P0 | M |
| T-026 | Penjadwal sesi (buat, undang, konfirmasi) | P0 | L |
| T-027 | Daftar dan detail sesi + pembatalan | P0 | S |
| T-028 | Skrip seed data sintetis 150–300 pengguna | P0 | M |

### Fase 3: Polesan, validasi, pitch (minggu 3)
| ID | Task | Pri | Est |
|---|---|---|---|
| T-030 | Open Study Board | P1 | L |
| T-031 | Pengingat in-app | P1 | M |
| T-032 | Feedback sesi 1-tap + kehadiran | P1 | S |
| T-033 | Block dan report | P1 | S |
| T-034 | Dashboard metrik admin | P1 | M |
| T-035 | Polesan UX: state kosong/loading/error, a11y, copy | P0 | M |
| T-036 | Uji kinerja (500 kandidat) + bug bash | P0 | M |
| T-037 | Pilot 5–10 teman (tanpa kode) | P0 | M |
| T-038 | Trial 10–20 peserta, kumpulkan M1–M5 (tanpa kode) | P0 | M |
| T-039 | Deploy demo, akun demo juri, cek ulang env | P0 | S |

### Dokumen kompetisi
| ID | Dokumen | Catatan |
|---|---|---|
| D-001 | Proposal teknis | Konsisten dengan abstrak |
| D-002 | Pitch deck (8–10 slide) | Lihat `07-PITCH_AND_DEMO.md` |
| D-003 | Skrip demo 3 menit | Dilatih 2×, sudah ada kerangkanya |
| D-004 | Video demo cadangan | Rekam setelah feature freeze |
| D-005 | Poles README + tangkapan layar | Tanpa data nyata |

## 4. Jadwal mingguan
| Minggu | Tujuan | Gerbang keluar |
|---|---|---|
| 0 (hari 1–2) | Fase 0 | App kosong ter-deploy, login berfungsi |
| 1 | Fase 1 | Pengguna baru bisa onboarding penuh < 2 menit (diukur) |
| 2 | Fase 2 | Alur lengkap: login → rekomendasi → koneksi → sesi |
| 3 | Fase 3 | P0 stabil, pilot selesai, dokumen dan video siap |

## 5. Garis potong (jika terlambat)
Potong dari bawah, jangan sentuh P0:
1. P2 (tidak dikerjakan sama sekali)
2. T-034 dashboard (hitung metrik dengan query SQL manual)
3. T-031 pengingat
4. T-033 block/report (tetap tulis kebijakan di dokumen)
5. T-030 Open Study Board. **Pertahankan sedapat mungkin**: ini penyelamat demo saat pengguna sedikit.

## 6. Daftar risiko
| Risiko | Peluang | Dampak | Mitigasi |
|---|---|---|---|
| Cold start: pengguna terlalu sedikit | Tinggi | Tinggi | Open Study Board, seed sintetis, undangan per kelas |
| Waktu tidak cukup | Sedang | Tinggi | Garis potong, feature freeze H-3, task kecil |
| Bug RLS bocorkan data | Sedang | Tinggi | T-016, aturan DTO server, review privasi sebelum pilot |
| Juri tidak bisa login (tanpa email kampus) | Sedang | Sedang | Akun demo email+password |
| Internet/demo gagal saat presentasi | Sedang | Tinggi | Video cadangan, akun demo siap, uji di jaringan berbeda |
| Grid jadwal sulit dipakai di HP | Sedang | Sedang | Template cepat, uji di HP asli sejak minggu 1 |
| Peserta trial sedikit | Sedang | Sedang | Rekrut sejak minggu 2, target 20 tapi laporkan jujur n sebenarnya |
| Scope creep | Tinggi | Sedang | Guardrail di `.clinerules`, cek PRD sebelum tambah fitur |

## 7. Daftar siap-demo (H-1)
- [ ] Alur demo 3 menit berjalan 3× berturut-turut tanpa error
- [ ] Akun demo dan data sintetis siap; tidak ada data mahasiswa nyata
- [ ] Tes di HP asli (Android dan iOS) dan di jaringan seluler
- [ ] Video cadangan sudah direkam dan bisa diputar offline
- [ ] Env produksi/demo benar; kunci rahasia tidak ada di repo
- [ ] Slide, README, dan proposal konsisten dengan abstrak
