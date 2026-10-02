"use client";
/* eslint-disable @next/next/no-img-element */

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function UserMenu() {
  const { data: session, status } = useSession();

  // Amíg tölt, ne mutassunk semmit
  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    );
  }

  // Ha nincs bejelentkezve → "Bejelentkezés" link
  if (!session) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Bejelentkezés</span>
        </Button>
      </Link>
    );
  }

  // Ha be van jelentkezve → user menü
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Profil"}
                className="h-7 w-7 rounded-full"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {session.user?.email?.[0].toUpperCase() || "?"}
              </div>
            )}
          </Button>
        }
      />
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Fiókom</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* User info */}
          <div className="flex items-center gap-3">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Profil"}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                {session.user?.email?.[0].toUpperCase() || "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {session.user?.name || "Névtelen"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user?.email}
              </p>
            </div>
          </div>

          {/* Menü */}
          <nav className="flex flex-col gap-1">
            <Link
              href="/account/orders"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
            >
              <Package className="h-4 w-4" />
              Rendeléseim
            </Link>
            <Link
              href="/account"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
            >
              <User className="h-4 w-4" />
              Fiók adatai
            </Link>
          </nav>

          {/* Kijelentkezés */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Kijelentkezés
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
