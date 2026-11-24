# Spesifikasi Algoritma Matching (v1)

Rule-based, deterministik, dan bisa dijelaskan. Tanpa AI. Diimplementasikan sebagai fungsi murni di `src/lib/matching/`. Semua konstanta ada di `config.ts`.

## 1. Kontrak (tipe)
```ts
type Role = 'learn' | 'help' | 'both';
type Goal = 'exam_prep' | 'assignment' | 'project' | 'concept';
type Mode = 'online' | 'offline' | 'either';
type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Senin

interface CourseEntry { courseId: string; level: 1|2|3|4|5; role: Role; goal: Goal }
interface Interval { day: Day; startMin: number; endMin: number } // kelipatan 30, 0..1440

interface MatchProfile {
  userId: string;
  courses: CourseEntry[];
  slots: Interval[];        // hanya slot is_shareable = true
  mode: Mode;
  discoverable: boolean;
}

type ReasonCode = 'SHARED_COURSES' | 'ROLE_COMPLEMENT' | 'SAME_GOAL'
                | 'SIMILAR_LEVEL' | 'ENOUGH_OVERLAP' | 'SAME_MODE';

interface MatchResult {
  candidateId: string;
  score: number;            // integer 0..100
  bestCourseId: string;
  sharedCourseIds: string[];
  overlap: Interval[];      // jendela irisan >= MIN_WINDOW_MIN
  overlapMinutes: number;
  components: { availability: number; fit: number; breadth: number; mode: number }; // 0..1
  reasons: ReasonCode[];
}

function rankCandidates(
  viewer: MatchProfile,
  candidates: MatchProfile[],
  opts?: { limit?: number; excludeIds?: ReadonlySet<string> }
): MatchResult[];
```

## 2. Konstanta (`config.ts`)
| Nama | Nilai |
|---|---|
| `MIN_WINDOW_MIN` | 60 |
| `TARGET_OVERLAP_MIN` | 240 |
| `BREADTH_TARGET` | 3 |
| `WEIGHTS` | availability 0.40 · fit 0.30 · breadth 0.20 · mode 0.10 |
| `DEFAULT_LIMIT` | 10 |

## 3. Filter keras (kandidat dibuang jika)
1. Kandidat = viewer, atau ada di `excludeIds` (diisi route handler: diblokir kedua arah, koneksi aktif untuk mata kuliah terkait).
2. `discoverable = false`.
3. Tidak ada mata kuliah bersama.
4. Tidak ada jendela irisan ≥ `MIN_WINDOW_MIN`.

## 4. Irisan jadwal
1. Per hari, urutkan interval lalu **gabungkan** yang bersentuhan atau tumpang tindih (`end == start` ikut digabung).
2. Irisan viewer ∩ kandidat per hari dengan two-pointer.
3. Buang jendela < `MIN_WINDOW_MIN`.
4. `overlapMinutes` = jumlah panjang jendela yang tersisa.

## 5. Komponen skor (semua 0..1)
- **availability** = `min(overlapMinutes / TARGET_OVERLAP_MIN, 1)`
- **breadth** = `min(jumlahMataKuliahBersama / BREADTH_TARGET, 1)`
- **mode**: sama-sama konkret dan sama = 1; salah satu `either` = 0,8; online vs offline = 0,2
- **fit** dihitung untuk setiap mata kuliah bersama, diambil yang terbaik (`bestCourseId`):
  `fit = 0,40·roleCompat + 0,35·levelFit + 0,25·goalFit`

**roleCompat** (simetris):
| | learn | help | both |
|---|---|---|---|
| **learn** | 0,8 | 1,0 | 0,9 |
| **help** | 1,0 | 0,4 | 0,7 |
| **both** | 0,9 | 0,7 | 0,9 |

**levelFit**
- Pasangan tutor (satu `learn`, satu `help`): `helper > learner` = 1,0 · sama = 0,5 · `helper < learner` = 0,1.
- Selain itu (peer): `1 − |Δlevel| / 4`.

**goalFit**: tujuan sama = 1,0; berbeda = 0,4.

**Skor akhir** = `round(100 · (0,40·availability + 0,30·fit + 0,20·breadth + 0,10·mode))`.

Seri skor: urut `overlapMinutes` menurun, lalu jumlah mata kuliah bersama menurun, lalu `candidateId` menaik. Tie pada `bestCourseId`: ambil `courseId` terkecil secara leksikografis.

## 6. Alasan (`reasons`)
- `SHARED_COURSES`: ≥ 2 mata kuliah bersama
- `ROLE_COMPLEMENT`: pasangan tutor pada `bestCourseId`
- `SAME_GOAL`: tujuan sama pada `bestCourseId`
- `SIMILAR_LEVEL`: pasangan peer dengan `|Δlevel| ≤ 1`
- `ENOUGH_OVERLAP`: `overlapMinutes ≥ TARGET_OVERLAP_MIN`
- `SAME_MODE`: mode sama-sama konkret dan sama

UI memetakan kode ke kalimat Bahasa Indonesia (maks 3 chip, urut prioritas: `ROLE_COMPLEMENT`, `ENOUGH_OVERLAP`, `SHARED_COURSES`, `SAME_GOAL`, `SIMILAR_LEVEL`, `SAME_MODE`).

## 7. Saran slot konkret
```ts
suggestSlots(input: {
  overlap: Interval[]; now: Date; tz: string;
  durationMin: 60 | 90 | 120; count?: number;       // default 3
  minLeadMin?: number; horizonDays?: number;        // default 120, 14
}): { startsAt: Date; endsAt: Date }[]
```
- Menerjemahkan jendela mingguan ke tanggal nyata di `tz` dalam `horizonDays`.
- Mulai paling cepat `now + minLeadMin`, dibulatkan ke atas ke kelipatan 30 menit; jendela harus cukup memuat `durationMin`.
- Ambil kandidat paling awal, utamakan hari yang berbeda. Deterministik karena `now` disuntikkan.

## 8. Kasus uji wajib
| # | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Viewer sama dengan kandidat | Dibuang |
| 2 | `discoverable=false` | Dibuang |
| 3 | Tidak ada mata kuliah bersama | Dibuang |
| 4 | Irisan 59 menit | Dibuang |
| 5 | Irisan 60 menit | Lolos |
| 6 | Interval bersentuhan (09.00–10.00 dan 10.00–11.00) lawan 09.30–10.30 | Digabung, irisan 60 menit |
| 7 | Hari berbeda, jam sama | Dibuang |
| 8 | Slot `is_shareable=false` (tidak dikirim ke engine) | Tidak memengaruhi irisan |
| 9 | learn ↔ help, helper level 4 vs learner 2, tujuan sama | `fit = 1,0`, ada `ROLE_COMPLEMENT` + `SAME_GOAL` |
| 10 | learn ↔ help, helper level lebih rendah | `levelFit = 0,1` |
| 11 | Contoh hitung A (di bawah) | Skor 65 |
| 12 | Contoh hitung B (di bawah) | Skor 99 |
| 13 | Input sama dipanggil dua kali, dan urutan kandidat diacak | Output identik |
| 14 | Dua kandidat skor sama | Urutan sesuai aturan seri |
| 15 | Semua skor | Integer 0..100 |
| 16 | `limit` | Hasil ≤ limit |
| 17 | `excludeIds` | ID tersebut tidak muncul |

**Contoh A.** Viewer: mata kuliah K (level 2, `learn`, `exam_prep`), mode `either`, Senin 08.00–12.00. Kandidat: K (level 4, `help`, `exam_prep`), mode `offline`, Senin 10.00–14.00. Irisan 120 menit → availability 0,5; fit 1,0; breadth 1/3; mode 0,8. Skor = 100·(0,20 + 0,30 + 0,0667 + 0,08) = 64,67 → **65**.

**Contoh B.** Berbagi 3 mata kuliah, keduanya `both`, level sama, tujuan sama, irisan ≥ 240 menit, mode sama. fit = 0,40·0,9 + 0,35 + 0,25 = 0,96. Skor = 100·(0,40 + 0,288 + 0,20 + 0,10) = 98,8 → **99**.

## 9. Pengembangan lanjut (di luar v1)
Skor keandalan (riwayat kehadiran), matching grup 3–5 orang, pembobotan ulang dari data pilot. Perubahan bobot harus dicatat di `09-DECISIONS.md` beserta alasannya.
