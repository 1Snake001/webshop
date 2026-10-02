import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type PageProps = {
  params: Promise<{ id: string }>;
};

const paymentLabels: Record<string, string> = {
  cod: "🚚 Utánvét",
  card: "💳 Bankkártya",
  transfer: "🏢 Banki átutalás",
};

export default async function MyOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  // Ha nincs ilyen rendelés VAGY nem a userhez tartozik
  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Vissza a rendeléseimhez
        </Link>

        {/* Fejléc */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Rendelés részletei</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="font-mono">
              {order.orderNumber}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bal oldal: tételek */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Rendelt termékek</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="font-medium hover:underline"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} db × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Összesen</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Jobb oldal: adatok */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Szállítási adatok</h2>
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {order.lastName} {order.firstName}
                </p>
                <p className="text-muted-foreground">{order.email}</p>
                <p className="text-muted-foreground">{order.phone}</p>
                <p className="pt-2">{order.address}</p>
                <p>
                  {order.postalCode} {order.city}
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Fizetés</h2>
              <p className="text-sm">{paymentLabels[order.paymentMethod]}</p>
            </div>

            {order.notes && (
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">Megjegyzés</h2>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}