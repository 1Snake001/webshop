import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "A név legalább 2 karakter legyen"),
  email: z.string().email("Érvénytelen email cím"),
  password: z
    .string()
    .min(8, "A jelszó legalább 8 karakter legyen")
    .regex(/[A-Z]/, "A jelszó tartalmazzon legalább 1 nagybetűt")
    .regex(/[0-9]/, "A jelszó tartalmazzon legalább 1 számot"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validáció
    const validated = registerSchema.parse(body);

    // Ellenőrizzük, létezik-e már a user
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Ez az email cím már regisztrálva van." },
        { status: 400 }
      );
    }

    // Jelszó hash
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Új user létrehozása (emailVerified: null → még nem erősítette meg)
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        emailVerified: null,
      },
    });

    // Verifikációs token generálás
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 óra

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    // Email küldés
    try {
      await sendVerificationEmail(user.email, user.name || "Vásárló", token);
    } catch (emailError) {
      console.error("Email küldési hiba:", emailError);
      // A user létrejött, de az email nem ment el
      // Visszaküldjük a user-t, de jelezzük a problémát
      return NextResponse.json(
        {
          success: true,
          message:
            "Fiók létrehozva, de az email küldése nem sikerült. Próbáld újra kérni a megerősítést.",
          warning: "email_failed",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Sikeres regisztráció! Ellenőrizd az emailed.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Regisztrációs hiba:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message || "Érvénytelen adatok",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Szerver hiba történt." },
      { status: 500 }
    );
  }
}