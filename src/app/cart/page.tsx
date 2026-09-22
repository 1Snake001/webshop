"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const totalPrice = useCart((state) => state.totalPrice());
  const totalItems = useCart((state) => state.totalItems());

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">A kosarad üres</h1>
          <p className="text-muted-foreground">
            Nézz körül a termékeink között!
          </p>
          <Link href="/products">
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
      <h1 className="text-3xl font-bold mb-8">
        Kosár{" "}
        <span className="text-muted-foreground">({totalItems} termék)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 p-4 border rounded-lg"
            >
              <Link
                href={`/products/${item.product.slug}`}
                className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted"
              >
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-semibold hover:underline"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.product.category}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 mt-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-sm font-medium tabular-nums">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.product.price)} / db
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive self-start"
                onClick={() => removeItem(item.product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-bold">Összesítés</h2>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Termékek</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Szállítás</span>
                <span className="text-green-600">Ingyenes</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Összesen</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Button size="lg" className="w-full">
              Tovább a fizetéshez
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Link href="/products" className="block">
              <Button variant="outline" className="w-full">
                Vásárlás folytatása
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}