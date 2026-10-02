import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import type { Order, OrderItem } from "@prisma/client";

type OrderWithItems = Order & {
  items: OrderItem[];
};

type OrderCardProps = {
  order: OrderWithItems;
};

const paymentLabels: Record<string, string> = {
  cod: "🚚 Utánvét",
  card: "💳 Bankkártya",
  transfer: "🏢 Banki átutalás",
};

export function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Fejléc */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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
        <Badge variant="outline">{paymentLabels[order.paymentMethod]}</Badge>
      </div>

      {/* Termékek */}
      <div className="space-y-3 mb-4">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.productName}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} db × {formatPrice(item.price)}
              </p>
            </div>
            <p className="text-sm font-medium">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}

        {/* Ha több mint 3 termék */}
        {order.items.length > 3 && (
          <p className="text-sm text-muted-foreground pl-15">
            + {order.items.length - 3} további termék
          </p>
        )}
      </div>

      <Separator className="my-4" />

      {/* Összesítés + gomb */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {itemCount} termék
          </p>
          <p className="text-lg font-bold">{formatPrice(order.totalPrice)}</p>
        </div>

        <Link href={`/account/orders/${order.id}`}>
          <Button variant="outline" size="sm">
            Részletek
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}