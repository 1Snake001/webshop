import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Hiányzó token" },
        { status: 400 }
      );
    }

    // Token keresése
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: "Érvénytelen vagy már felhasznált token" },
        { status: 400 }
      );
    }

    // Lejárat ellenőrzése
    if (verificationToken.expires < new Date()) {
      // Töröljük a lejárt tokent
      await prisma.verificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { success: false, error: "A link lejárt. Kérj újat!" },
        { status: 400 }
      );
    }

    // User keresése és megerősítése
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "A felhasználó nem található" },
        { status: 404 }
      );
    }

    // Ha már meg van erősítve
    if (user.emailVerified) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({
        success: true,
        message: "Az email cím már meg volt erősítve.",
      });
    }

    // Megerősítés + token törlése
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    // Üdvözlő email (nem kritikus, ha nem sikerül)
    try {
      await sendWelcomeEmail(user.email, user.name || "Vásárló");
    } catch (emailError) {
      console.error("Welcome email hiba:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Email cím sikeresen megerősítve!",
    });
  } catch (error) {
    console.error("Verify email hiba:", error);
    return NextResponse.json(
      { success: false, error: "Szerver hiba történt." },
      { status: 500 }
    );
  }
}