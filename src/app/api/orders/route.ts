import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Validációs séma
const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    address: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().regex(/^\d{4}$/),
    notes: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        productSlug: z.string(),
        productImage: z.string(),
        price: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "A kosár nem lehet üres"),
  paymentMethod: z.enum(["cod", "card", "transfer"]),
  totalPrice: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validáció
    const validated = orderSchema.parse(body);

    // Rendelésszám generálás
    const orderNumber = `ORD-${Date.now()}`;

    // Mentés az adatbázisba
    const order = await prisma.order.create({
      data: {
        orderNumber,
        firstName: validated.customer.firstName,
        lastName: validated.customer.lastName,
        email: validated.customer.email,
        phone: validated.customer.phone,
        address: validated.customer.address,
        city: validated.customer.city,
        postalCode: validated.customer.postalCode,
        notes: validated.customer.notes || null,
        paymentMethod: validated.paymentMethod,
        totalPrice: validated.totalPrice,
        items: {
          create: validated.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug,
            productImage: item.productImage,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log("📦 Rendelés mentve:", order.orderNumber);

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Hiba a rendelés mentésekor:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Érvénytelen adatok",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 }
    );
  }
}