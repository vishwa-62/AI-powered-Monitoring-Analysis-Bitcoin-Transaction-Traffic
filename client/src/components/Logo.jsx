import React from 'react';

export default function Logo({ collapsed = false, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Sleek Minimal Geometric Bitcoin Symbol */}
      <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-white text-[#F7931A] dark:text-[#F7931A] flex items-center justify-center shrink-0 shadow-sm border border-gray-200 dark:border-[#2D3135]">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.75 4v16M14.75 4v16M8.5 7.5h6.25a2.75 2.75 0 0 1 0 5.5H8.5V7.5Zm0 5.5h7a3 3 0 0 1 0 6H8.5v-6Z" />
        </svg>
      </div>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-bold tracking-tight text-gray-900 dark:text-white leading-tight truncate">
            Bitcoin Traffic
          </div>
          <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight truncate">
            Intelligence
          </div>
        </div>
      )}
    </div>
  );
}
