"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/types";

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("lastOrder");
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch (e) {
        console.error("Hiba a rendelés betöltésekor:", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-16">
        <p className="text-center text-muted-foreground">Betöltés...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Nincs megjeleníthető rendelés</h1>
          <p className="text-muted-foreground">
            Úgy tűnik, még nem adtál le rendelést.
          </p>
          <Link href="/products">
            <Button>Termékek megtekintése</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Fejléc */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Köszönjük a rendelést! 🎉</h1>
          <p className="text-muted-foreground">
            A rendelésedet sikeresen fogadtuk. Hamarosan emailben értesítünk a
            részletekről.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">Rendelésszám: {order.id}</span>
          </div>
        </div>

        {/* Rendelés részletei */}
        <div className="border rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4">Rendelt termékek</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} db × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Termékek</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Szállítás</span>
              <span className="text-green-600">Ingyenes</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Összesen</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>

          <Separator />

          {/* Szállítási adatok */}
          <div>
            <h2 className="text-lg font-bold mb-3">Szállítási adatok</h2>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p className="text-foreground font-medium">
                {order.customer.lastName} {order.customer.firstName}
              </p>
              <p>{order.customer.address}</p>
              <p>
                {order.customer.postalCode} {order.customer.city}
              </p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
            </div>
          </div>

          <Separator />

          {/* Fizetési mód */}
          <div>
            <h2 className="text-lg font-bold mb-2">Fizetési mód</h2>
            <p className="text-sm text-muted-foreground">
              {order.paymentMethod === "cod" && "🚚 Utánvét"}
              {order.paymentMethod === "card" && "💳 Bankkártya"}
              {order.paymentMethod === "transfer" && "🏢 Banki átutalás"}
            </p>
          </div>
        </div>

        {/* Gombok */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Vissza a főoldalra
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button className="w-full">További vásárlás</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}