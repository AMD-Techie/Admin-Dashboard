import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { productService } from '../api/productService';
import { Product, CategoryItem, CreateProductInput } from '../types/product';
import { Navbar } from '../components/layout/Navbar';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';
import {
  ArrowLeft,
  Star,
  Package,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Edit3,
  Trash2,
  PackageX,
  User,
  Calendar,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const numericId = Number(id);

  useEffect(() => {
    // Validate ID
    if (isNaN(numericId) || numericId <= 0) {
      setIsLoading(false);
      setError('Invalid Product ID format');
      return;
    }

    const controller = new AbortController();

    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [prodData, catsData] = await Promise.all([
          productService.getProductById(numericId, controller.signal),
          productService.getCategories(),
        ]);
        if (!controller.signal.aborted) {
          setProduct(prodData);
          setCategories(catsData);
          setActiveImage(prodData.thumbnail || prodData.images?.[0] || '');
        }
      } catch (err: any) {
        if (!axios.isCancel(err) && err.name !== 'CanceledError' && err.message !== 'canceled') {
          setError(err.message || 'Failed to fetch product details.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProductDetails();

    return () => {
      controller.abort();
    };
  }, [numericId]);

  const handleEditSubmit = async (formData: CreateProductInput) => {
    if (!product) return;
    const updated = await productService.updateProduct({ id: product.id, ...formData });
    setProduct((prev) => (prev ? { ...prev, ...updated, ...formData } : prev));
  };

  const handleDeleteConfirm = async (prodToDelete: Product) => {
    await productService.deleteProduct(prodToDelete.id);
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product Dashboard
        </Link>

        {/* Loading State */}
        {isLoading && <SkeletonLoader count={3} />}

        {/* Error / Not Found State (Only show if NOT loading AND an actual error occurred or product really doesn't exist) */}
        {!isLoading && (error || !product) && (
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 mx-auto">
              <PackageX className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Product Not Found</h2>
            <p className="text-sm text-slate-400">
              {error || `We couldn't find any product matching ID #${id}. It may have been removed or never existed.`}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-indigo-600/30"
            >
              Return to Product List
            </Link>
          </div>
        )}

        {/* Product Details Content */}
        {!isLoading && product && (
          <div className="space-y-8">
            {/* Top Bar Actions & Badges */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Images Section */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="aspect-square bg-slate-950 border border-slate-700/60 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={activeImage}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain transition-all duration-300"
                    />
                  </div>

                  {/* Image Thumbnails Carousel/Grid */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {product.images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(imgUrl)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-slate-950 shrink-0 transition-all cursor-pointer ${
                            activeImage === imgUrl
                              ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/20'
                              : 'border-slate-700/60 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 px-3 py-1 rounded-full">
                        <Tag className="w-3.5 h-3.5" />
                        {product.category}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsEditOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-amber-300 border border-slate-600/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Product
                        </button>
                        <button
                          onClick={() => setIsDeleteOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-rose-300 border border-slate-600/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {product.title}
                    </h1>

                    {product.brand && (
                      <p className="text-sm text-slate-400 mt-1 font-medium">
                        Brand: <span className="text-slate-200">{product.brand}</span>
                      </p>
                    )}
                  </div>

                  {/* Rating & Stock Badges */}
                  <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-700/60 text-sm">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(1)} / 5.0</span>
                    </div>

                    <span className="border-l border-slate-700 h-4"></span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        product.stock === 0
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                          : product.stock <= 10
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} Units Available`}
                    </span>

                    {product.sku && (
                      <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-xs px-2.5 py-1 rounded-md font-semibold">
                        Save {Math.round(product.discountPercentage)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Description
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {product.warrantyInformation && (
                      <div className="bg-slate-900/80 border border-slate-700/60 p-3 rounded-xl">
                        <ShieldCheck className="w-4 h-4 text-indigo-400 mb-1" />
                        <span className="text-[11px] text-slate-400 block">Warranty</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {product.warrantyInformation}
                        </span>
                      </div>
                    )}

                    {product.shippingInformation && (
                      <div className="bg-slate-900/80 border border-slate-700/60 p-3 rounded-xl">
                        <Truck className="w-4 h-4 text-emerald-400 mb-1" />
                        <span className="text-[11px] text-slate-400 block">Shipping</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {product.shippingInformation}
                        </span>
                      </div>
                    )}

                    {product.returnPolicy && (
                      <div className="bg-slate-900/80 border border-slate-700/60 p-3 rounded-xl">
                        <RotateCcw className="w-4 h-4 text-violet-400 mb-1" />
                        <span className="text-[11px] text-slate-400 block">Return Policy</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {product.returnPolicy}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  Customer Reviews ({product.reviews.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/80 border border-slate-700/60 p-4 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-300 text-xs font-semibold">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">
                              {rev.reviewerName}
                            </span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(rev.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {rev.rating}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Form Modal */}
      <ProductFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={product}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        product={product}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
