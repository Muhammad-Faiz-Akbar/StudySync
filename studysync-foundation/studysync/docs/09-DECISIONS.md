# Catatan Keputusan Arsitektur (ADR)

Format: Konteks → Keputusan → Alasan → Konsekuensi. Tambah ADR baru di bawah; jangan hapus yang lama (tandai "Digantikan oleh ADR-xxx").

## ADR-001: Next.js + Supabase (satu stack)
- **Konteks:** mind map menyebut Node.js atau FastAPI; tim 4 orang, 3 minggu.
- **Keputusan:** Next.js (App Router, TypeScript) + Supabase (PostgreSQL, Auth, RLS), deploy di Vercel.
- **Alasan:** satu bahasa untuk frontend dan backend, auth + DB + RLS siap pakai, deploy cepat, cocok untuk dikerjakan bersama Cline.
- **Konsekuensi:** tidak ada layanan Python terpisah. Matching berjalan di route handler server. Bila kelak perlu skala besar, engine murni mudah dipindah ke layanan sendiri.

## ADR-002: Email kampus + OTP, bukan SSO
- **Konteks:** mind map menulis "SSO/email kampus".
- **Keputusan:** login dengan email domain kampus + OTP (Supabase Auth). Domain dikonfigurasi; trigger DB opsional untuk memaksa domain.
- **Alasan:** SSO resmi butuh kerja sama IT kampus, tidak realistis dalam 3 minggu.
- **Konsekuensi:** juri tanpa email kampus memakai akun demo (email + password, `DEMO_MODE`). Jalur SSO dicatat sebagai rencana ke depan.

## ADR-003: Matching berbasis aturan dan bisa dijelaskan
- **Keputusan:** skor berbobot dari irisan jadwal, kecocokan peran/level/tujuan, jumlah mata kuliah bersama, dan mode (lihat `03-MATCHING_ALGORITHM.md`). Tanpa AI/LLM.
- **Alasan:** sesuai abstrak; transparan; mudah dites; cukup untuk masalah inti.
- **Konsekuensi:** bobot awal adalah hipotesis. Boleh dituning dari data pilot, dicatat di sini.

## ADR-004: Privasi lewat DTO server
- **Keputusan:** client hanya membaca datanya sendiri. Data lintas-user dihitung di server dan dikirim sebagai DTO minimal (irisan, skor, alasan). Jadwal mentah dan kontak tidak pernah dikirim.
- **Alasan:** menepati janji "kontrol visibilitas granular" dan membuat privasi tidak bergantung pada kebenaran logika di browser.
- **Konsekuensi:** admin client (service role) dipakai di server, jadi wajib ada disiplin identitas dari sesi dan audit (T-016).

## ADR-005: Tanpa chat in-app
- **Keputusan:** setelah koneksi diterima, kontak yang dipilih pengguna (WhatsApp/Telegram/Discord/email) dibuka.
- **Alasan:** chat real-time menambah kompleksitas dan moderasi yang tidak sepadan untuk MVP; mahasiswa sudah terbiasa dengan WhatsApp.
- **Konsekuensi:** risiko pergeseran ke aplikasi lain diterima. Nilai produk ada di pencocokan dan penjadwalan.

## ADR-006: Jadwal mingguan berulang, slot 30 menit
- **Keputusan:** simpan sebagai (hari 0–6, menit mulai, menit selesai) kelipatan 30; ubah ke tanggal konkret hanya saat menyarankan sesi, memakai `APP_TIMEZONE`.
- **Alasan:** sederhana, cepat diisi (onboarding < 2 menit), irisan mudah dihitung.
- **Konsekuensi:** tidak mendukung pengecualian per-tanggal (libur, ujian). Dicatat sebagai keterbatasan.

## ADR-007: Open Study Board untuk cold start (P1)
- **Keputusan:** sesi terbuka yang bisa diikuti langsung, di luar pencocokan antar-orang.
- **Alasan:** memberi nilai saat basis pengguna kecil; mendukung demo dan trial.
- **Konsekuensi:** menambah satu layar dan aturan kapasitas. Dipotong paling akhir dari garis potong.
