import { z } from "zod";

export const checkoutSchema = z.object({
  lastName: z
    .string()
    .min(2, "A vezetéknév legalább 2 karakter legyen")
    .max(50, "A vezetéknév legfeljebb 50 karakter lehet"),

  firstName: z
    .string()
    .min(2, "A keresztnév legalább 2 karakter legyen")
    .max(50, "A keresztnév legfeljebb 50 karakter lehet"),

  email: z
    .string()
    .min(1, "Az email cím megadása kötelező")
    .email("Érvénytelen email cím formátum"),

  phone: z
    .string()
    .min(1, "A telefonszám megadása kötelező")
    .regex(
      /^(\+36|06)[\s-]?\d{1,2}[\s-]?\d{3}[\s-]?\d{4}$/,
      "Érvénytelen telefonszám (pl. +36 30 123 4567 vagy 06 30 123 4567)"
    ),

  address: z
    .string()
    .min(5, "A cím legalább 5 karakter legyen")
    .max(100, "A cím legfeljebb 100 karakter lehet"),

  city: z
    .string()
    .min(2, "A város neve legalább 2 karakter legyen")
    .max(50, "A város neve legfeljebb 50 karakter lehet"),

  postalCode: z
    .string()
    .regex(/^\d{4}$/, "A postakód 4 jegyű szám kell legyen (pl. 1052)"),

  notes: z.string().max(500, "A megjegyzés legfeljebb 500 karakter lehet").optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;