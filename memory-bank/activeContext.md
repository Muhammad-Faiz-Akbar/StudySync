# Active Context

> Diperbarui oleh Cline di akhir setiap task. Baca file ini di awal setiap task.

## Status saat ini
- **Fase:** Fase 0 (setup). T-001 selesai (Next.js 16.4.6 + TS strict + Tailwind v4 + ESLint + Vitest, `src/lib/env.ts`). T-002 selesai: `0001_init.sql` + `0002_harden_rls.sql` + `seed.sql` sudah jalan di Supabase **dev** tanpa error (20 mata kuliah contoh, domain email belum diisi).
- **Berikutnya:** T-003 (auth email OTP, middleware sesi, cek domain) lalu T-004 (app shell).
- **Ronde:** Semifinal. Skor abstrak 61/100: P1 Problem Clarity 1/5, P3 Value and Originality 3/5. Juri menolak survei 35 responden karena berlabel "fictional context".
- **Prioritas #1 (tanpa kode):** Fase V di `docs/02-PROJECT_PLAN.md` (V-001 s.d. V-006), panduan di `docs/10-EVIDENCE_PLAN.md`. Jangan pakai angka 28/35 di dokumen mana pun.
- **Prioritas #2:** T-001 s.d. T-005 (Fase 0). Mulai dengan Prompt 0 di `docs/08-CLINE_PROMPTS.md`.

## Keputusan terbuka (isi oleh tim)
- Deadline pengumpulan: [isi] · Demo/pitch final: [isi]
- Nama kampus dan domain email resmi: [isi]
- Pembagian peran 4 anggota: [isi]
- Katalog mata kuliah nyata (menggantikan seed contoh): [isi]
- Rubrik: P1 Problem Clarity 30%, P2 Fit to Case 20%, P3 Value & Originality 25%, P4 Feasibility 15%, P5 Abstract Clarity 10% (skor 1–5 per kriteria). Deliverable dan deadline Semifinal: [isi dari halaman Timeline & Deadline]

## Catatan / utang teknis
- Migrasi `0001_init.sql` + `0002_harden_rls.sql` sudah direview tetapi **belum dijalankan**; menunggu eksekusi manual di project Supabase dev, lalu verifikasi di T-002 dan T-016.
- `0002` menutup 6 temuan review 0001: view `public_profiles` tanpa `security_invoker`, insert peserta sesi privat, kolom koneksi yang bisa di-hijack, `display_name` dari email, sesi terbuka yang sudah dibatalkan tetap terbaca, index/FK/block pada `get_contact`.
- Terbuka: `meeting_url` sesi terbuka masih terbaca semua user login; saring lewat view khusus saat T-030.
- `0002` sudah dijalankan, jadi perubahan grant berikutnya harus lewat migrasi baru: `onboarding_started_at` belum di-grant untuk `select` ke `authenticated` (progres onboarding tersimpan di kolom itu). T-011 butuh migrasi `0003` bila ingin membaca kolom tersebut langsung dari client.
- Verifikasi skema: `supabase/verify_schema.sql` (read-only, 18 baris cek). Hasilnya belum dilaporkan tim; jalankan di SQL Editor dan pastikan semua `ok` sebelum T-016.
- Branch: `main` = T-001 (`5af7993`); T-002 ada di `fix/T-002-harden-rls` (`c1803ce`) dan belum di-push.
- Trigger `enforce_email_domain` masih dikomentari (aktifkan setelah domain terisi dan domain demo ditambahkan).
- T-001: tombol di `/` mengarah ke `/login` yang baru dibuat di T-003, jadi masih 404 sampai task itu selesai.
- T-001: Tailwind v4 memakai `@tailwindcss/turbopack` lewat `next.config.ts` (tanpa `postcss.config.mjs`), mengikuti output resmi create-next-app.
- T-001: `vitest.config.mts` (bukan `.ts`) karena `package.json` tidak memakai `"type": "module"`.
- T-001: `@types/node` dinaikkan ke `^22` agar cocok dengan peer dependency Vitest 5 (Node runtime v22).
- T-001: `src/app/layout.tsx` memakai tipe props eksplisit (`ReactNode`), bukan `LayoutProps<"/">`, agar `npm run typecheck` lulus tanpa perlu `next build` lebih dulu.
- Lingkungan Cline di mesin ini: Node/npm host hanya terlihat lewat `/run/host`; helper `~/.var/app/com.visualstudio.code/data/studysync-env.sh` menyiapkan `PATH` + `LD_LIBRARY_PATH` untuk sandbox VS Code Flatpak. Di terminal biasa cukup `node`/`npm` biasa.

## Hambatan
- (kosong)
