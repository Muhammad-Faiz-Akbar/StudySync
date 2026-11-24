import { describe, expect, it } from "vitest";

import { isAllowedEmailDomain } from "@/lib/auth/domain";

const CAMPUS = ["kampus.ac.id"];

describe("isAllowedEmailDomain", () => {
  it("accepts a plain campus address", () => {
    expect(isAllowedEmailDomain("rani@kampus.ac.id", CAMPUS)).toBe(true);
  });

  it("is case-insensitive for both the email and the allowlist", () => {
    expect(isAllowedEmailDomain("Rani.Putri@KAMPUS.AC.ID", CAMPUS)).toBe(true);
    expect(isAllowedEmailDomain("rani@kampus.ac.id", ["  Kampus.AC.id  "])).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    expect(isAllowedEmailDomain("  rani@kampus.ac.id  ", CAMPUS)).toBe(true);
    expect(isAllowedEmailDomain("rani@kampus.ac.id\n", CAMPUS)).toBe(true);
    expect(isAllowedEmailDomain("\trani@kampus.ac.id", CAMPUS)).toBe(true);
  });

  it("rejects whitespace inside the address", () => {
    expect(isAllowedEmailDomain("ra ni@kampus.ac.id", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("rani@kampus ac.id", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("rani@kam\npus.ac.id", CAMPUS)).toBe(false);
  });

  it("rejects addresses without a single @", () => {
    expect(isAllowedEmailDomain("rani.kampus.ac.id", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("rani@@kampus.ac.id", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("rani@kampus@ac.id", CAMPUS)).toBe(false);
  });

  it("rejects an empty local part or an empty domain", () => {
    expect(isAllowedEmailDomain("@kampus.ac.id", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("rani@", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("   ", CAMPUS)).toBe(false);
  });

  it("does not let subdomains through automatically", () => {
    expect(isAllowedEmailDomain("rani@mail.kampus.ac.id", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("rani@student.kampus.ac.id", ["kampus.ac.id"])).toBe(false);
  });

  it("accepts a subdomain only when it is listed explicitly", () => {
    expect(isAllowedEmailDomain("rani@student.kampus.ac.id", ["kampus.ac.id", "student.kampus.ac.id"])).toBe(
      true,
    );
  });

  it("rejects suffix attacks that only end with the campus domain", () => {
    expect(isAllowedEmailDomain("rani@kampus.ac.id.evil.com", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("rani@notkampus.ac.id", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("rani@kampus.co", CAMPUS)).toBe(false);
  });

  it("rejects a spoofed address whose local part looks like a domain", () => {
    expect(isAllowedEmailDomain("evil.com@kampus.ac.id", CAMPUS)).toBe(false);
    expect(isAllowedEmailDomain("phishing.net@kampus.ac.id", CAMPUS)).toBe(false);
  });

  it("still accepts ordinary dotted names", () => {
    expect(isAllowedEmailDomain("rani.putri@kampus.ac.id", CAMPUS)).toBe(true);
  });

  it("rejects everything when the allowlist is empty", () => {
    expect(isAllowedEmailDomain("rani@kampus.ac.id", [])).toBe(false);
    expect(isAllowedEmailDomain("rani@kampus.ac.id", ["  ", ""])).toBe(false);
  });

  it("rejects when the allowlist holds a different campus", () => {
    expect(isAllowedEmailDomain("rani@kampus.ac.id", ["lain.ac.id"])).toBe(false);
  });
});
