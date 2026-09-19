import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, isPositive, icon: Icon, color = 'btc', delay = 0 }) {
  const getTrendBadgeStyle = () => {
    if (isPositive) {
      return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    }
    return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
  };

  // Minimal SVG sparkline path
  const sparklinePath = isPositive
    ? "M0,22 Q20,18 40,15 T80,10 T120,4"
    : "M0,4 Q20,10 40,14 T80,18 T120,22";

  return (
    <div
      className="saas-card saas-card-hover p-5 flex flex-col justify-between relative overflow-hidden group animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-3 relative z-10">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-gray-600 dark:text-gray-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2 relative z-10">
        <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${getTrendBadgeStyle()}`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Micro sparkline subtle backdrop */}
      <div className="absolute right-0 bottom-0 left-0 h-8 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
        <svg viewBox="0 0 120 25" className="w-full h-full">
          <path
            d={sparklinePath}
            fill="none"
            stroke={isPositive ? '#10B981' : '#EF4444'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}