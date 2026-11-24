# StudySync

> Platform pencocokan teman belajar berbasis mata kuliah dan jadwal kosong.
> **Tim Ngawur** · STACK 2026 · Case 1: Smarter Campus and Learning

## Masalah

Mahasiswa sulit menemukan teman belajar atau anggota kelompok yang cocok secara mata kuliah dan jadwal, terutama di luar lingkaran pertemanan dekat. Permintaan lewat grup chat besar jarang berhasil. Akibatnya persiapan ujian dan pengerjaan tugas besar sering molor karena tidak ada peer accountability dan sesi belajar tidak terstruktur.

## Solusi

Web app mobile-first dengan alur inti 4 langkah:

1. **Masuk** dengan email kampus (OTP).
2. **Isi** mata kuliah (beserta level, peran, tujuan) dan jadwal kosong mingguan.
3. **Lihat rekomendasi** teman belajar, lengkap dengan alasan "kenapa cocok".
4. **Hubungi** atau **jadwalkan sesi belajar** dari irisan jadwal yang disarankan sistem.

Pembeda utama: pencocokan otomatis berbasis irisan jadwal dan tag mata kuliah (tanpa AI, bisa dijelaskan), serta privasi jadwal yang granular. Jadwal mentah orang lain tidak pernah dikirim ke browser.

## Fitur dan prioritas

| Prioritas | Fitur |
|---|---|
| **P0 (MVP, wajib untuk demo)** | Login email kampus, onboarding < 2 menit, input mata kuliah, grid jadwal kosong, kontrol privasi, matching engine + rekomendasi + alasan, permintaan koneksi (kirim/terima/tolak), reveal kontak setelah diterima, penjadwal sesi dengan saran slot, daftar sesi |
| **P1** | Open Study Board (sesi terbuka, mengatasi cold start), pengingat sesi, feedback 1-tap setelah sesi, block/report, dashboard metrik |
| **P2 (stretch)** | Ekspor .ics, matching grup 3–5 orang, web push |

**Sengaja tidak dibuat:** AI/LLM, chat in-app, aplikasi native, pembayaran, integrasi SSO resmi kampus, video call.

## Tech stack

Next.js (App Router) · TypeScript strict · Tailwind CSS · Supabase (PostgreSQL, Auth, RLS) · zod · Vitest · deploy di Vercel. Alasannya ada di `docs/09-DECISIONS.md`.

## Struktur repo

```
.clinerules/     Aturan untuk Cline (dimuat otomatis)
memory-bank/     Konteks kerja yang diperbarui Cline di setiap task
docs/            PRD, rencana proyek, algoritma, data model, privasi, testing, pitch
supabase/        Migrasi SQL dan seed
src/             Kode aplikasi (dibuat saat T-001)
scripts/         Skrip seed data sintetis, dll.
tests/           Unit test engine dan pengecekan RLS
```

## Memulai

Prasyarat: Node.js LTS, akun Supabase, akun Vercel (opsional di awal), VS Code + ekstensi Cline.

```bash
npm install
cp .env.example .env.local     # isi nilai dari dashboard Supabase
npm run dev                    # http://localhost:3000
npm run test                   # unit test (Vitest)
npm run lint && npm run typecheck
```

Database: buat project Supabase `studysync-dev`, lalu jalankan `supabase/migrations/0001_init.sql` dan `supabase/seed.sql` lewat SQL Editor atau Supabase CLI.

## Bekerja dengan Cline

1. Buka folder ini di VS Code. Cline membaca `.clinerules/` otomatis.
2. Buka `docs/08-CLINE_PROMPTS.md` dan mulai dari **Prompt 0** (Plan mode).
3. Satu task per percakapan. Setelah selesai, pastikan `memory-bank/progress.md` dan `activeContext.md` ikut diperbarui.

## Dokumen

| File | Isi |
|---|---|
| `docs/00-REVIEW_AND_IMPROVEMENTS.md` | Hasil telaah mind map + abstrak, dan perbaikan yang diusulkan |
| `docs/01-PRD.md` | Kebutuhan produk, user story, kriteria penerimaan, metrik |
| `docs/02-PROJECT_PLAN.md` | Rencana 3 minggu, daftar task, risiko |
| `docs/03-MATCHING_ALGORITHM.md` | Spesifikasi algoritma + kasus uji |
| `docs/04-DATA_MODEL.md` | Skema, matriks akses data, event |
| `docs/05-PRIVACY_AND_SAFETY.md` | Privasi, keamanan, teks persetujuan |
| `docs/06-TESTING_AND_VALIDATION.md` | Strategi tes dan protokol uji pengguna |
| `docs/07-PITCH_AND_DEMO.md` | Alur pitch, skrip demo 3 menit, antisipasi Q&A |
| `docs/08-CLINE_PROMPTS.md` | Prompt siap pakai per fase |
| `docs/09-DECISIONS.md` | Catatan keputusan arsitektur |
| `docs/10-EVIDENCE_PLAN.md` | Rencana bukti kebutuhan dan pembeda (respons umpan balik juri) |

## Tim

Aulia Akbar (leader), Muhammad Faiz Akbar, Muhammad Sultan, Asril Junandar.
