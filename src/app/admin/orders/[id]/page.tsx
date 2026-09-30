import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  const paymentLabels: Record<string, string> = {
    cod: "🚚 Utánvét",
    card: "💳 Bankkártya",
    transfer: "🏢 Banki átutalás",
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Vissza a rendelésekhez
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Rendelés részletei</h1>
        <div className="flex items-center gap-3">
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
        {/* Bal oldal: tételek + összegzés */}
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
                    <p className="font-medium">{item.productName}</p>
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

        {/* Jobb oldal: vevő + fizetés */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Vevő</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">
                {order.lastName} {order.firstName}
              </p>
              <p className="text-muted-foreground">{order.email}</p>
              <p className="text-muted-foreground">{order.phone}</p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Szállítási cím</h2>
            <div className="space-y-1 text-sm">
              <p>{order.address}</p>
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
    </main>
  );
}