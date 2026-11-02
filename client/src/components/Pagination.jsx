import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-[#422d1f] text-stone-300 hover:bg-[#2d1f15] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
            currentPage === page
              ? 'bg-[#9c5221] text-white shadow-md shadow-[#9c5221]/30'
              : 'border border-[#422d1f] text-stone-300 hover:bg-[#2d1f15]'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-[#422d1f] text-stone-300 hover:bg-[#2d1f15] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
