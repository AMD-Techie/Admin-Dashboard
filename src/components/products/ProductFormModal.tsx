import React, { useState, useEffect } from 'react';
import { Product, CategoryItem, CreateProductInput } from '../../types/product';
import { X, Loader2, PlusCircle, Save } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateProductInput) => Promise<void>;
  initialData?: Product | null;
  categories: CategoryItem[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<CreateProductInput>({
    title: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    brand: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        category: initialData.category || '',
        brand: initialData.brand || '',
        thumbnail: initialData.thumbnail || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        stock: 0,
        category: categories[0]?.slug || 'beauty',
        brand: '',
        thumbnail: '',
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category selection is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            {isEditing ? (
              <>
                <Save className="w-5 h-5 text-amber-400" />
                Edit Product #{initialData.id}
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                Add New Product
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {submitError && (
            <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-lg text-xs text-rose-300">
              {submitError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Premium Wireless Headphones"
              className={`w-full px-3 py-2 bg-slate-950 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug} className="bg-slate-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Sony"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3 py-2 bg-slate-950 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                  errors.price
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:ring-indigo-500'
                }`}
              />
              {errors.price && <p className="text-xs text-rose-400 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className={`w-full px-3 py-2 bg-slate-950 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                  errors.stock
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:ring-indigo-500'
                }`}
              />
              {errors.stock && <p className="text-xs text-rose-400 mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://cdn.dummyjson.com/products/images/..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product specifications and details..."
              className={`w-full px-3 py-2 bg-slate-950 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
