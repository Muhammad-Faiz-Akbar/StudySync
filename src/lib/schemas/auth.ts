import { z } from "zod";

/** Shared by the login form and the server action so both agree on the rules. */

export const emailSchema = z
  .string({ message: "Email wajib diisi." })
  .trim()
  .toLowerCase()
  .max(254, "Email terlalu panjang.")
  .pipe(z.email("Format email belum benar. Contoh: nama@kampus.ac.id."));

export const otpSchema = z
  .string({ message: "Kode wajib diisi." })
  .trim()
  .regex(/^\d{6}$/, "Kode terdiri dari 6 angka, tanpa spasi atau tanda lain.");

export type EmailInput = z.infer<typeof emailSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
