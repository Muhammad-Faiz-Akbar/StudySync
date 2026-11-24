# Tech Stack dan Struktur

## Stack (jangan ganti tanpa persetujuan)
- Next.js App Router, TypeScript `strict`, Tailwind CSS. Pakai versi stabil terbaru, jangan downgrade.
- Supabase: PostgreSQL, Auth (email OTP), Row Level Security. Paket: `@supabase/supabase-js`, `@supabase/ssr`.
- Validasi: `zod`. Test: `vitest`. Tanggal/zona waktu: `date-fns` + `@date-fns/tz` (satu library saja).
- UI: komponen sendiri dengan Tailwind; `shadcn/ui` dan `lucide-react` boleh dipakai.
- Deploy: Vercel + Supabase. Package manager: npm.

## Struktur folder
```
src/
  app/                 # route (App Router); route handler di app/api/*
  components/ui/       # primitif UI umum
  components/features/ # komponen per fitur (onboarding, matches, sessions, ...)
  lib/
    matching/          # ENGINE MURNI: tanpa I/O, tanpa Supabase, tanpa Date.now()
    supabase/          # client.ts (browser), server.ts (SSR), admin.ts (server-only)
    schemas/           # skema zod yang dipakai form DAN API
    time/              # helper zona waktu, interval, slot
    env.ts             # validasi env dengan zod, satu-satunya pintu baca process.env
  types/
supabase/migrations/   # SQL bernomor, tidak pernah diedit setelah dipakai (buat migrasi baru)
scripts/               # seed-synthetic.ts, dll.
tests/                 # unit (matching, time) dan pengecekan RLS
```

## Konvensi
- File: kebab-case. Komponen React: PascalCase. Tipe/interface: PascalCase. Konstanta: UPPER_SNAKE.
- Konstanta matching (bobot, ambang) hanya di `src/lib/matching/config.ts`.
- Hari dalam minggu: 0 = Senin ... 6 = Minggu. Waktu jadwal: menit sejak 00:00, kelipatan 30.
- Semua timestamp di DB: `timestamptz`. Zona waktu tampilan dari `APP_TIMEZONE`.
