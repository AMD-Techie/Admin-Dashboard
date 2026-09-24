import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { productService } from '../api/productService';
import {
  Product,
  CategoryItem,
  ProductQueryParams,
  CreateProductInput,
} from '../types/product';
import { useDebounce } from '../hooks/useDebounce';
import { Navbar } from '../components/layout/Navbar';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductTable } from '../components/products/ProductTable';
import { Pagination } from '../components/products/Pagination';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/ErrorState';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';
import { PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract primitive URL parameters cleanly
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const rawPageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const pageSize: 10 | 20 | 50 = [10, 20, 50].includes(rawPageSize)
    ? (rawPageSize as 10 | 20 | 50)
    : 10;

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const rawSortBy = searchParams.get('sortBy') || 'title';
  const sortBy: 'title' | 'price' | 'rating' | 'stock' = ['title', 'price', 'rating', 'stock'].includes(rawSortBy)
    ? (rawSortBy as any)
    : 'title';

  const rawOrder = searchParams.get('order') || 'asc';
  const order: 'asc' | 'desc' = ['asc', 'desc'].includes(rawOrder) ? (rawOrder as any) : 'asc';

  // Memoized query params model
  const queryParams = useMemo<ProductQueryParams>(
    () => ({ page, pageSize, search, category, sortBy, order }),
    [page, pageSize, search, category, sortBy, order]
  );

  // Local search input state (for immediate responsive typing)
  const [searchInput, setSearchInput] = useState<string>(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Products and Categories data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Notification Toast state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Helper to update URL search parameters safely
  const updateURL = useCallback((newParams: Partial<ProductQueryParams>) => {
    const current = { page, pageSize, search, category, sortBy, order, ...newParams };
    const params: Record<string, string> = {};

    if (current.page > 1) params.page = String(current.page);
    if (current.pageSize !== 10) params.pageSize = String(current.pageSize);
    if (current.search.trim()) params.search = current.search.trim();
    if (current.category.trim()) params.category = current.category.trim();
    if (current.sortBy !== 'title') params.sortBy = current.sortBy;
    if (current.order !== 'asc') params.order = current.order;

    setSearchParams(params, { replace: true });
  }, [page, pageSize, search, category, sortBy, order, setSearchParams]);

  // Sync debounced search input with URL search param
  useEffect(() => {
    if (debouncedSearch !== search) {
      updateURL({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, search, updateURL]);

  // Sync search input if URL changes externally (e.g. Back/Forward navigation)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Fetch Categories on mount
  useEffect(() => {
    productService
      .getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Fetch Products with AbortController for race-condition protection
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      setIsSearching(true);
      setError(null);

      try {
        const response = await productService.getProducts(
          { page, pageSize, search, category, sortBy, order },
          controller.signal
        );
        if (!controller.signal.aborted) {
          setProducts(response.products);
          setTotalCount(response.total);
        }
      } catch (err: any) {
        if (!axios.isCancel(err) && err.name !== 'CanceledError' && err.message !== 'canceled') {
          setError(err.message || 'Failed to fetch products. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsSearching(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [page, pageSize, search, category, sortBy, order]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Handlers for Filters
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleCategoryChange = (cat: string) => {
    updateURL({ category: cat, page: 1 });
  };

  const handleSortChange = (newSortBy: 'title' | 'price' | 'rating' | 'stock') => {
    updateURL({ sortBy: newSortBy, page: 1 });
  };

  const handleOrderToggle = () => {
    const nextOrder = order === 'asc' ? 'desc' : 'asc';
    updateURL({ order: nextOrder, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({}, { replace: true });
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage });
  };

  const handlePageSizeChange = (newPageSize: 10 | 20 | 50) => {
    updateURL({ pageSize: newPageSize, page: 1 });
  };

  // CRUD Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (productToEdit: Product) => {
    setEditingProduct(productToEdit);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: CreateProductInput) => {
    if (editingProduct) {
      // Edit Product
      const updated = await productService.updateProduct({ id: editingProduct.id, ...formData });
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updated, ...formData } : p))
      );
      showNotification(`Product "${formData.title}" updated successfully!`);
    } else {
      // Add Product
      const created = await productService.addProduct(formData);
      // DummyJSON returns new ID, prepend to local state
      setProducts((prev) => [created, ...prev]);
      setTotalCount((prev) => prev + 1);
      showNotification(`New product "${formData.title}" created successfully!`);
    }
  };

  const handleDeleteConfirm = async (productToDelete: Product) => {
    await productService.deleteProduct(productToDelete.id);
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    setTotalCount((prev) => Math.max(0, prev - 1));
    showNotification(`Product "${productToDelete.title}" deleted.`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-bounce ${
              notification.type === 'success'
                ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
                : 'bg-rose-950 border-rose-700 text-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        {/* Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Products Catalogue
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage inventory products, perform debounced search, filter categories, and update items.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Product Filters & Search */}
        <ProductFilters
          queryParams={queryParams}
          categories={categories}
          isSearching={isSearching}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onOrderToggle={handleOrderToggle}
          onResetFilters={handleResetFilters}
          totalCount={totalCount}
        />

        {/* Loading State */}
        {isLoading && <SkeletonLoader count={queryParams.pageSize} />}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorState
            message={error}
            onRetry={() => {
              setIsLoading(true);
              setError(null);
              productService
                .getProducts({ page, pageSize, search, category, sortBy, order })
                .then((res) => {
                  setProducts(res.products);
                  setTotalCount(res.total);
                })
                .catch((err) => setError(err.message))
                .finally(() => setIsLoading(false));
            }}
          />
        )}

        {/* Product Table / Cards */}
        {!isLoading && !error && (
          <>
            <ProductTable
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={setDeletingProduct}
              onClearFilters={handleResetFilters}
            />

            {/* Pagination */}
            {products.length > 0 && (
              <Pagination
                currentPage={queryParams.page}
                pageSize={queryParams.pageSize}
                totalItems={totalCount}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </main>

      {/* Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
