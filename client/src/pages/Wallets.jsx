import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Search, RefreshCw, ArrowUpRight } from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { TableSkeleton, CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import API from '../services/api';
import { formatBTC, truncateHash } from '../utils/formatters';

export default function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const navigate = useNavigate();

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        search,
        risk_level: riskLevel
      });

      const res = await API.get(`/wallets?${params.toString()}`);
      if (res.success) {
        setWallets(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching wallets:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, riskLevel]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-[#F7931A]">
              <Wallet className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Wallet Intelligence</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Search and analyze Bitcoin wallet addresses, balances, transaction counts, and risk profiles.
          </p>
        </div>

        <button
          onClick={fetchWallets}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#191C1F] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2D3135] shadow-sm hover:bg-gray-50 dark:hover:bg-[#202428] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="saas-card p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wallet address (e.g., bc1q...72k)"
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
          className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
        >
          <option value="">All Risk Levels</option>
          <option value="CRITICAL">Critical Risk</option>
          <option value="HIGH">High Risk</option>
          <option value="MEDIUM">Medium Risk</option>
          <option value="LOW">Low Risk</option>
        </select>
      </div>

      {/* Wallet Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : wallets.length === 0 ? (
        <EmptyState title="No wallets found" onClearFilters={() => { setSearch(''); setRiskLevel(''); }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((w) => (
            <div
              key={w.id || w.address}
              onClick={() => navigate(`/wallets/${w.address}`)}
              className="saas-card saas-card-hover p-5 space-y-3 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#2D3135] pb-2 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Wallet Address</span>
                  <RiskBadge level={w.risk_level} score={w.risk_score} />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-sm text-[#F7931A] group-hover:underline">
                    {truncateHash(w.address, 8, 6)}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#F7931A] transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-[#2D3135] text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Balance</span>
                  <p className="font-mono font-bold text-gray-900 dark:text-white mt-0.5">{formatBTC(w.balance)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Transactions</span>
                  <p className="font-mono font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{w.transaction_count || 2482}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Risk Score</span>
                  <p className="font-mono font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{w.risk_score} / 100</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
          <div>Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} wallets)</div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 bg-white dark:bg-[#191C1F] border border-gray-200 dark:border-[#2D3135] rounded-xl disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-[#202428]"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 bg-white dark:bg-[#191C1F] border border-gray-200 dark:border-[#2D3135] rounded-xl disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-[#202428]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
