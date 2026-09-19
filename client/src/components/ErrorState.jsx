import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ title = "Unable to load data", description = "Please check your network connection or server status and try again.", onRetry }) {
  return (
    <div className="saas-card p-10 text-center flex flex-col items-center justify-center gap-3 border-rose-200 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
