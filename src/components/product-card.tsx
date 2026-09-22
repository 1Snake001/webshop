"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="group overflow-hidden flex flex-col gap-0 p-0 border-2 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Kép */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Akciós badge */}
        {product.onSale && (
          <Badge
            className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-lg"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Akciós
          </Badge>
        )}

        {/* Készlet jelző */}
        {isLowStock && !product.onSale && (
          <Badge
            className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-500 text-white border-0 shadow-lg"
          >
            Utolsó {product.stock} db
          </Badge>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="destructive" className="text-base px-4 py-1">
              Elfogyott
            </Badge>
          </div>
        )}
      </Link>

      {/* Tartalom */}
      <CardContent className="flex-1 p-4 space-y-2">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider">
          {product.category}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-base leading-tight hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>

      {/* Ár + gomb */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2 border-t mt-2">
        <span className="text-xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {formatPrice(product.price)}
        </span>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
          onClick={() => addItem(product)}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-4 w-4 mr-1.5" />
          Kosárba
        </Button>
      </CardFooter>
    </Card>
  );
}