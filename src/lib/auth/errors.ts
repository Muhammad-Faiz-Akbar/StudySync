/** Friendly, specific Bahasa Indonesia messages for Supabase Auth failures. */

export type AuthErrorKind =
  | "invalid_email"
  | "otp_invalid"
  | "rate_limited"
  | "network"
  | "unknown";

export interface AuthErrorDescription {
  kind: AuthErrorKind;
  message: string;
}

export interface AuthErrorInput {
  code?: string | null;
  status?: number;
  message?: string;
}

const RATE_LIMIT_CODES = new Set([
  "over_email_send_rate_limit",
  "over_request_rate_limit",
  "too_many_requests",
]);

const OTP_CODES = new Set([
  "otp_expired",
  "invalid_token",
  "otp_disabled",
  "invalid_otp",
]);

/** Maps an auth error to a message that never echoes raw server or database text. */
export function describeAuthError(error: AuthErrorInput): AuthErrorDescription {
  const code = error.code?.toLowerCase() ?? "";
  const message = error.message?.toLowerCase() ?? "";

  if (error.status === 429 || RATE_LIMIT_CODES.has(code)) {
    return {
      kind: "rate_limited",
      message: "Kamu sudah beberapa kali meminta kode. Tunggu beberapa menit, lalu coba lagi.",
    };
  }

  if (code === "email_address_invalid" || code === "validation_failed") {
    return {
      kind: "invalid_email",
      message: "Format email belum benar. Contoh yang kami terima: nama@kampus.ac.id.",
    };
  }

  if (OTP_CODES.has(code) || message.includes("token has expired") || message.includes("invalid")) {
    return {
      kind: "otp_invalid",
      message: "Kode salah atau sudah kedaluwarsa. Periksa lagi, atau minta kode baru.",
    };
  }

  if (message.includes("fetch") || message.includes("network")) {
    return {
      kind: "network",
      message: "Koneksi ke server sedang bermasalah. Periksa internetmu lalu coba lagi.",
    };
  }

  return {
    kind: "unknown",
    message: "Ada kendala saat memproses permintaanmu. Coba lagi sebentar ya.",
  };
}
