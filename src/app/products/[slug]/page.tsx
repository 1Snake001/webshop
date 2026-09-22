import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AddToCartSection } from "./add-to-cart-section";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Vissza a termékekhez
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Kép */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.onSale && (
            <Badge
              className="absolute top-4 left-4"
              variant="destructive"
            >
              Akciós
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {product.name}
            </h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="border-t pt-4">
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
            {product.stock > 0 ? (
              <p className="text-sm text-green-600 mt-1">
                Készleten: {product.stock} db
              </p>
            ) : (
              <p className="text-sm text-red-600 mt-1">Elfogyott</p>
            )}
          </div>

          {/* Kosárba gomb + mennyiség */}
          <AddToCartSection product={product} />
        </div>
      </div>
    </main>
  );
}