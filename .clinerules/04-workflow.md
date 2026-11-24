# Alur Kerja

## Awal setiap task
1. Baca `memory-bank/activeContext.md` dan `memory-bank/progress.md`.
2. Baca dokumen yang relevan di `docs/` (PRD untuk acceptance criteria, dokumen algoritma/data model bila terkait).
3. Di Plan mode: nyatakan pemahaman, daftar file yang akan disentuh, risiko, dan rencana tes. Tunggu persetujuan sebelum menulis kode.

## Saat mengerjakan (Act mode)
- Langkah kecil. Jalankan `typecheck`, `lint`, dan `test` setelah tiap blok perubahan yang berarti.
- Jika menemukan masalah di luar lingkup task, catat di `memory-bank/activeContext.md` bagian "Catatan/utang teknis". Jangan diperbaiki diam-diam.

## Definition of Done
- [ ] Semua acceptance criteria task terpenuhi (lihat PRD).
- [ ] `npm run typecheck`, `npm run lint`, `npm run test` lulus.
- [ ] Tampilan dicek di lebar 360px; ada state loading, kosong, dan error.
- [ ] Guardrail privasi di `03-constraints-and-guardrails.md` tidak dilanggar.
- [ ] Dokumen diperbarui bila perilaku atau skema berubah.
- [ ] `memory-bank/progress.md` dicentang dan `activeContext.md` diperbarui.
- [ ] Commit dibuat.

## Commit
Conventional Commits dengan ID task, contoh: `feat(matching): add interval overlap calculator (T-020)`.
Tipe: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`. Branch: `feat/T-020-interval-overlap`.

## Laporan akhir task (format)
**Selesai:** apa yang jadi · **File:** daftar ringkas · **Cara verifikasi:** langkah singkat · **Risiko/catatan:** jika ada · **Berikutnya:** task yang disarankan.
