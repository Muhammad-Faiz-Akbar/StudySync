# StudySync: Konteks Proyek (baca dulu)

StudySync adalah web app mobile-first yang mencocokkan mahasiswa sebagai teman belajar berdasarkan mata kuliah, jadwal kosong mingguan, dan tujuan belajar, lalu membantu menjadwalkan sesi belajar. Proyek lomba STACK 2026 (Case 1: Smarter Campus and Learning), Tim Ngawur.

## Komitmen abstrak (sudah disubmit, tidak boleh dilanggar)
- Web app responsif (mobile-first), database relasional, algoritma matching buatan sendiri.
- TIDAK ada AI/LLM. Matching berbasis aturan (irisan jadwal + tag mata kuliah).
- Alur inti 4 langkah: login kampus, isi mata kuliah dan jadwal kosong, lihat rekomendasi, koneksi atau jadwalkan sesi.
- Data awal sintetis. Kontrol visibilitas jadwal yang granular wajib ada.
- Target: onboarding < 2 menit, temukan partner < 3 menit.

## Aturan bukti (dari umpan balik juri)
- Jangan menulis atau memakai angka survei 28/35 di kode, copy UI, atau dokumen. Juri menilainya fiktif.
- Jangan mengarang statistik, kutipan, atau testimoni. Bukti hanya dari data sungguhan tim (`docs/10-EVIDENCE_PLAN.md`) atau tabel `events`.

## Sumber kebenaran (urutan prioritas)
1. Komitmen abstrak di atas
2. `docs/01-PRD.md`
3. `docs/03-MATCHING_ALGORITHM.md` dan `docs/04-DATA_MODEL.md`
4. `docs/09-DECISIONS.md`
5. File lain

Jika permintaan pengguna bertentangan dengan butir 1, JANGAN langsung dikerjakan. Tanyakan dulu.

## Bahasa
- Teks UI: Bahasa Indonesia (sopan-santai, sapaan "kamu").
- Kode, nama variabel, komentar, pesan commit: Bahasa Inggris.
- Dokumen di `docs/` dan `memory-bank/`: Bahasa Indonesia.
