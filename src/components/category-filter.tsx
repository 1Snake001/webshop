"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CategoryFilterProps = {
  categories: { name: string; count: number }[];
  totalCount: number;
};

export function CategoryFilter({ categories, totalCount }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleSelect = (category: string | null) => {
    if (category) {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {/* Összes */}
      <Button
        variant={activeCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => handleSelect(null)}
        className={cn(
          "rounded-full transition-all",
          activeCategory === null && "shadow-md"
        )}
      >
        Összes
        <span className="ml-1.5 text-xs opacity-70">({totalCount})</span>
      </Button>

      {/* Kategóriák */}
      {categories.map((cat) => {
        const isActive = activeCategory === cat.name;
        return (
          <Button
            key={cat.name}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelect(cat.name)}
            className={cn(
              "rounded-full transition-all",
              isActive && "shadow-md"
            )}
          >
            {cat.name}
            <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
          </Button>
        );
      })}
    </div>
  );
}