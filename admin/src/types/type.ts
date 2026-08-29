// admin/src/types/product.ts

export type Product = {
  _id: string;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock: number;
  image?: string;
  images?: string[];
  brand?: {
    _id: string;
    name: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type SellerOrderItem = {
  _id?: string;
  id?: string;

  product?: Product | string;

  name?: string;
  sku?: string;
  image?: string;

  quantity: number;

  price?: number;
  unitPrice?: number;
  salePrice?: number;

  total?: number;
};

export type SellerOrder = {
  _id: string;
  id?: string;

  orderNumber?: string;

  createdAt?: string;
  date?: string;

  customer?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };

  shippingAddress?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  items: SellerOrderItem[];

  subtotal?: number;
  shipping?: number;
  discount?: number;
  total?: number;

  paymentStatus?: string;
  paymentMethod?: string;

  status: OrderStatus;
};
