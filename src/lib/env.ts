import { z } from "zod";

/**
 * Single gateway for environment variables.
 * Exception: SUPABASE_SERVICE_ROLE_KEY is read only in `src/lib/supabase/admin.ts`.
 * This module validates it so misconfiguration fails fast, but never exports it.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAIN_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;

const httpUrl = z.string().refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}, "must be a valid http(s) URL");

const ianaTimeZone = z.string().refine((value) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}, "must be a valid IANA time zone");

const csv = z.string().transform((value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0),
);

const domainList = csv
  .transform((items) => items.map((item) => item.toLowerCase()))
  .pipe(
    z
      .array(z.string().regex(DOMAIN_PATTERN, "must look like kampus.ac.id"))
      .min(1, "must list at least one email domain"),
  );

const emailList = csv.pipe(
  z.array(z.string().regex(EMAIL_PATTERN, "must be a valid email address")),
);

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: httpUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "must not be empty"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "must not be empty"),
  APP_TIMEZONE: ianaTimeZone,
  ALLOWED_EMAIL_DOMAINS: domainList,
  ADMIN_EMAILS: emailList,
  DEMO_MODE: z
    .enum(["true", "false"], { message: 'must be "true" or "false"' })
    .default("false")
    .transform((value) => value === "true"),
});

/** Validated configuration that is safe to hand to app code (no secrets). */
export type AppEnv = Omit<z.infer<typeof envSchema>, "SUPABASE_SERVICE_ROLE_KEY">;

/**
 * Pure parser: takes a raw environment bag and returns validated config.
 * Throws a single aggregated error listing every invalid variable.
 */
export function parseEnv(source: Record<string, string | undefined>): AppEnv {
  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment variables -> ${details}`);
  }

  const {
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    APP_TIMEZONE,
    ALLOWED_EMAIL_DOMAINS,
    ADMIN_EMAILS,
    DEMO_MODE,
  } = parsed.data;

  return {
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    APP_TIMEZONE,
    ALLOWED_EMAIL_DOMAINS,
    ADMIN_EMAILS,
    DEMO_MODE,
  };
}

let cachedEnv: AppEnv | undefined;

/** Lazily validated environment for application code. */
export function getEnv(): AppEnv {
  if (!cachedEnv) {
    cachedEnv = parseEnv(process.env);
  }
  return cachedEnv;
}
