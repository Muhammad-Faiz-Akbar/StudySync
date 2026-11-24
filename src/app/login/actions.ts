"use server";

import { redirect } from "next/navigation";

import type { LoginFormState } from "@/components/features/auth/login-state";
import { isAllowedEmailDomain } from "@/lib/auth/domain";
import { describeAuthError } from "@/lib/auth/errors";
import { recordLoginSucceeded } from "@/lib/auth/events";
import { getAllowedEmailDomains } from "@/lib/env";
import { emailSchema, otpSchema } from "@/lib/schemas/auth";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_ERROR = "Ada kendala saat memproses permintaanmu. Coba lagi sebentar ya.";

function readValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Single entry point for both login steps so the form can use one `useActionState`.
 * The `intent` field decides whether we send a code or verify it.
 */
export async function submitLogin(
  previous: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  if (readValue(formData, "intent") === "verify_otp") {
    return verifyOtp(previous, formData);
  }
  return requestOtp(formData);
}

async function requestOtp(formData: FormData): Promise<LoginFormState> {
  const parsed = emailSchema.safeParse(readValue(formData, "email"));

  if (!parsed.success) {
    return {
      step: "email",
      email: readValue(formData, "email"),
      error: parsed.error.issues[0]?.message ?? FALLBACK_ERROR,
    };
  }

  const email = parsed.data;
  const allowedDomains = readAllowedDomains();

  if (allowedDomains === null) {
    return {
      step: "email",
      email,
      error: "Domain email kampus belum dikonfigurasi. Hubungi admin StudySync dulu ya.",
    };
  }

  if (!isAllowedEmailDomain(email, allowedDomains)) {
    return {
      step: "email",
      email,
      error: `Email harus memakai domain kampus: ${allowedDomains.join(", ")}.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    return { step: "email", email, error: describeAuthError(error).message };
  }

  return {
    step: "otp",
    email,
    notice: "Kode 6 digit sudah dikirim ke email kampusmu. Cek inbox atau folder spam.",
  };
}

async function verifyOtp(
  previous: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const rawEmail = readValue(formData, "email");
  const parsedEmail = emailSchema.safeParse(rawEmail);

  if (!parsedEmail.success) {
    return {
      step: "email",
      email: "",
      error: "Masukkan email kampusmu dulu ya, lalu minta kode baru.",
    };
  }

  const email = parsedEmail.data;
  const parsedToken = otpSchema.safeParse(readValue(formData, "token"));

  if (!parsedToken.success) {
    return {
      step: "otp",
      email,
      error: parsedToken.error.issues[0]?.message ?? FALLBACK_ERROR,
      notice: previous.notice,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: parsedToken.data,
    type: "email",
  });

  if (error) {
    return { step: "otp", email, error: describeAuthError(error).message };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      step: "otp",
      email,
      error: "Sesi belum aktif. Minta kode baru lalu coba lagi ya.",
    };
  }

  await recordLoginSucceeded(supabase, userData.user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", userData.user.id)
    .maybeSingle();

  redirect(profile?.onboarding_completed_at ? "/matches" : "/onboarding");
}

function readAllowedDomains(): string[] | null {
  try {
    return getAllowedEmailDomains();
  } catch {
    return null;
  }
}
