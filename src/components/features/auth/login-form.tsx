"use client";

import { useActionState } from "react";

import { initialLoginState } from "@/components/features/auth/login-state";
import { submitLogin } from "@/app/login/actions";

const BUTTON_CLASS =
  "flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-base font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-400";
const INPUT_CLASS =
  "min-h-12 w-full rounded-xl border border-zinc-300 px-4 text-base text-zinc-900 outline-none focus-visible:border-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-700";
const LABEL_CLASS = "text-sm font-medium text-zinc-800";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(submitLogin, initialLoginState);
  const isOtpStep = state.step === "otp";

  return (
    <form action={formAction} className="flex w-full flex-col gap-5" noValidate>
      <input type="hidden" name="intent" value={isOtpStep ? "verify_otp" : "request_otp"} />

      {isOtpStep ? (
        <>
          <input type="hidden" name="email" value={state.email} />
          <p className="text-sm leading-relaxed text-zinc-600" role="status">
            {state.notice ?? "Masukkan kode 6 digit yang kami kirim ke email kampusmu."}
          </p>
          <div className="flex flex-col gap-2">
            <label className={LABEL_CLASS} htmlFor="token">
              Kode 6 digit
            </label>
            <input
              className={INPUT_CLASS}
              id="token"
              name="token"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              aria-describedby={state.error ? "login-error" : undefined}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLASS} htmlFor="email">
            Email kampus
          </label>
          <input
            className={INPUT_CLASS}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@kampus.ac.id"
            defaultValue={state.email}
            required
            aria-describedby={state.error ? "login-error" : undefined}
          />
        </div>
      )}

      {state.error ? (
        <p
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800"
          id="login-error"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <button className={BUTTON_CLASS} type="submit" disabled={isPending}>
        {isPending ? "Memproses…" : isOtpStep ? "Masuk" : "Kirim kode"}
      </button>

      {isOtpStep ? (
        <button
          className="min-h-11 text-sm font-medium text-emerald-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:text-zinc-400"
          type="submit"
          name="intent"
          value="request_otp"
          disabled={isPending}
        >
          Kirim ulang kode
        </button>
      ) : null}
    </form>
  );
}
