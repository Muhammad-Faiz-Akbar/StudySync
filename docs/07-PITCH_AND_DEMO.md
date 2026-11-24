# Pitch dan Demo

## 1. Alur cerita (satu kalimat per langkah)
Masalah nyata → bukti → solusi dalam 4 langkah → demo → hasil uji → kenapa layak dan apa berikutnya.

## 2. Kerangka pitch deck (8–10 slide)
1. **Judul:** StudySync, Tim Ngawur, Case 1.
2. **Masalah:** cerita singkat Rani (persona fiktif) yang tidak menemukan teman belajar Kalkulus.
3. **Bukti:** hasil survei dan wawancara SUNGGUHAN dari `10-EVIDENCE_PLAN.md` (n, cara sebar, keterbatasan) + kutipan. Jangan memakai angka 28/35 dari abstrak: juri sudah menolaknya karena berlabel fiktif.
4. **Solusi:** 4 langkah alur inti dalam satu visual.
5. **Demo** (atau tangkapan layar jika demo live gagal).
6. **Cara kerja:** aturan matching yang bisa dijelaskan + diagram privasi (jadwal mentah tidak keluar server).
7. **Beda dari alternatif:** tabel dari uji nyata 3 alternatif (V-005) + hipotesis "menghilangkan negosiasi jadwal" dan hasil tes baseline (V-006).
8. **Hasil uji:** M1–M5 dari data sungguhan, dengan jujur menyebut keterbatasan.
9. **Risiko dan jawabannya:** cold start (Open Study Board), privasi, no-show.
10. **Rencana ke depan:** pilot satu fakultas, integrasi kalender, matching grup.

## 3. Skrip demo 3 menit
| Waktu | Aksi | Kalimat kunci |
|---|---|---|
| 0:00–0:20 | Masalah | "Rani butuh teman belajar Kalkulus tapi tidak kenal siapa pun yang senggang di jam yang sama." |
| 0:20–1:00 | Login akun demo baru, onboarding kilat (mata kuliah + template jadwal) | "Profil selesai di bawah dua menit." |
| 1:00–1:40 | Halaman rekomendasi, buka satu kartu, tunjuk alasan dan irisan | "Setiap rekomendasi ada alasannya. Tidak ada kotak hitam, dan jadwal lengkapnya tidak pernah dilihat orang lain." |
| 1:40–2:20 | Kirim permintaan, ganti ke akun kedua, terima, kontak muncul | "Kontak baru terbuka setelah kedua pihak setuju." |
| 2:20–2:50 | Buat sesi dari saran slot sistem | "Sistem mengusulkan jam yang sama-sama kosong. Tinggal pilih." |
| 2:50–3:00 | Tutup dengan metrik | "Di uji coba kami, median waktu ke permintaan pertama [X] detik (n=[N])." |

Persiapan: dua perangkat/tab dengan akun demo yang sudah login, satu akun baru untuk onboarding, data sintetis sudah terisi, mode demo aktif, video cadangan siap.

## 4. Antisipasi pertanyaan juri
| Pertanyaan | Poin jawaban |
|---|---|
| Kenapa tanpa AI? | Aturan jadwal dan mata kuliah sudah menyelesaikan masalah inti; hasilnya transparan dan bisa dijelaskan; AI hanya menambah risiko dan biaya tanpa nilai tambah jelas di versi ini. Bobot bisa dituning dari data pilot. |
| Bagaimana kalau penggunanya sedikit? | Open Study Board (orientasi sesi, bukan orang), undangan per kelas, mulai dari satu fakultas. |
| Bagaimana privasi jadwal? | Jadwal mentah tidak keluar dari server, hanya irisan; kontrol 3 tingkat; kontak tertutup sampai disetujui. |
| Apa bedanya dengan grup WhatsApp? | Filter mata kuliah dan jadwal otomatis, skor dan alasan, penjadwalan langsung. |
| Bagaimana mencegah penyalahgunaan? | Domain kampus + OTP, kontak tertutup, block/report, tolak tanpa alasan. |
| Apakah bisa berkembang ke kampus lain? | Katalog mata kuliah dan domain email dikonfigurasi; arsitektur tidak terikat satu kampus. |
| Seberapa valid datanya? | Jujur: sampel kecil dan kemudahan; kami melaporkan n sebenarnya dan keterbatasannya. |
| Bagaimana keberlanjutannya? | Biaya rendah (Vercel + Supabase tier gratis untuk pilot); jalur adopsi lewat unit kemahasiswaan atau dosen pengampu. |

## 5. Rencana cadangan
- Video demo penuh (D-004) yang bisa diputar offline.
- Tangkapan layar tiap langkah di slide 5.
- Hotspot ponsel; uji di jaringan seluler sehari sebelumnya.
- Akun demo kedua jika satu akun kena kendala.
