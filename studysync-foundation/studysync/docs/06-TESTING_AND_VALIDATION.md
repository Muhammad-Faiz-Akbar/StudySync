# Testing dan Validasi

## 1. Strategi tes
| Lapisan | Alat | Cakupan | Wajib |
|---|---|---|---|
| Unit | Vitest | `src/lib/matching` dan `src/lib/time` (semua kasus di `03-MATCHING_ALGORITHM.md`), skema zod | Ya |
| Integrasi API | Vitest + Supabase dev | `/api/matches`, `/api/connections`, aturan DTO, kapasitas sesi | Ya (alur utama) |
| Keamanan/RLS | Skrip `tests/rls.*` | Lihat bagian 2 | Ya |
| Manual E2E | Checklist | Alur demo penuh di HP asli | Ya |

## 2. Uji RLS dan privasi (T-016)
Dengan dua akun uji A dan B (data sintetis), menggunakan anon key + sesi masing-masing:
- [ ] A tidak bisa `select` baris `availability_slots` milik B.
- [ ] A tidak bisa `select` `profiles` milik B (hanya lewat `public_profiles`, tanpa kontak).
- [ ] A tidak bisa `select` `user_courses` milik B.
- [ ] `get_contact(B)` kosong sebelum koneksi `accepted`, terisi sesudahnya.
- [ ] Pengguna tanpa sesi (anon) tidak bisa membaca tabel apa pun.
- [ ] A tidak bisa mengubah `is_demo` dirinya.
- [ ] A tidak bisa mengubah status koneksi yang bukan miliknya, atau menerima koneksi yang ia kirim sendiri.
- [ ] Respons `/api/matches` tidak memuat `email`, kontak, atau slot mentah (periksa JSON apa adanya).
- [ ] Bundle client tidak memuat `SUPABASE_SERVICE_ROLE_KEY` (cari string di `.next/static`).

## 3. Checklist manual (sebelum pilot dan sebelum demo)
- [ ] Login dengan domain tidak valid ditolak dengan pesan jelas
- [ ] Onboarding penuh di HP 360px, tanpa scroll horizontal
- [ ] Grid jadwal bisa dipakai dengan satu tangan
- [ ] Rekomendasi tampil dengan alasan; filter berfungsi
- [ ] Kirim → terima → kontak muncul → buat sesi dengan saran slot
- [ ] State kosong, loading, error muncul dengan benar (matikan jaringan sebentar)
- [ ] Pengguna dengan sedikit data tidak membuat halaman rusak

## 4. Protokol uji pengguna
**Tahap 1: Pilot (5–10 teman, T-037).** Tujuan: menemukan hambatan UX dan mengukur M1/M2 awal.
**Tahap 2: Trial (10–20 peserta, T-038).** Tujuan: M1–M5 sebagai bukti di pitch. Laporkan **n sebenarnya**; jangan membulatkan ke 20 jika yang ikut lebih sedikit.

Langkah per peserta:
1. Jelaskan tujuan dan minta persetujuan (lihat `05-PRIVACY_AND_SAFETY.md`). Peserta boleh mundur kapan saja.
2. Tugas: "Daftar, isi mata kuliah dan jadwalmu, temukan satu teman belajar, dan kirim permintaan." Pengamat mencatat waktu dan hambatan, tanpa membantu.
3. Isi kuesioner SUS (10 butir, skala 1–5). Skor: butir ganjil `(nilai − 1)`, butir genap `(5 − nilai)`, jumlahkan lalu `× 2,5`. Rata-rata ≥ 68 dianggap di atas rata-rata umum.
4. Tanyakan: apa yang membingungkan, dan apakah akan memakainya lagi.
5. Anonimkan catatan. Simpan di folder terpisah dari repo.

## 5. Query metrik (jalankan di SQL Editor, abaikan akun demo)
```sql
-- M1: median waktu onboarding (detik)
with s as (
  select e.user_id,
         min(e.created_at) filter (where e.name = 'onboarding_started')   as started,
         min(e.created_at) filter (where e.name = 'onboarding_completed') as done
  from public.events e join public.profiles p on p.id = e.user_id
  where not p.is_demo group by e.user_id)
select percentile_cont(0.5) within group (order by extract(epoch from (done - started))) as median_seconds
from s where started is not null and done is not null;

-- M2: median waktu login pertama -> permintaan koneksi pertama (detik)
with f as (
  select e.user_id,
         min(e.created_at) filter (where e.name = 'login_succeeded' and e.props->>'is_first_login' = 'true') as login_at,
         min(e.created_at) filter (where e.name = 'connection_requested') as req_at
  from public.events e join public.profiles p on p.id = e.user_id
  where not p.is_demo group by e.user_id)
select percentile_cont(0.5) within group (order by extract(epoch from (req_at - login_at))) as median_seconds
from f where login_at is not null and req_at is not null;

-- M3: % pengguna yang membuat/ikut >= 1 sesi
select round(100.0 * count(distinct e.user_id) /
  nullif((select count(*) from public.profiles where not is_demo and onboarding_completed_at is not null), 0), 1) as pct
from public.events e join public.profiles p on p.id = e.user_id
where not p.is_demo and e.name in ('session_created', 'session_joined');

-- M4: acceptance rate
select round(100.0 * count(*) filter (where status = 'accepted') / nullif(count(*), 0), 1) as pct
from public.connections;
```

## 6. Format pelaporan di pitch
Tampilkan: n peserta, median M1 dan M2, M3, SUS rata-rata, dan satu kutipan peserta (dengan izin). Sebutkan keterbatasan: sampel kecil dan kemudahan, satu kampus, periode singkat.
