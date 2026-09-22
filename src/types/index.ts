export type Product = {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;        // in HUF, integer
    image: string;        // URL or local path
    category: string;
    stock: number;
    onSale?: boolean;
  };
  
  export type CartItem = {
    product: Product;
    quantity: number;
  };