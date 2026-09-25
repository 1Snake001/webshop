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

  export type CustomerInfo = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  
  export type PaymentMethod = "cod" | "card" | "transfer";
  
  export type Order = {
    id: string;
    items: CartItem[];
    customer: CustomerInfo;
    paymentMethod: PaymentMethod;
    totalPrice: number;
    createdAt: string;
  };