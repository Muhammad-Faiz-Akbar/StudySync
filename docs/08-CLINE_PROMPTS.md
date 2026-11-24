# Prompt Siap Pakai untuk Cline

## Cara pakai
- **Satu task per percakapan.** Mulai percakapan baru saat konteks sudah panjang atau task berganti.
- Mulai selalu di **Plan mode**. Baca rencananya, koreksi, baru pindah ke **Act mode**.
- Cline membaca `.clinerules/` otomatis. Prompt di bawah mengarahkannya ke dokumen yang relevan.
- Tinjau diff sebelum menyetujui. Auto-approve hanya untuk baca file dan perintah aman (`test`, `lint`, `typecheck`). Jangan auto-approve perintah yang mengubah database, menghapus file, atau `git push`.
- Jangan tempel kunci rahasia ke percakapan. Isi `.env.local` sendiri.
- Setelah tiap task: jalankan sendiri `npm run dev` dan coba hasilnya, jangan hanya percaya laporan Cline.

---

## Prompt 0: Kickoff (Plan mode, tanpa menulis kode)
```
Baca .clinerules/, memory-bank/, README.md, dan seluruh docs/ (urutan 00 sampai 09).
Lalu jawab:
1. Ringkasan proyek dan komitmen abstrak dengan kata-katamu sendiri.
2. Hal yang masih ambigu atau bertentangan antar dokumen (jika ada).
3. Rencana implementasi untuk Fase 0 (T-001 sampai T-005): file yang akan dibuat, urutan, risiko.
Jangan menulis atau mengubah file apa pun dulu. Tunggu persetujuanku.
```

## Prompt 1: Scaffold (T-001)
```
Kerjakan T-001 sesuai docs/02-PROJECT_PLAN.md dan .clinerules/01.
Scaffold Next.js (App Router, TypeScript strict, Tailwind, ESLint, src/ dir, alias @/*), tambah Vitest,
script npm: dev, build, lint, typecheck, test, serta src/lib/env.ts (validasi zod, baca ALLOWED_EMAIL_DOMAINS, APP_TIMEZONE, dst. dari .env.example).
tulis tests/env.test.ts untuk parseEnv (valid, kunci hilang, domain kosong, DEMO_MODE bukan boolean).
Catatan lingkungan: pengembang memakai Linux (CachyOS/Arch) dengan bash; tulis perintah verifikasi
dengan bash/POSIX, bukan PowerShell atau perintah khusus Windows.
PENTING: jangan menimpa file yang sudah ada (README.md, .clinerules/, docs/, memory-bank/, supabase/, .env.example).
Jika create-next-app menolak karena folder tidak kosong, scaffold di folder sementara lalu salin tanpa menimpa.
Pastikan .gitignore memuat .env*. Setelah selesai, perbarui memory-bank dan laporkan sesuai format di .clinerules/04.
```

## Prompt 2: Database dan auth (T-002, T-003)
```
Kerjakan T-002 dan T-003. Migrasi supabase/migrations/0001_init.sql belum pernah dijalankan:
review dulu isinya terhadap docs/04-DATA_MODEL.md dan PRD, laporkan masalah yang kamu temukan, lalu tunggu aku menjalankannya di project Supabase dev.
Setelah itu bangun: src/lib/supabase/{client,server,admin}.ts, halaman /login (email OTP, pesan error ramah Bahasa Indonesia),
middleware sesi, rute terlindungi, pengecekan domain dari ALLOWED_EMAIL_DOMAINS, dan pencatatan event login_succeeded (is_first_login).
Patuhi guardrail kunci service role. Tulis test untuk fungsi cek domain.
```

## Prompt 3: Onboarding dan grid jadwal (T-010 s.d. T-014)
```
Kerjakan T-010 sampai T-014 sesuai US-02 sampai US-05 di docs/01-PRD.md.
Mulai dari skema zod di src/lib/schemas, lalu wizard onboarding (progres tersimpan per langkah), lalu grid jadwal.
Grid: slot 30 menit, tampil 07.00-21.00, tap/seret di layar sentuh, template Pagi/Siang/Sore/Malam, salin ke hari lain, tanda "jangan bagikan" per slot.
Rancang untuk 360px. Catat event onboarding_started dan onboarding_completed (duration_ms).
Kerjakan bertahap dan berhenti untuk review setelah grid jadwal selesai.
```

## Prompt 4: Matching engine, TDD (T-020, T-021)
```
Kerjakan T-020 dan T-021 dengan TDD. Sumber kebenaran: docs/03-MATCHING_ALGORITHM.md.
1. Tulis tes dulu untuk SEMUA 17 kasus di bagian 8 (termasuk Contoh A = 65 dan Contoh B = 99).
2. Implementasikan src/lib/matching (config.ts, intervals.ts, score.ts, rank.ts) sebagai fungsi murni tanpa I/O dan tanpa Date.now()/Math.random().
3. Jika kamu menemukan celah atau kontradiksi di spesifikasi, berhenti dan tanyakan. Jangan mengubah aturan diam-diam.
Laporkan hasil tes.
```

## Prompt 5: API rekomendasi + UI (T-022, T-023)
```
Kerjakan T-022 dan T-023. GET /api/matches harus: ambil user dari sesi, prefilter kandidat di SQL (mata kuliah bersama, onboarding selesai, bukan diblokir),
muat slot shareable kandidat dengan admin client SERVER-ONLY, jalankan rankCandidates, dan kembalikan MatchCardDTO persis seperti di docs/04-DATA_MODEL.md bagian 3.
Dilarang mengembalikan email, kontak, atau slot mentah. Hormati availability_reveal.
UI: kartu rekomendasi dengan chip alasan (maks 3), filter mata kuliah/mode, state loading/kosong/error. State kosong mengarah ke Open Study Board atau bagikan undangan.
Tambahkan tes integrasi yang memeriksa bentuk respons tidak memuat field terlarang.
```

## Prompt 6: Koneksi dan sesi (T-024 s.d. T-027)
```
Kerjakan T-024 sampai T-027 sesuai US-07 sampai US-10.
Ikuti policy RLS di migrasi untuk transisi status koneksi. Reveal kontak hanya lewat RPC get_contact().
suggestSlots sesuai docs/03 bagian 7 dengan tes untuk now yang disuntikkan dan zona waktu APP_TIMEZONE (termasuk jendela yang melewati batas hari).
Catat event connection_requested, connection_accepted, session_created. Cek kapasitas sesi di route handler dan tes.
```

## Prompt 7: Data sintetis (T-028)
```
Kerjakan T-028: scripts/seed-synthetic.ts membuat 150-300 pengguna fiktif via Supabase Admin API (is_demo = true),
dengan sebaran realistis: prodi, 2-6 mata kuliah per orang dengan level/peran/tujuan bervariasi, jadwal yang masuk akal (jam kuliah terisi, malam hari lebih sering kosong).
Nama dan email harus jelas fiktif (domain demo.invalid atau domain demo yang kuberi). Skrip idempoten dan punya mode --reset yang HANYA menghapus is_demo = true.
Jangan jalankan terhadap database produksi/demo tanpa konfirmasiku.
```

## Prompt 8: Open Study Board dan P1 (T-030 s.d. T-034)
```
P0 sudah lolos verifikasi. Kerjakan T-030 (Open Study Board) dulu, sesuai US-11. Satu task, lalu berhenti untuk review.
Sesi terbuka tampil di /board; gabung memeriksa kapasitas di server; sesi penuh tidak bisa diikuti.
```

## Prompt 9: Audit privasi dan RLS (T-016, sebelum pilot)
```
Lakukan audit terhadap checklist di docs/06-TESTING_AND_VALIDATION.md bagian 2.
Tulis skrip tes di tests/ yang mereproduksi tiap butir. Laporkan butir yang gagal beserta akar masalah dan usulan perbaikan; jangan memperbaiki policy tanpa persetujuan.
Periksa juga bundle client untuk string kunci rahasia, dan semua route handler: apakah ada yang mempercayai userId dari input.
```

## Prompt 10: Polesan dan siap demo (T-035, T-036, T-039)
```
Review seluruh alur P0 di lebar 360px. Daftar semua celah: state kosong/loading/error yang hilang, teks Bahasa Indonesia yang janggal, kontras rendah, target sentuh < 44px.
Usulkan perbaikan berurutan dari dampak terbesar; kerjakan setelah kuanggukkan. Lalu uji kinerja /api/matches dengan 500 kandidat sintetis dan laporkan p95.
```

## Prompt darurat: konteks melenceng
```
Berhenti. Baca ulang .clinerules/00 dan 03, lalu memory-bank/activeContext.md.
Jelaskan apa yang sedang kamu kerjakan, task ID-nya, dan apakah itu ada di PRD. Jangan lanjut menulis kode sebelum kita sepakat.
```
