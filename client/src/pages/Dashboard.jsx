import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRightLeft,
  Wallet,
  AlertTriangle,
  Activity,
  ShieldCheck,
  BrainCircuit,
  Zap,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { RiskBadge } from '../components/RiskBadge';
import { CardSkeleton, TableSkeleton } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';
import { useWebSocket } from '../hooks/useWebSocket';
import API from '../services/api';
import { formatBTC, formatDate, truncateHash } from '../utils/formatters';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');

  const navigate = useNavigate();

  // WebSocket Live Updates
  const handleNewTx = useCallback((newTx) => {
    setTransactions((prev) => [newTx, ...prev.slice(0, 14)]);
    setStats((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        total_transactions: prev.total_transactions + 1,
        transactions_today: prev.transactions_today + 1,
        transaction_volume: parseFloat((prev.transaction_volume + newTx.amount).toFixed(2))
      };
    });
    setLastUpdated('Just now');
  }, []);

  const handleNewAlert = useCallback((newAlert) => {
    setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
    setStats((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        active_alerts: prev.active_alerts + 1,
        suspicious_transactions: prev.suspicious_transactions + 1
      };
    });
  }, []);

  const { isConnected } = useWebSocket(handleNewTx, handleNewAlert);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [statsRes, txRes, alertRes, analyticsRes] = await Promise.all([
        API.get('/transactions/stats'),
        API.get('/transactions?limit=15'),
        API.get('/alerts?limit=10'),
        API.get('/analytics/overview')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (txRes.success) setTransactions(txRes.data);
      if (alertRes.success) setAlerts(alertRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      setLastUpdated('2 min ago');
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Donut chart risk distribution data
  const donutData = analytics ? analytics.risk_distribution : [
    { name: 'Low', value: 68, color: '#10B981' },
    { name: 'Medium', value: 20, color: '#F59E0B' },
    { name: 'High', value: 9, color: '#F97316' },
    { name: 'Critical', value: 3, color: '#EF4444' }
  ];

  // Filtered transactions for data table
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.tx_hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.sender_address && tx.sender_address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRisk = selectedRiskFilter === 'ALL' || tx.risk_level === selectedRiskFilter;

    return matchesSearch && matchesRisk;
  });

  if (error) {
    return (
      <div className="p-6">
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Bitcoin Traffic Intelligence
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time blockchain transaction monitoring and AI-powered risk analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            Last updated: <span className="font-semibold text-gray-700 dark:text-gray-200">{lastUpdated}</span>
          </span>
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#191C1F] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2D3135] shadow-sm hover:bg-gray-50 dark:hover:bg-[#202428] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. SIX METRICS CARDS */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Transactions"
            value={stats ? stats.total_transactions.toLocaleString() : '1,284,562'}
            change="+12.4%"
            isPositive={true}
            icon={ArrowRightLeft}
            delay={0}
          />
          <StatCard
            title="Transaction Volume"
            value={stats ? `${stats.transaction_volume.toLocaleString()} BTC` : '48,293 BTC'}
            change="+8.7%"
            isPositive={true}
            icon={TrendingUp}
            delay={50}
          />
          <StatCard
            title="Active Wallets"
            value={stats ? stats.active_wallets.toLocaleString() : '284,392'}
            change="+5.2%"
            isPositive={true}
            icon={Wallet}
            delay={100}
          />
          <StatCard
            title="Detected Anomalies"
            value={stats ? stats.suspicious_transactions : '2,481'}
            change="-4.1%"
            isPositive={true}
            icon={BrainCircuit}
            delay={150}
          />
          <StatCard
            title="High-Risk Wallets"
            value={stats ? stats.high_risk_wallets : '384'}
            change="+3.8%"
            isPositive={false}
            icon={ShieldCheck}
            delay={200}
          />
          <StatCard
            title="Active Alerts"
            value={stats ? stats.active_alerts : '27'}
            change="+2.1%"
            isPositive={false}
            icon={AlertTriangle}
            delay={250}
          />
        </div>
      )}

      {/* 3. MAIN ANALYTICS SECTION + RISK OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Activity Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="TRANSACTION ACTIVITY"
            subtitle="Bitcoin transaction activity over time."
            ranges={['24H', '7D', '30D', '90D', '1Y']}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics ? analytics.txs_per_hour : []}>
                <defs>
                  <linearGradient id="saasBtcColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7931A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F7931A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#191C1F',
                    borderColor: '#2D3135',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#F7931A', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#F7931A" strokeWidth={2} fillOpacity={1} fill="url(#saasBtcColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Risk Overview Donut Chart */}
        <div className="saas-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">Risk Overview</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Proportional risk classification breakdown</p>
          </div>

          <div className="relative h-48 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#191C1F',
                    borderColor: '#2D3135',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Percentage Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100 dark:border-[#2D3135]">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <span className="font-medium">Low</span>
              <span className="font-bold font-mono">68%</span>
            </div>
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <span className="font-medium">Medium</span>
              <span className="font-bold font-mono">20%</span>
            </div>
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400">
              <span className="font-medium">High</span>
              <span className="font-bold font-mono">9%</span>
            </div>
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400">
              <span className="font-medium">Critical</span>
              <span className="font-bold font-mono">3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS DATA TABLE */}
      <div className="saas-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">Recent Transactions</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time ledger entries evaluated by IsolationForest ML engine</p>
          </div>

          {/* Table Filters & Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hash or wallet..."
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical Risk</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#2D3135] text-gray-500 dark:text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Transaction</th>
                <th className="py-3 px-3">Wallet</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Risk</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#26292D]">
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id || tx.tx_hash}
                  onClick={() => navigate(`/transactions/${tx.tx_hash}`)}
                  className="hover:bg-gray-50/80 dark:hover:bg-[#202428]/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-medium text-[#F7931A]">
                    {truncateHash(tx.tx_hash)}
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-600 dark:text-gray-300">
                    {tx.sender_address ? truncateHash(tx.sender_address) : 'bc1q...72k'}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-gray-900 dark:text-white">
                    {formatBTC(tx.amount || tx.total_input)}
                  </td>
                  <td className="py-3 px-3 text-gray-500 dark:text-gray-400">
                    {formatDate(tx.timestamp || tx.created_at)}
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge level={tx.risk_level || 'LOW'} score={tx.risk_score} />
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. AI INSIGHTS + RECENT ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insight Card */}
        <div className="saas-card p-5 space-y-3 border-l-4 border-l-[#F7931A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F7931A]" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Transaction Intelligence</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-[#F7931A] border border-amber-500/20">
              Score: 82 / 100
            </span>
          </div>

          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            Unusual transaction activity detected on wallet <span className="font-mono text-[#F7931A]">bc1q...72k</span>
          </p>

          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside">
            <li>Increased transaction frequency within tight 5 min window</li>
            <li>Unusual transaction amount ratio relative to historical balance</li>
            <li>Multiple new counterparty address interactions</li>
          </ul>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-mono">Confidence: 91%</span>
            <Link
              to="/ai-analysis"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#F7931A] hover:underline"
            >
              <span>Investigate Anomaly</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="saas-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#2D3135]">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Active Alerts Feed</h3>
            <Link to="/alerts" className="text-xs font-semibold text-[#F7931A] hover:underline">
              View All Queue →
            </Link>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((al) => (
              <div
                key={al.id}
                className="p-3 rounded-xl bg-gray-50/70 dark:bg-[#202428] border border-gray-200/60 dark:border-[#2D3135] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>{al.alert_type}</span>
                    <RiskBadge level={al.severity} score={al.risk_score} />
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{al.description}</p>
                </div>
                <button
                  onClick={() => navigate(`/alerts`)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-[#191C1F] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2D3135] rounded-lg hover:bg-gray-100 dark:hover:bg-[#262A2E]"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
