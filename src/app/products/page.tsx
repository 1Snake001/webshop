import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Minden termék</h1>
        <p className="text-muted-foreground">
          {products.length} termék érhető el
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}