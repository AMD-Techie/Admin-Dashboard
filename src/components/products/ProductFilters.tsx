import React from 'react';
import { CategoryItem, ProductQueryParams } from '../../types/product';
import { Search, Filter, ArrowUpDown, X, Loader2 } from 'lucide-react';

interface ProductFiltersProps {
  queryParams: ProductQueryParams;
  categories: CategoryItem[];
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (sortBy: 'title' | 'price' | 'rating' | 'stock') => void;
  onOrderToggle: () => void;
  onResetFilters: () => void;
  totalCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  queryParams,
  categories,
  isSearching,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onOrderToggle,
  onResetFilters,
  totalCount,
}) => {
  const hasActiveFilters =
    !!queryParams.search ||
    !!queryParams.category ||
    queryParams.sortBy !== 'title' ||
    queryParams.order !== 'asc';

  return (
    <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4 sm:p-5 shadow-sm mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search input with debounce spinner */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <input
            type="text"
            value={queryParams.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by title or description..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {queryParams.search && (
            <button
              onClick={() => onSearchChange('')}
              title="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={queryParams.category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer border-none p-0 pr-2 font-medium"
            >
              <option value="" className="bg-slate-900 text-slate-200">
                All Categories
              </option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug} className="bg-slate-900 text-slate-200">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-2">
            <span className="text-xs text-slate-400 font-medium shrink-0">Sort:</span>
            <select
              value={queryParams.sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as 'title' | 'price' | 'rating' | 'stock')
              }
              className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer border-none p-0 pr-2 font-medium"
            >
              <option value="title" className="bg-slate-900 text-slate-200">Title</option>
              <option value="price" className="bg-slate-900 text-slate-200">Price</option>
              <option value="rating" className="bg-slate-900 text-slate-200">Rating</option>
              <option value="stock" className="bg-slate-900 text-slate-200">Stock</option>
            </select>
          </div>

          {/* Asc / Desc Toggle Button */}
          <button
            onClick={onOrderToggle}
            title={`Toggle order (${queryParams.order.toUpperCase()})`}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-slate-300 font-medium transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-4 h-4 text-indigo-400" />
            <span className="uppercase text-xs font-semibold tracking-wider text-slate-300">
              {queryParams.order}
            </span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline px-2 py-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count Badge */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-700/40">
        <span>
          Showing <strong className="text-slate-200">{totalCount}</strong> matching products
        </span>
        {queryParams.category && (
          <span className="bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded text-[11px]">
            Filtered by category: <strong>{queryParams.category}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
