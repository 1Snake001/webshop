import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { CategoryFilter } from "@/components/category-filter";

type ProductsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;

  // Szűrés
  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  // Kategóriánkénti darabszám
  const categoriesMap = new Map<string, number>();
  products.forEach((p) => {
    categoriesMap.set(p.category, (categoriesMap.get(p.category) || 0) + 1);
  });
  const categories = Array.from(categoriesMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {category ? category : "Minden termék"}
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} termék
          {category && " ebben a kategóriában"}
        </p>
      </div>

      <CategoryFilter categories={categories} totalCount={products.length} />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Nincs termék ebben a kategóriában.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}