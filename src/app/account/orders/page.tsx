import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "./order-card";

export default async function MyOrdersPage() {
  const session = await auth();

  // Ha nincs bejelentkezve → login oldalra
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  // A user rendelései
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Ha nincs még rendelés
  if (orders.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Még nincs rendelésed</h1>
          <p className="text-muted-foreground">
            Nézz körül a termékeink között, és adj le egy rendelést!
          </p>
          <Link href="/products" className="inline-block">
            <Button className="mt-4">
              Termékek megtekintése
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Fejléc */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Rendeléseim</h1>
          <p className="text-muted-foreground">
            {orders.length} rendelés
          </p>
        </div>

        {/* Rendelések listája */}
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </main>
  );
}