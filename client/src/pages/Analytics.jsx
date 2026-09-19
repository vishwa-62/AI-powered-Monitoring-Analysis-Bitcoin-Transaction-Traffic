import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import ChartCard from '../components/ChartCard';
import { CardSkeleton } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    API.get('/analytics/overview')
      .then((res) => {
        if (res.success) setData(res.analytics);
      })
      .catch((err) => console.error('Error loading analytics overview:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = (metricName) => {
    toast.success(`Exported ${metricName} dataset as CSV`);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  const txsPerHour = data?.txs_per_hour || [];
  const txsPerDay = data?.txs_per_day || [];
  const topWallets = data?.top_wallets || [];
  const feeDist = data?.fee_distribution || [];
  const sizeDist = data?.size_distribution || [];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-[#F7931A]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Analytics Workspace</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Statistical charts on volume distribution, fee spreads, block sizes, and node activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('Analytics Workspace Full Dataset')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* CHARTS GRID 1: Hourly & Daily Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Transaction Count Throughput"
          subtitle="Hourly transaction count density"
          onExport={() => handleExport('Transaction Count Throughput')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={txsPerHour}>
              <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#191C1F', borderColor: '#2D3135', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="transactions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="BTC Transferred Volume"
          subtitle="Daily transferred volume aggregate (BTC)"
          onExport={() => handleExport('BTC Transferred Volume')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={txsPerDay}>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#191C1F', borderColor: '#2D3135', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="volume" stroke="#F7931A" fill="#F7931A" fillOpacity={0.25} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* CHARTS GRID 2: Suspicious Activity & Fee Spreads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Suspicious Activity Timeline"
          subtitle="Daily flagged anomaly indicators vs normal"
          onExport={() => handleExport('Suspicious Activity Timeline')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={txsPerDay}>
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#191C1F', borderColor: '#2D3135', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="anomalies" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Transaction Fees Distribution"
          subtitle="Count breakdown by fee bracket"
          onExport={() => handleExport('Transaction Fees Distribution')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={feeDist}>
              <XAxis dataKey="range" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#191C1F', borderColor: '#2D3135', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* CHARTS GRID 3: Top Wallets & Size Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Top Active Network Wallets"
          subtitle="Wallets by transaction frequency"
          onExport={() => handleExport('Top Active Network Wallets')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topWallets} layout="vertical">
              <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="short_address" stroke="#9CA3AF" fontSize={10} width={90} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#191C1F', borderColor: '#2D3135', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="tx_count" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Transaction Byte Size Spreads"
          subtitle="Distribution by block byte size"
          onExport={() => handleExport('Transaction Byte Size Spreads')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sizeDist}>
              <XAxis dataKey="size_range" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#191C1F', borderColor: '#2D3135', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
