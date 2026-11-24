import { describe, expect, it } from "vitest";

import { describeAuthError } from "@/lib/auth/errors";

describe("describeAuthError", () => {
  it("explains rate limiting in plain language", () => {
    const byCode = describeAuthError({ code: "over_email_send_rate_limit" });
    const byStatus = describeAuthError({ status: 429 });

    expect(byCode.kind).toBe("rate_limited");
    expect(byStatus.kind).toBe("rate_limited");
    expect(byCode.message).toMatch(/tunggu beberapa menit/i);
  });

  it("explains a wrong or expired code", () => {
    const expired = describeAuthError({ code: "otp_expired" });
    const invalidToken = describeAuthError({ message: "Token has expired or is invalid" });

    expect(expired.kind).toBe("otp_invalid");
    expect(invalidToken.kind).toBe("otp_invalid");
    expect(expired.message).toMatch(/salah atau sudah kedaluwarsa/i);
  });

  it("explains a malformed email", () => {
    const described = describeAuthError({ code: "email_address_invalid" });

    expect(described.kind).toBe("invalid_email");
    expect(described.message).toMatch(/nama@kampus\.ac\.id/);
  });

  it("explains a connection problem", () => {
    expect(describeAuthError({ message: "TypeError: fetch failed" }).kind).toBe("network");
  });

  it("falls back to a generic message that leaks no server detail", () => {
    const described = describeAuthError({
      code: "unexpected_failure",
      message: 'duplicate key value violates unique constraint "profiles_pkey"',
    });

    expect(described.kind).toBe("unknown");
    expect(described.message).not.toMatch(/duplicate key|profiles_pkey/);
  });

  it("never returns an empty message", () => {
    expect(describeAuthError({}).message.length).toBeGreaterThan(10);
  });
});
