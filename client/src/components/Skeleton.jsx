import React from 'react';

export function CardSkeleton() {
  return (
    <div className="saas-card p-5 animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 dark:bg-[#202428] rounded w-24"></div>
        <div className="w-8 h-8 bg-gray-200 dark:bg-[#202428] rounded-xl"></div>
      </div>
      <div className="h-7 bg-gray-200 dark:bg-[#202428] rounded w-36"></div>
      <div className="h-3 bg-gray-200 dark:bg-[#202428] rounded w-16"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="saas-card p-4 space-y-3 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-[#202428] rounded-xl w-full"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 dark:bg-[#202428]/50 rounded-xl w-full"></div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="saas-card p-5 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 dark:bg-[#202428] rounded w-40"></div>
        <div className="h-6 bg-gray-200 dark:bg-[#202428] rounded w-28"></div>
      </div>
      <div className="h-56 bg-gray-100 dark:bg-[#202428]/40 rounded-xl w-full flex items-end justify-between p-4 gap-2">
        <div className="w-full h-1/3 bg-gray-200 dark:bg-[#202428] rounded"></div>
        <div className="w-full h-2/3 bg-gray-200 dark:bg-[#202428] rounded"></div>
        <div className="w-full h-1/2 bg-gray-200 dark:bg-[#202428] rounded"></div>
        <div className="w-full h-3/4 bg-gray-200 dark:bg-[#202428] rounded"></div>
        <div className="w-full h-2/5 bg-gray-200 dark:bg-[#202428] rounded"></div>
      </div>
    </div>
  );
}
