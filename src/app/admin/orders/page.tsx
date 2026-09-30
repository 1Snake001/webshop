import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Fejléc */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Rendelések</h1>
          <p className="text-muted-foreground">
            {orders.length} rendelés · Összes bevétel: {formatPrice(totalRevenue)}
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* Táblázat */}
      {orders.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-muted-foreground">Még nincs egyetlen rendelés sem.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left text-sm">
                <th className="p-4 font-medium">Rendelésszám</th>
                <th className="p-4 font-medium">Vevő</th>
                <th className="p-4 font-medium">Dátum</th>
                <th className="p-4 font-medium">Tételek</th>
                <th className="p-4 font-medium text-right">Összeg</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-mono text-sm">
                    {order.orderNumber}
                  </td>
                  <td className="p-4">
                    <p className="font-medium">
                      {order.lastName} {order.firstName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.email}
                    </p>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("hu-HU", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">
                      {order.items.length} tétel
                    </Badge>
                  </td>
                  <td className="p-4 text-right font-bold">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        Részletek
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}