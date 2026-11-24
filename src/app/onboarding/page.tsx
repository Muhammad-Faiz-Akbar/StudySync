import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding · StudySync",
  description: "Lengkapi profil, mata kuliah, dan jadwal kosongmu.",
};

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-5 py-10">
      <p className="text-sm font-semibold tracking-wide text-emerald-700">StudySync</p>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900">
        Segera hadir
      </h1>
      <p className="text-sm leading-relaxed text-zinc-600">
        Di sini kamu akan mengisi profil, mata kuliah, dan jadwal kosong. Halaman ini sedang
        disiapkan.
      </p>
    </main>
  );
}
