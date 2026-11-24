export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-5 py-10">
      <p className="text-sm font-semibold tracking-wide text-emerald-700">StudySync</p>
      <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900">
        Temukan teman belajar yang jadwalnya cocok denganmu
      </h1>
      <p className="text-base leading-relaxed text-zinc-600">
        Isi mata kuliah dan waktu kosongmu, lalu lihat rekomendasi teman belajar lengkap dengan alasan
        kenapa kalian cocok. Kamu yang menentukan seberapa detail jadwalmu terlihat.
      </p>
      <a
        href="/login"
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-base font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        Masuk dengan email kampus
      </a>
      <p className="text-sm leading-relaxed text-zinc-500">
        Mengisi profil pertama biasanya selesai dalam dua menit.
      </p>
    </main>
  );
}
