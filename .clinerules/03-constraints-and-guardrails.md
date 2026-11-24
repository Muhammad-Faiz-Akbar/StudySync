# Batasan dan Guardrail

## Ruang lingkup
- Kerjakan hanya yang ada di `docs/01-PRD.md`. Fitur baru: tanya dulu.
- P1 dikerjakan setelah SEMUA P0 selesai dan lulus verifikasi. P2 hanya atas permintaan eksplisit.
- DILARANG menambah: AI/LLM, chat in-app, aplikasi native, pembayaran, integrasi pihak ketiga yang butuh kredensial kampus.
- Satu task = satu perubahan yang bisa direview. Pedoman: sekitar 300 baris diff (tidak termasuk lockfile dan file generated). Lebih besar: pecah dan konfirmasi.

## Privasi dan keamanan (WAJIB, tidak ada pengecualian)
1. Jadwal mentah (`availability_slots`), kontak, dan email user lain TIDAK PERNAH dikirim ke client. Data lintas-user hanya lewat route handler server yang mengembalikan DTO (irisan jadwal, skor, alasan).
2. `SUPABASE_SERVICE_ROLE_KEY` hanya dibaca di `src/lib/supabase/admin.ts` (satu-satunya pengecualian dari aturan env.ts) dan hanya diimpor oleh kode server. Jangan pernah diawali `NEXT_PUBLIC_`.
3. Identitas pelaku selalu dari sesi (`supabase.auth.getUser()`). Jangan percaya `userId` dari body, query, atau header.
4. RLS aktif di semua tabel. Dilarang menonaktifkan RLS atau menambah policy `using (true)` pada tabel berisi data pribadi demi "biar jalan".
5. Kontak hanya terbuka lewat fungsi `get_contact()` setelah koneksi berstatus `accepted`.
6. Dilarang data mahasiswa sungguhan di seed, fixture, test, tangkapan layar, atau dokumen. Data demo wajib sintetis dan diberi flag `is_demo`.
7. Dilarang menaruh PII (email, kontak, nama lengkap) di `console.log` atau `props` event analitik.
8. Validasi semua input di server dengan zod, termasuk batas panjang dan enum.

## Dependensi
- Tanya sebelum menambah paket baru. Jelaskan alasan, ukuran, dan alternatif tanpa paket.
- Jangan pakai paket yang deprecated atau tidak dirawat. Jangan mengunci versi lama tanpa alasan.

## Terminal dan git
- Boleh langsung: `npm run dev|test|lint|typecheck|build`, `git status|diff|log|add|commit`.
- Tanya dulu: `npm install <paket>`, perintah `supabase db reset|push`, `git push`, `git rebase`, menghapus file/folder.
- DILARANG: `rm -rf` di luar `node_modules`/`.next`, `git push --force`, `git reset --hard` tanpa izin, perintah apa pun ke database produksi/demo, `curl | sh`, mencetak isi `.env*` ke percakapan.
- Jangan commit `.env*` (kecuali `.env.example`). Pastikan `.gitignore` memuatnya.

## Kapan harus bertanya (jangan menebak)
- Persyaratan ambigu atau saling bertentangan di dokumen.
- Perubahan skema DB, auth, atau apa pun yang menyentuh privasi.
- Task ternyata jauh lebih besar dari estimasi di `docs/02-PROJECT_PLAN.md`.
