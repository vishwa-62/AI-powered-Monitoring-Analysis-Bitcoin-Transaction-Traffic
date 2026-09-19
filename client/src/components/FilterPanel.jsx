import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterPanel({
  search,
  setSearch,
  riskLevel,
  setRiskLevel,
  status,
  setStatus,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  onReset
}) {
  return (
    <div className="glass-panel p-4 rounded-xl mb-6 text-xs animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 font-bold text-gray-300 uppercase tracking-wider">
          <div className="p-1.5 rounded-lg border border-btc-orange/30 bg-btc-orange/10 text-btc-orange">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <span>Transaction & Risk Filters</span>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Search */}
        <div>
          <label className="text-gray-400 mb-1 block">Hash / Wallet</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search address or hash..."
            className="field !py-1.5"
          />
        </div>

        {/* Risk Level */}
        <div>
          <label className="text-gray-400 mb-1 block">Risk Level</label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="field !py-1.5"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">CRITICAL (75-100)</option>
            <option value="HIGH">HIGH (50-74)</option>
            <option value="MEDIUM">MEDIUM (25-49)</option>
            <option value="LOW">LOW (0-24)</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-gray-400 mb-1 block">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="field !py-1.5"
          >
            <option value="">All Statuses</option>
            <option value="NORMAL">NORMAL</option>
            <option value="MONITORED">MONITORED</option>
            <option value="SUSPICIOUS">SUSPICIOUS</option>
            <option value="FLAGGED">FLAGGED</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>

        {/* Min Amount */}
        <div>
          <label className="text-gray-400 mb-1 block">Min BTC</label>
          <input
            type="number"
            step="0.1"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            placeholder="0.0"
            className="field !py-1.5"
          />
        </div>

        {/* Max Amount */}
        <div>
          <label className="text-gray-400 mb-1 block">Max BTC</label>
          <input
            type="number"
            step="0.5"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            placeholder="100.0"
            className="field !py-1.5"
          />
        </div>
      </div>
    </div>
  );
}
