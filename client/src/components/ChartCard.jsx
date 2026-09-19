import React, { useState } from 'react';
import { Download } from 'lucide-react';

export default function ChartCard({
  title,
  subtitle,
  children,
  action,
  delay = 0,
  ranges = ['24H', '7D', '30D', '90D', '1Y'],
  onRangeChange,
  onExport
}) {
  const [activeRange, setActiveRange] = useState('24H');

  const handleRange = (range) => {
    setActiveRange(range);
    if (onRangeChange) onRangeChange(range);
  };

  return (
    <div
      className="saas-card p-5 flex flex-col justify-between transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {ranges && ranges.length > 0 && (
            <div className="flex items-center p-1 bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-xs">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRange(r)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeRange === r
                      ? 'bg-white dark:bg-[#191C1F] text-gray-900 dark:text-white font-semibold shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {onExport && (
            <button
              onClick={onExport}
              title="Export Chart Data"
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {action}
        </div>
      </div>

      <div className="w-full h-64 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}