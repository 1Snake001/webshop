"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/store/cart";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCart((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Főoldal" },
    { href: "/products", label: "Termékek" },
    { href: "/products?category=Ruházat", label: "Ruházat" },
    { href: "/products?category=Cipő", label: "Cipő" },
    { href: "/products?category=Kiegészítők", label: "Kiegészítők" },
    { href: "/about", label: "Rólunk" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Bal oldal: mobil hamburger + logo */}
        <div className="flex items-center gap-2">
          {/* Mobil hamburger menü */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü</span>
                </Button>
              }
            />
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Webshop
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Store className="h-6 w-6" />
            <span>Webshop</span>
          </Link>
        </div>

        {/* Desktop navigáció */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Kosár */}
        <Link href="/cart">
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Kosár</span>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1.5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}