export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku: string;
  availabilityStatus: string;
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  thumbnail: string;
  images: string[];
  reviews: { rating: number; comment: string; date: string; reviewerName: string }[];
};

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountedTotal: number;
  thumbnail: string;
};

export type Cart = {
  id: number;
  userId: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  image: string;
  address: { city: string; state: string; country: string };
};

export type Paged<K extends string, T> = { [key in K]: T[] } & {
  total: number;
  skip: number;
  limit: number;
};
