"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CreditCard, Truck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations";
import type { PaymentMethod } from "@/types";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const totalPrice = useCart((state) => state.totalPrice());
  const clearCart = useCart((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      notes: "",
    },
  });

  // Ha üres a kosár, irányítsuk vissza
  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">A kosarad üres</h1>
          <Link href="/products">
            <Button>Termékek megtekintése</Button>
          </Link>
        </div>
      </main>
    );
  }

 const onSubmit = async (data: CheckoutFormData) => {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: data,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productSlug: item.product.slug,
          productImage: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
        })),
        paymentMethod,
        totalPrice,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("API hiba:", result);
      alert("Hiba történt a rendelés mentésekor. Próbáld újra!");
      return;
    }

    console.log("✅ Rendelés mentve:", result);

    // Mentjük localStorage-ba is (a success oldalhoz)
    localStorage.setItem(
      "lastOrder",
      JSON.stringify({
        id: result.orderNumber,
        items,
        customer: data,
        paymentMethod,
        totalPrice,
        createdAt: new Date().toISOString(),
      })
    );

    // Kosár törlése
    clearCart();

    // Átirányítás a success oldalra
    router.push("/checkout/success");
  } catch (error) {
    console.error("Hiba:", error);
    alert("Hiba történt a rendelés mentésekor. Próbáld újra!");
  }
};

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Vissza a kosárhoz
      </Link>

      <h1 className="text-3xl font-bold mb-8">Fizetés</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bal oldal: űrlap */}
          <div className="lg:col-span-2 space-y-8">
            {/* Szállítási adatok */}
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold">Szállítási adatok</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Vezetéknév *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Keresztnév *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefonszám *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+36 30 123 4567"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Cím (utca, házszám) *</Label>
                <Input
                  id="address"
                  {...register("address")}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Város *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postakód *</Label>
                  <Input
                    id="postalCode"
                    placeholder="1052"
                    {...register("postalCode")}
                    className={errors.postalCode ? "border-red-500" : ""}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Megjegyzés (opcionális)</Label>
                <Input
                  id="notes"
                  placeholder="Pl. csengő nem működik"
                  {...register("notes")}
                  className={errors.notes ? "border-red-500" : ""}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>
            </div>

            {/* Fizetési mód */}
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold">Fizetési mód</h2>

              <div className="space-y-3">
                {/* Utánvét */}
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4"
                  />
                  <Truck className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">Utánvét</p>
                    <p className="text-sm text-muted-foreground">
                      Fizetés átvételkor
                    </p>
                  </div>
                </label>

                {/* Bankkártya */}
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-4 h-4"
                  />
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">Bankkártya</p>
                    <p className="text-sm text-muted-foreground">
                      Online fizetés (szimulált)
                    </p>
                  </div>
                </label>

                {/* Átutalás */}
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "transfer"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={() => setPaymentMethod("transfer")}
                    className="w-4 h-4"
                  />
                  <Building2 className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">Banki átutalás</p>
                    <p className="text-sm text-muted-foreground">
                      Utalás a megadott számlaszámra
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Jobb oldal: összegzés */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 space-y-4 sticky top-24">
              <h2 className="text-lg font-bold">Rendelés összegzése</h2>
              <Separator />

              {/* Termékek */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 items-center text-sm"
                  >
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} db
                      </p>
                    </div>
                    <p className="font-medium text-xs">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

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

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Feldolgozás..." : "Megrendelés"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                A megrendeléssel elfogadod az ÁSZF-et.
              </p>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}