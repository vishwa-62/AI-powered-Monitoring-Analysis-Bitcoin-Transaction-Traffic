import React from 'react';
import { SearchX, FilterX } from 'lucide-react';

export default function EmptyState({ title = "No data found", description = "Everything looks normal for the selected filters.", onClearFilters }) {
  return (
    <div className="saas-card p-10 text-center flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#202428] text-gray-400 dark:text-gray-500 flex items-center justify-center">
        <SearchX className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl hover:bg-gray-200 dark:hover:bg-[#262A2E] transition-colors"
        >
          <FilterX className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}
