import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { ProfileForm } from "./profile-form";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  // User adatok
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      password: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Rendelések száma + összes költés
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    select: { totalPrice: true },
  });

  const orderCount = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  // Meg van-e erősítve az email?
  const isEmailVerified = !!user.emailVerified;

  // Van-e jelszava (vagy csak Google-lel regisztrált)?
  const hasPassword = !!user.password;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Fiók adatai</h1>

        {/* Profil fejléc */}
        <div className="border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "Profil"}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
                {user.email[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-2xl font-bold">{user.name || "Névtelen"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {isEmailVerified ? (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✅ Email megerősítve
                </p>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  ⚠️ Email nincs megerősítve
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Statisztikák */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Rendelések</p>
            <p className="text-2xl font-bold">{orderCount}</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Összes költés</p>
            <p className="text-2xl font-bold">{formatPrice(totalSpent)}</p>
          </div>
        </div>

        {/* Gyorslinkek */}
        <div className="border rounded-lg mb-6">
          <Link
            href="/account/orders"
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Rendeléseim</p>
                <p className="text-xs text-muted-foreground">
                  {orderCount} rendelés
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>

        {/* Profil szerkesztés */}
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Személyes adatok</h2>
          <ProfileForm
            currentName={user.name || ""}
            email={user.email}
          />
        </div>

        {/* Fiók info */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Fiók információk</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{user.email}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Regisztráció</span>
              <span>
                {new Date(user.createdAt).toLocaleDateString("hu-HU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bejelentkezési mód</span>
              <span>{hasPassword ? "Email + jelszó" : "Google"}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}