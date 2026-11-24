import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekomendasi · StudySync",
  description: "Teman belajar yang cocok dengan mata kuliah dan jadwalmu.",
};

export default function MatchesPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-5 py-10">
      <p className="text-sm font-semibold tracking-wide text-emerald-700">StudySync</p>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900">
        Segera hadir
      </h1>
      <p className="text-sm leading-relaxed text-zinc-600">
        Rekomendasi teman belajar beserta alasan &quot;kenapa cocok&quot; akan muncul di halaman ini.
      </p>
    </main>
  );
}
