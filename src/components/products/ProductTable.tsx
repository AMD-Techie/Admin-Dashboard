import React from 'react';
import { Product } from '../../types/product';
import { Eye, Edit3, Trash2, Star, PackageX, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onClearFilters?: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onClearFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-12 text-center flex flex-col items-center justify-center my-6">
        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 mb-3">
          <PackageX className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-1">No products found</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-4">
          We couldn't find any products matching your current search query or category filters.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Clear Search & Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-slate-800/70 border border-slate-700/60 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-700/60 text-xs uppercase text-slate-400 font-semibold tracking-wider">
              <th className="py-3.5 px-4">Item</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-sm">
            {products.map((product) => {
              const isLowStock = product.stock <= 10;
              const isOutOfStock = product.stock === 0;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-700/30 transition-colors group"
                >
                  {/* Thumbnail & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-700/60 shrink-0 group-hover:scale-105 transition-transform"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/products/${product.id}`}
                          className="font-medium text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1 block"
                        >
                          {product.title}
                        </Link>
                        {product.brand && (
                          <span className="text-xs text-slate-400 block truncate">
                            {product.brand}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-slate-300">
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-900/60 border border-slate-700/60 px-2.5 py-1 rounded-md capitalize font-medium">
                      <Tag className="w-3 h-3 text-indigo-400" />
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-semibold text-slate-100">
                    ${product.price.toFixed(2)}
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <span className="ml-2 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                        -{Math.round(product.discountPercentage)}%
                      </span>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-amber-400 font-medium text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        isOutOfStock
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                          : isLowStock
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                      }`}
                    >
                      {isOutOfStock ? 'Out of stock' : `${product.stock} left`}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/products/${product.id}`}
                        title="View Details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => onEdit(product)}
                        title="Edit Product"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(product)}
                        title="Delete Product"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {products.map((product) => {
          const isLowStock = product.stock <= 10;
          const isOutOfStock = product.stock === 0;

          return (
            <div
              key={product.id}
              className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-xl space-y-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-20 h-20 rounded-lg object-cover bg-slate-900 border border-slate-700/60 shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] bg-slate-900 border border-slate-700/60 text-indigo-400 px-2 py-0.5 rounded capitalize font-medium">
                    {product.category}
                  </span>
                  <Link
                    to={`/products/${product.id}`}
                    className="font-semibold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-2 mt-1 block"
                  >
                    {product.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {product.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/40 text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-medium border ${
                    isOutOfStock
                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                      : isLowStock
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                  }`}
                >
                  {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="p-1.5 bg-slate-700/60 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1.5 bg-slate-700/60 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-1.5 bg-slate-700/60 hover:bg-slate-700 text-rose-300 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
