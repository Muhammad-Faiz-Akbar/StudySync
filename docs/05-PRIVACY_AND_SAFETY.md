# Privasi dan Keamanan

Dokumen ini bukan nasihat hukum. Untuk penggunaan nyata di kampus, konsultasikan dengan pihak yang berwenang. Prinsip dasar di sini selaras dengan semangat UU No. 27/2022 tentang Pelindungan Data Pribadi (persetujuan jelas, minimalisasi data, hak hapus).

## 1. Prinsip
1. **Minimalisasi:** hanya kumpulkan yang dipakai matching. Tidak ada NIM, foto, atau lokasi GPS.
2. **Privasi by design:** jadwal mentah tidak pernah keluar dari server; pengguna lain hanya menerima irisan.
3. **Persetujuan bertahap:** kontak baru terbuka setelah kedua pihak setuju.
4. **Kendali pengguna:** bisa menyembunyikan diri dari rekomendasi, menyembunyikan slot tertentu, dan menghapus akun.

## 2. Inventaris data
| Data | Tujuan | Siapa yang bisa melihat | Retensi |
|---|---|---|---|
| Email kampus | Login | Hanya sistem | Sampai akun dihapus |
| Nama tampilan, prodi, angkatan, bio | Kartu rekomendasi | Pengguna lain (profil publik) | Sampai akun dihapus |
| Mata kuliah, level, peran, tujuan | Matching | Hanya mata kuliah bersama yang tampil | Sampai akun dihapus |
| Jadwal kosong | Matching | Pemilik; orang lain hanya irisan | Sampai akun dihapus |
| Kontak (WA/Telegram/dll.) | Koordinasi setelah koneksi | Hanya koneksi `accepted` | Sampai akun dihapus |
| Event analitik | Mengukur metrik | Tim (agregat) | Hapus/anonimkan setelah evaluasi |

## 3. Aturan teknis (selaras dengan `.clinerules/03`)
- Semua tabel RLS aktif. Data lintas-user hanya lewat route handler → DTO.
- Service role key hanya di server. Identitas pelaku selalu dari sesi.
- Tidak ada PII di log dan `events.props`.
- Hapus akun menghapus `profiles` beserta data turunan (cascade). Sediakan tombol "Hapus akun saya" (T-015 atau backlog) dan jelaskan efeknya.
- Data demo: sintetis penuh, flag `is_demo`, tidak berasal dari mahasiswa sungguhan.

## 4. Teks persetujuan (draf, tampil di onboarding)
> **Cara StudySync memakai datamu.** Jadwal kosongmu dipakai hanya untuk mencari kecocokan. Orang lain tidak pernah melihat jadwal lengkapmu, hanya jam yang sama-sama kosong. Kontakmu baru terlihat setelah kamu dan temanmu sama-sama setuju. Kamu bisa menyembunyikan diri atau menghapus akunmu kapan saja di Pengaturan.

## 5. Risiko dan mitigasi
| Risiko | Mitigasi |
|---|---|
| Kebocoran jadwal/kontak lewat bug RLS atau API | Aturan DTO, T-016 (uji RLS), review privasi sebelum pilot |
| Pelecehan atau pesan tidak diinginkan | Kontak tertutup sampai kedua pihak setuju; block/report (P1); tolak tanpa alasan |
| Menyamar sebagai mahasiswa kampus | Domain email kampus + OTP; akun demo terpisah |
| Scraping daftar pengguna | Batas 10 hasil, wajib login, tanpa endpoint daftar user, rate limit dasar |
| Pertemuan tatap muka tidak aman | Saran tampil di UI: bertemu di tempat umum kampus, beri tahu teman |
| Tidak hadir (no-show) | Pengingat, feedback hadir/tidak (P1) |
| Peserta pilot merasa diawasi | Persetujuan tertulis, data dianonimkan, bisa mundur kapan saja |
