# Telaah Mind Map + Abstrak, dan Perbaikan yang Diusulkan

## 1. Yang dibaca
- **Mind map:** ide StudySync, 3 masalah, stack, kebutuhan (dokumen, core engine, DB/auth, UI/UX), dan action plan 6 langkah (baru langkah 1, abstrak, yang selesai).
- **Abstrak (sudah disubmit):** problem, pengguna, bukti survei (28 dari 35), solusi + 4 langkah alur, pembeda, teknologi (tanpa AI, data sintetis), manfaat dan rencana 3 minggu, risiko privasi.

Fondasi idenya kuat: masalah jelas, cakupan sempit, tanpa AI sehingga realistis, dan risiko privasi sudah dikenali sejak awal. Yang perlu dirapikan adalah beberapa ketidakkonsistenan antara kedua dokumen dan beberapa lubang yang akan terasa saat membangun dan saat juri bertanya.

## 2. Selisih mind map vs abstrak, dan keputusannya

| Aspek | Mind map | Abstrak | Keputusan |
|---|---|---|---|
| Auth | SSO / email kampus | Akun kampus | **Email kampus + OTP** (SSO resmi butuh kerja sama IT kampus, tidak realistis 3 minggu). ADR-002 |
| Backend | Node.js atau FastAPI | (tidak disebut) | **Satu stack: Next.js + Supabase.** ADR-001 |
| Parameter matching | Mata kuliah, level, gaya belajar, slot waktu | Mata kuliah, jadwal, tujuan belajar | **Gabungan:** mata kuliah, level, peran, tujuan, mode, slot. "Gaya belajar" dijadikan preferensi praktis (online/offline), bukan tes gaya belajar, karena bukti ilmiah untuk mencocokkan gaya belajar lemah |
| Onboarding | < 2 menit | (tidak ada) | Jadi **metrik M1** |
| Waktu menemukan partner | (tidak ada) | < 3 menit | Jadi **metrik M2**, didefinisikan eksplisit |
| Peer accountability | Disebut sebagai masalah #3 | Tidak ada fitur yang menjawab | Tambah di **P1**: pengingat, feedback hadir/tidak, rating 1-tap |
| Validasi | Uji coba 5–10 teman | Trial 20 peserta selama 2 minggu | **Dua tahap:** pilot 5–10 orang, lalu trial 20 orang |
| Timeline | 6 langkah action plan | 3 minggu dev + 2 minggu trial | Lihat poin 3.3 |

## 3. Temuan dan perbaikan (urut prioritas)

### 3.1 Cold start (risiko terbesar yang belum ada di abstrak)
Platform pencocokan yang pengguna awalnya sedikit akan tampak kosong dan gagal membuktikan nilainya, baik di demo maupun di trial.
**Perbaikan:**
- **Open Study Board (P1):** sesi terbuka yang bisa langsung diikuti ("Kalkulus UTS, Rabu 19.00, sisa 2 kursi"). Bernilai walau pengguna masih sedikit, karena orientasinya sesi, bukan orang.
- Seed data sintetis (150–300 pengguna) untuk demo, ditandai jelas sebagai demo.
- Tautan undangan per kelas/angkatan agar pengguna nyata masuk berkelompok.

### 3.2 Metrik perlu didefinisikan operasional
Abstrak menyebut "< 3 menit" dan "session creation rate". Mind map menyebut "onboarding < 2 menit". Ketiganya perlu definisi pengukuran yang jelas supaya bisa dibuktikan:

| Kode | Metrik | Definisi | Target awal |
|---|---|---|---|
| M1 | Waktu onboarding | `onboarding_completed` − `onboarding_started` | median ≤ 120 dtk |
| M2 | Waktu ke permintaan pertama | login pertama → `connection_requested` pertama | median ≤ 180 dtk |
| M3 | Session creation rate | % peserta trial yang membuat atau ikut ≥ 1 sesi | ≥ 50% (hipotesis; sesuaikan setelah pilot) |
| M4 | Match acceptance rate | koneksi diterima / diminta | dicatat, tanpa target |
| M5 | Kepuasan | skor SUS dan rata-rata rating sesi | SUS ≥ 68; rating ≥ 4/5 |

Semua dikumpulkan lewat tabel `events` (lihat `04-DATA_MODEL.md`), sehingga angka di pitch berasal dari data, bukan klaim.

### 3.3 Timeline abstrak vs realita
Abstrak: 3 minggu pengembangan + trial 2 minggu dengan 20 peserta = sekitar 5 minggu. Belum tentu muat sebelum deadline.
**Usulan:** trial dimulai di minggu ke-3 sebagai pilot 3–5 hari (target 10–20 peserta), sisanya dijelaskan jujur sebagai rencana lanjutan. Sesuaikan tanggal di `02-PROJECT_PLAN.md` setelah deadline pasti diketahui.

### 3.4 Konsistensi bukti survei
Di abstrak, sumber survei diberi label "fictional context for STACK 2026". Kalau data itu memang bagian dari konteks lomba, pastikan di pitch tidak disajikan sebagai hasil riset nyata. Kalau memungkinkan, lakukan survei singkat sungguhan (Google Form, 30+ responden, 5 pertanyaan) dan jadikan itu bukti utama. Sebutkan juga ukuran sampel (n) dan sifatnya (sampel kemudahan), jangan digeneralisasi.

### 3.5 Privasi sebagai pembeda, bukan sekadar mitigasi
Abstrak menjanjikan "kontrol visibilitas granular". Implementasi konkretnya:
- Jadwal mentah **tidak pernah** meninggalkan server. Pengguna lain hanya menerima **irisan** jadwal.
- Tiga tingkat kontrol: `discoverable` (boleh direkomendasikan atau tidak), `availability_reveal` (irisan terlihat sebelum atau sesudah koneksi diterima), dan `is_shareable` per slot (slot yang tidak dipakai matching).
- Kontak (WhatsApp/Telegram/Discord) baru terbuka setelah kedua pihak setuju.

### 3.6 Matching harus bisa dijelaskan
Tampilkan alasan di setiap rekomendasi ("3 mata kuliah sama, irisan 4 jam/minggu, kamu butuh bantuan dan dia bisa membantu"). Ini sekaligus menjawab pertanyaan "kenapa tanpa AI?" dan menjadi pembeda yang bisa didemokan.

### 3.7 Peer accountability
Mind map menyebut kurangnya peer accountability sebagai akar masalah, tapi tidak ada fitur yang menjawabnya. Fitur ringan (P1): pengingat sesi, konfirmasi hadir, rating 1-tap. Tanpa gamifikasi berlebihan.

### 3.8 Pembeda vs alternatif perlu lebih tajam
Perbandingan yang bisa dipakai di pitch:

| Alternatif | Kekurangan untuk kasus ini | StudySync |
|---|---|---|
| Grup WhatsApp/Telegram besar | Tidak terstruktur, tidak ada filter mata kuliah/jadwal | Filter dan skor otomatis |
| Alat jadwal (When2meet, Doodle) | Hanya untuk grup yang sudah saling kenal | Menemukan orang yang belum dikenal |
| Kalender pribadi | Tidak membandingkan antar-orang | Irisan jadwal otomatis, privasi terjaga |

### 3.9 Hal teknis yang dikunci agar tidak membingungkan Cline
- Tipe jadwal: mingguan berulang, slot 30 menit, disimpan sebagai menit sejak 00:00 (ADR-006).
- Tidak ada chat in-app. Setelah koneksi diterima, kontak yang dipilih pengguna dibuka (ADR-005).
- Matching dihitung di server dengan fungsi murni yang bisa dites (ADR-003, ADR-004).

## 4. Komitmen abstrak yang dijaga
Karena abstrak sudah disubmit, semua dokumen lanjutan (proposal teknis, pitch deck) harus konsisten dengan: web responsif, database relasional, matching buatan sendiri, **tanpa AI**, data awal sintetis, alur 4 langkah, kontrol visibilitas granular, target < 3 menit, rencana 3 minggu, trial 20 peserta. Tambahan di atas bersifat memperkuat, tidak menggantikan.

## 5. Keterlacakan: action plan mind map ke rencana
| Action plan (mind map) | Task di `02-PROJECT_PLAN.md` |
|---|---|
| Administrasi & Abstrak | Selesai |
| Desain Algoritma Matching | `03-MATCHING_ALGORITHM.md`, T-020, T-021 |
| Bangun MVP Frontend | T-004, T-011–T-015, T-023, T-027 |
| Integrasi Backend & Scheduling | T-022, T-024–T-026 |
| Validasi & User Testing | T-037, T-038 (+ `06-TESTING_AND_VALIDATION.md`) |
| Pitching & Demo | D-001–D-005 (+ `07-PITCH_AND_DEMO.md`) |

## 6. Pertanyaan terbuka (isi, lalu catat di `memory-bank/activeContext.md`)
1. Tanggal deadline pengumpulan dan tanggal demo/pitch final.
2. Nama kampus dan domain email resmi mahasiswa.
3. Pembagian peran 4 anggota (usulan di `02-PROJECT_PLAN.md`).
4. Apakah rubrik Case 1 memberi bobot khusus (inovasi, dampak, kelayakan teknis)? Sesuaikan penekanan pitch.

## 7. Pembaruan: umpan balik juri Semifinal
Skor 61,0/100. P1 Problem Clarity 1/5 (bobot 30%) dan P3 Value and Originality 3/5 (bobot 25%) adalah penyebab utama. Juri persis menunjuk hal yang ditandai di butir 3.4: survei berlabel "fictional context" tidak dianggap bukti kebutuhan nyata. Juri juga menyebut pembeda dari alternatif masih umum (butir 3.8 perlu dipertajam dengan uji nyata).
Detail hitungan dampak, kuesioner, dan rencana pembeda ada di `10-EVIDENCE_PLAN.md`. Tugas terkait: V-001 s.d. V-006 di `02-PROJECT_PLAN.md`.
