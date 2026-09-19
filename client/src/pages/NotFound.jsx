import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-[#F7931A] border border-amber-200 dark:border-amber-500/20 flex items-center justify-center shadow-sm">
        <FileQuestion className="w-8 h-8" />
      </div>

      <div className="space-y-1 max-w-md">
        <span className="text-xs font-mono font-bold text-[#F7931A] uppercase tracking-wider">404 Error</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Page Not Found</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          The requested page, transaction hash, or wallet profile does not exist or has been moved.
        </p>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-opacity"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
