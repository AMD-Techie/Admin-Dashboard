import React, { useState } from 'react';
import { Product } from '../../types/product';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (product: Product) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm(product);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-950/80 border border-rose-800/60 rounded-xl flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Delete Product</h3>
            <p className="text-xs text-slate-400">This action requires explicit confirmation.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        <p className="text-sm text-slate-300">
          Are you sure you want to delete <strong className="text-white">"{product.title}"</strong> (ID: #{product.id})?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Confirm Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
