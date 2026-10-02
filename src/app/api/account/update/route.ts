import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
  name: z
    .string()
    .min(2, "A név legalább 2 karakter legyen")
    .max(50, "A név legfeljebb 50 karakter lehet"),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Nincs bejelentkezve" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = updateSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validated.name },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Adatok sikeresen frissítve!",
    });
  } catch (error) {
    console.error("Update hiba:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message || "Érvénytelen adatok",
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