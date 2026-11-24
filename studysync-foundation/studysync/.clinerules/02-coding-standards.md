# Standar Kode

## TypeScript
- `strict: true`. Dilarang `any`. `@ts-expect-error` hanya dengan komentar alasan.
- Gunakan tipe turunan dari skema zod (`z.infer`) agar form, API, dan tipe tidak menyimpang.
- Fungsi murni diutamakan. Efek samping (DB, waktu, acak) disuntikkan sebagai parameter agar bisa dites.

## Next.js
- Default ke Server Component. `"use client"` hanya untuk interaksi (grid jadwal, form, toggle).
- Route handler: validasi input dengan zod, ambil user dari sesi, kembalikan DTO kecil dengan status HTTP yang benar.
- Jangan fetch data sendiri di client lewat Supabase untuk data lintas-user. Lihat guardrail privasi.

## Matching engine (`src/lib/matching`)
- Tanpa import dari `next`, `react`, atau `@supabase/*`. Tanpa `Date.now()` atau `Math.random()`.
- Output deterministik: input sama menghasilkan urutan dan skor sama.
- Wajib ada unit test untuk setiap aturan di `docs/03-MATCHING_ALGORITHM.md`. Tes ditulis lebih dulu atau bersamaan.

## UI/UX
- Mobile-first: rancang untuk 360x640, uji tanpa scroll horizontal. Target sentuh minimal 44px.
- Wajib ada state loading, kosong, dan error di setiap layar data. State kosong harus mengarahkan ke aksi berikutnya.
- Aksesibilitas: label pada input, kontras AA, fokus terlihat, jangan andalkan warna saja.
- Teks error ramah dan spesifik, dalam Bahasa Indonesia. Jangan tampilkan pesan error mentah dari DB.

## Kebersihan
- Tidak ada kode yang di-comment-out, `console.log` sisa debug, atau TODO tanpa ID task (`TODO(T-012): ...`).
- Komponen > 200 baris atau fungsi > 50 baris: pecah.
- Jangan melemahkan atau menghapus test agar lulus. Perbaiki penyebabnya.
