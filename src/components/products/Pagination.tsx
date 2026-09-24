import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  pageSize: 10 | 20 | 50;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: 10 | 20 | 50) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Items per page selector & status */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value) as 10 | 20 | 50)}
            className="bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>per page</span>
        </div>

        <span className="hidden sm:inline border-l border-slate-700 h-4 mx-1"></span>

        <span>
          Showing <strong className="text-slate-200">{startItem}</strong> to{' '}
          <strong className="text-slate-200">{endItem}</strong> of{' '}
          <strong className="text-slate-200">{totalItems}</strong> items
        </span>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-700/80 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((num, idx) => {
            if (typeof num === 'string') {
              return (
                <span key={idx} className="px-2 py-1 text-xs text-slate-500">
                  ...
                </span>
              );
            }

            const isActive = num === currentPage;

            return (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'bg-slate-900 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-700/80 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
