import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "white-tshirt",
    name: "Fehér póló",
    description: "100% pamut, kényelmes szabás, mindennapi viseletre.",
    price: 5990,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    category: "Ruházat",
    stock: 25,
  },
  {
    id: "2",
    slug: "black-tshirt",
    name: "Fekete póló",
    description: "Letisztult fekete póló, prémium pamutból.",
    price: 5990,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600",
    category: "Ruházat",
    stock: 18,
  },
  {
    id: "3",
    slug: "hoodie",
    name: "Kapucnis pulóver",
    description: "Meleg, kényelmes kapucnis pulóver hűvösebb napokra.",
    price: 12990,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    category: "Ruházat",
    stock: 12,
    onSale: true,
  },
  {
    id: "4",
    slug: "sneakers",
    name: "Sportcipő",
    description: "Könnyű futócipő, kiváló csillapítással.",
    price: 24990,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    category: "Cipő",
    stock: 8,
  },
  {
    id: "5",
    slug: "backpack",
    name: "Hátizsák",
    description: "Vízálló hátizsák laptoptartóval, mindennapi használatra.",
    price: 15990,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    category: "Kiegészítők",
    stock: 15,
  },
  {
    id: "6",
    slug: "cap",
    name: "Baseball sapka",
    description: "Állítható méretű, pamut baseball sapka.",
    price: 3990,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600",
    category: "Kiegészítők",
    stock: 30,
    onSale: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}