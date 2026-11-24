import type { Metadata } from "next";

import { LoginForm } from "@/components/features/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk · StudySync",
  description: "Masuk dengan email kampus untuk mulai mencari teman belajar.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-5 py-10">
      <p className="text-sm font-semibold tracking-wide text-emerald-700">StudySync</p>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900">
        Masuk dengan email kampus
      </h1>
      <p className="text-sm leading-relaxed text-zinc-600">
        Kami kirim kode 6 digit ke emailmu. Tidak perlu membuat atau mengingat password.
      </p>
      <LoginForm />
    </main>
  );
}
