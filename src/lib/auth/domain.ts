/**
 * Campus email domain policy. Pure functions only: no I/O, no clock, no randomness.
 * This is a UX-level guard. The authoritative checks are the server action and,
 * before the pilot, the `enforce_email_domain` trigger on `auth.users`.
 */

/**
 * Local parts ending in one of these suffixes are treated as a spoofing attempt,
 * e.g. `evil.com@kampus.ac.id`, which reads like a `evil.com` address but is not.
 * Kept narrow on purpose so ordinary dotted names (`rani.putri@kampus.ac.id`) pass.
 */
const SPOOFED_DOMAIN_SUFFIXES = [
  "com",
  "net",
  "org",
  "edu",
  "gov",
  "id",
  "io",
  "co",
  "ac",
  "dev",
  "app",
  "xyz",
];

function looksLikeSpoofedDomain(localPart: string): boolean {
  const lastDot = localPart.lastIndexOf(".");
  if (lastDot <= 0) {
    return false;
  }
  return SPOOFED_DOMAIN_SUFFIXES.includes(localPart.slice(lastDot + 1));
}

/**
 * Returns true when the email belongs to one of the allowed campus domains.
 * Comparison is case-insensitive and ignores surrounding whitespace, but any
 * whitespace inside the address is rejected instead of being silently repaired.
 */
export function isAllowedEmailDomain(email: string, allowedDomains: readonly string[]): boolean {
  const normalized = email.trim().toLowerCase();

  if (normalized.length === 0 || /\s/.test(normalized)) {
    return false;
  }

  const atIndex = normalized.indexOf("@");
  if (atIndex <= 0 || atIndex !== normalized.lastIndexOf("@")) {
    return false;
  }

  const localPart = normalized.slice(0, atIndex);
  const domain = normalized.slice(atIndex + 1);

  if (domain.length === 0 || looksLikeSpoofedDomain(localPart)) {
    return false;
  }

  return allowedDomains.some((allowed) => allowed.trim().toLowerCase() === domain);
}
