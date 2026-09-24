import { axiosInstance } from './axiosInstance';
import {
  Product,
  ProductListResponse,
  CategoryItem,
  ProductQueryParams,
  CreateProductInput,
  UpdateProductInput,
} from '../types/product';

export const productService = {
  /**
   * Main method to retrieve products supporting search, category filter, sorting, pagination,
   * and AbortSignal for race-condition prevention.
   */
  async getProducts(
    params: ProductQueryParams,
    signal?: AbortSignal
  ): Promise<ProductListResponse> {
    const { page, pageSize, search, category, sortBy, order } = params;
    const limit = pageSize;
    const skip = (page - 1) * pageSize;

    // Strategy 1: Search + Category combined
    if (search.trim() && category.trim()) {
      // DummyJSON does not natively support search + category in one query.
      // We query search results (limit=0 for all matches), filter by category, apply sort, then paginate.
      const response = await axiosInstance.get<ProductListResponse>('/products/search', {
        params: { q: search.trim(), limit: 0 },
        signal,
      });

      let filtered = response.data.products.filter(
        (p) => p.category.toLowerCase() === category.trim().toLowerCase()
      );

      // Client-side Sort
      filtered = sortProducts(filtered, sortBy, order);

      // Client-side Paginate
      const paginated = filtered.slice(skip, skip + limit);

      return {
        products: paginated,
        total: filtered.length,
        skip,
        limit,
      };
    }

    // Strategy 2: Search only
    if (search.trim()) {
      const response = await axiosInstance.get<ProductListResponse>('/products/search', {
        params: {
          q: search.trim(),
          limit,
          skip,
          sortBy,
          order,
        },
        signal,
      });
      return response.data;
    }

    // Strategy 3: Category only
    if (category.trim()) {
      const response = await axiosInstance.get<ProductListResponse>(
        `/products/category/${encodeURIComponent(category.trim())}`,
        {
          params: {
            limit,
            skip,
            sortBy,
            order,
          },
          signal,
        }
      );
      return response.data;
    }

    // Strategy 4: Standard Listing (no search, no category filter)
    const response = await axiosInstance.get<ProductListResponse>('/products', {
      params: {
        limit,
        skip,
        sortBy,
        order,
      },
      signal,
    });
    return response.data;
  },

  /**
   * Fetch categories list
   */
  async getCategories(): Promise<CategoryItem[]> {
    const response = await axiosInstance.get<CategoryItem[] | string[]>('/products/categories');
    // Normalize string vs object array format from DummyJSON
    return response.data.map((cat) => {
      if (typeof cat === 'string') {
        return {
          slug: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' '),
          url: `https://dummyjson.com/products/category/${cat}`,
        };
      }
      return cat;
    });
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id: number, signal?: AbortSignal): Promise<Product> {
    const response = await axiosInstance.get<Product>(`/products/${id}`, { signal });
    return response.data;
  },

  /**
   * Add new product (Mock POST)
   */
  async addProduct(input: CreateProductInput): Promise<Product> {
    const response = await axiosInstance.post<Product>('/products/add', input);
    return response.data;
  },

  /**
   * Update product (Mock PUT)
   */
  async updateProduct(input: UpdateProductInput): Promise<Product> {
    const { id, ...data } = input;
    const response = await axiosInstance.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete product (Mock DELETE)
   */
  async deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean }> {
    const response = await axiosInstance.delete<{ id: number; isDeleted: boolean }>(
      `/products/${id}`
    );
    return response.data;
  },
};

/**
 * Helper to perform client-side sorting when necessary
 */
function sortProducts(
  products: Product[],
  sortBy: 'title' | 'price' | 'rating' | 'stock',
  order: 'asc' | 'desc'
): Product[] {
  return [...products].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return order === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    if (typeof valA === 'number' && typeof valB === 'number') {
      return order === 'asc' ? valA - valB : valB - valA;
    }

    return 0;
  });
}
