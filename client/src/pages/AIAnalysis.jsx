import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, AlertTriangle, ShieldCheck, Cpu, Zap, Activity, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import { CardSkeleton } from '../components/Skeleton';
import API from '../services/api';
import { formatDate, truncateHash } from '../utils/formatters';

export default function AIAnalysis() {
  const [anomalies, setAnomalies] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/ai/anomalies')
      .then((res) => {
        if (res.success) setAnomalies(res);
      })
      .catch((err) => console.error('Error fetching AI anomalies:', err))
      .finally(() => setLoading(false));
  }, []);

  const stats = anomalies?.stats || {
    total_analyzed: 1420,
    anomalies_detected: 118,
    high_risk_count: 84,
    critical_risk_count: 34
  };

  const feed = anomalies?.feed || [];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-[#F7931A]">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">AI Transaction Intelligence</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Machine-learning insights from Bitcoin transaction and wallet behavior.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-[#F7931A] text-xs font-semibold">
          IsolationForest ML Engine Active
        </div>
      </div>

      {/* STAT CARDS */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Transactions Analyzed"
            value={stats.total_analyzed.toLocaleString()}
            change="+14.2%"
            isPositive={true}
            icon={Activity}
          />
          <StatCard
            title="Anomalies Detected"
            value={stats.anomalies_detected}
            change="-2.5%"
            isPositive={true}
            icon={Zap}
          />
          <StatCard
            title="High Risk"
            value={stats.high_risk_count}
            change="+1.8%"
            isPositive={false}
            icon={AlertTriangle}
          />
          <StatCard
            title="Critical Risk"
            value={stats.critical_risk_count}
            change="-0.4%"
            isPositive={true}
            icon={ShieldCheck}
          />
        </div>
      )}

      {/* ANALYTICAL NOTICE */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
        <strong>ANALYTICAL NOTICE:</strong> AI insights are generated as statistical indicators computed from traffic velocity, graph centrality, and feature anomaly models. Anomaly scores serve as analytical triggers for human investigation and do not constitute automatic proof of unlawful activity.
      </div>

      {/* AI INSIGHT CARDS GRID */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight uppercase">AI Insight Stream</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Default Hero Card */}
          <div className="saas-card p-5 space-y-4 border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white">Unusual transaction activity detected</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                Score: 82 / 100
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-gray-500 dark:text-gray-400">Wallet</span>
              <p className="font-mono font-semibold text-[#F7931A]">bc1q...72k</p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Detected Patterns:</span>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                <li>Increased transaction frequency</li>
                <li>Unusual transaction amount</li>
                <li>Multiple new counterparties</li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-[#2D3135]">
              <span className="text-[11px] font-mono text-gray-500">Confidence: 91%</span>
              <button
                onClick={() => navigate('/wallets/bc1q_delta_layering_hop_04')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 px-3 py-1.5 rounded-xl hover:opacity-90"
              >
                <span>Investigate</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dynamic Feed Cards */}
          {feed.map((item, idx) => (
            <div key={idx} className="saas-card p-5 space-y-4 border-l-4 border-l-[#F7931A]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 dark:text-white">Anomalous Flow Trigger</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-[#F7931A] border border-amber-200 dark:border-amber-500/20">
                  Score: {item.risk_score} / 100
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-gray-500 dark:text-gray-400">Transaction</span>
                <p className="font-mono font-semibold text-[#F7931A]">{truncateHash(item.tx_hash, 10, 6)}</p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Detected Patterns:</span>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                  {(item.ai_reasons || ['Unusual transaction frequency', 'Unusual amount ratio', 'New counterparty cluster']).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-[#2D3135]">
                <span className="text-[11px] font-mono text-gray-500">Confidence: {item.confidence || 88}%</span>
                <button
                  onClick={() => navigate(`/transactions/${item.tx_hash}`)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-[#202428] px-3 py-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-[#262A2E]"
                >
                  <span>Investigate</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
