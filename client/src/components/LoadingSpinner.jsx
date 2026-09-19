import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading blockchain telemetry data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl border border-btc-orange/20 bg-btc-orange/5 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-btc-orange animate-spin" />
        </div>
        <span className="absolute -inset-1 rounded-3xl border border-btc-orange/20 animate-pulse-slow pointer-events-none"></span>
      </div>
      <span className="text-xs text-gray-400 font-mono tracking-wide">{message}</span>
    </div>
  );
}

export function EmptyState({ title = 'No Data Found', message = 'There are no records matching your current request.', icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-500" />
        </div>
      )}
      <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide">{title}</h4>
      <p className="text-xs text-gray-500 max-w-sm mt-1.5">{message}</p>
    </div>
  );
}