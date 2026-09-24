export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  thumbnail: string;
  images: string[];
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ProductQueryParams {
  page: number;
  pageSize: 10 | 20 | 50;
  search: string;
  category: string;
  sortBy: 'title' | 'price' | 'rating' | 'stock';
  order: 'asc' | 'desc';
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  thumbnail?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: number;
}
