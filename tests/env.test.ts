import { describe, expect, it } from "vitest";

import { parseEnv } from "@/lib/env";

const validSource = {
  NEXT_PUBLIC_SUPABASE_URL: "https://demo-project.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  APP_TIMEZONE: "Asia/Jakarta",
  ALLOWED_EMAIL_DOMAINS: "kampus.ac.id, Student.Kampus.ac.id ,",
  ADMIN_EMAILS: "",
  DEMO_MODE: "false",
};

describe("parseEnv", () => {
  it("accepts a complete environment and hides the service role key", () => {
    const env = parseEnv(validSource);

    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://demo-project.supabase.co");
    expect(env.APP_TIMEZONE).toBe("Asia/Jakarta");
    expect(env.ALLOWED_EMAIL_DOMAINS).toEqual(["kampus.ac.id", "student.kampus.ac.id"]);
    expect(env.ADMIN_EMAILS).toEqual([]);
    expect(env.DEMO_MODE).toBe(false);
    expect(env).not.toHaveProperty("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("reads DEMO_MODE as a boolean flag", () => {
    expect(parseEnv({ ...validSource, DEMO_MODE: "true" }).DEMO_MODE).toBe(true);
    expect(parseEnv({ ...validSource, DEMO_MODE: undefined }).DEMO_MODE).toBe(false);
  });

  it("throws when a required key is missing", () => {
    expect(() => parseEnv({ ...validSource, APP_TIMEZONE: undefined })).toThrow(/APP_TIMEZONE/);
  });

  it("throws when ALLOWED_EMAIL_DOMAINS is empty", () => {
    expect(() => parseEnv({ ...validSource, ALLOWED_EMAIL_DOMAINS: " , " })).toThrow(
      /ALLOWED_EMAIL_DOMAINS/,
    );
  });

  it("throws when DEMO_MODE is not a boolean flag", () => {
    expect(() => parseEnv({ ...validSource, DEMO_MODE: "yes" })).toThrow(/DEMO_MODE/);
  });
});
