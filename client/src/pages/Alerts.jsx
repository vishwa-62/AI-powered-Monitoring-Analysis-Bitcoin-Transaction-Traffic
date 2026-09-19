import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, RefreshCw, Search, ArrowUpRight } from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import API from '../services/api';
import { formatDate, truncateHash } from '../utils/formatters';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/alerts?limit=30');
      if (res.success) setAlerts(res.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Tab Filtering
  const filteredAlerts = alerts.filter((al) => {
    const matchesSearch =
      al.alert_type.toLowerCase().includes(search.toLowerCase()) ||
      al.description.toLowerCase().includes(search.toLowerCase()) ||
      (al.tx_hash && al.tx_hash.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'ALL') return true;
    if (activeTab === 'NEW') return al.status === 'NEW';
    if (activeTab === 'HIGH') return al.severity === 'HIGH';
    if (activeTab === 'CRITICAL') return al.severity === 'CRITICAL';
    if (activeTab === 'INVESTIGATING') return al.status === 'INVESTIGATING';
    if (activeTab === 'RESOLVED') return al.status === 'RESOLVED';

    return true;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-[#F7931A]">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Alert Center</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time Bitcoin transaction risk detection, anomaly queue, and alert review.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#191C1F] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2D3135] shadow-sm hover:bg-gray-50 dark:hover:bg-[#202428] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="saas-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center p-1 bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-xs">
            {['ALL', 'NEW', 'HIGH', 'CRITICAL', 'INVESTIGATING', 'RESOLVED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-[#191C1F] text-gray-900 dark:text-white font-semibold shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alert triggers..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Alert Cards List */}
      {loading ? (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredAlerts.length === 0 ? (
        <EmptyState title="No alerts match the criteria" onClearFilters={() => { setActiveTab('ALL'); setSearch(''); }} />
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((al) => (
            <div
              key={al.id}
              className="saas-card p-5 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-[#F7931A]"
            >
              <div className="space-y-1.5 flex-1 min-w-[240px]">
                <div className="flex items-center gap-3">
                  <RiskBadge level={al.severity} score={al.risk_score} />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{al.alert_type}</h3>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{al.description}</p>

                <div className="flex items-center gap-4 text-[11px] text-gray-500 font-mono pt-1">
                  {al.tx_hash && (
                    <span>Tx: <strong className="text-[#F7931A]">{truncateHash(al.tx_hash)}</strong></span>
                  )}
                  <span>Detected: {formatDate(al.created_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (al.tx_hash) navigate(`/transactions/${al.tx_hash}`);
                    else navigate(`/wallets`);
                  }}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:opacity-90"
                >
                  <span>Investigate</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
