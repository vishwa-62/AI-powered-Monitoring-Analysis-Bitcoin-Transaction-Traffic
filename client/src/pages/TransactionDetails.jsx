import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Hash, Cpu, ArrowRight, Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { RiskBadge, StatusBadge } from '../components/RiskBadge';
import { CardSkeleton } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';
import API from '../services/api';
import { formatBTC, formatUSD, formatDate, truncateHash } from '../utils/formatters';

export default function TransactionDetails() {
  const { hash } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    API.get(`/transactions/${hash}`)
      .then((res) => {
        if (res.success) setTransaction(res.transaction);
      })
      .catch((err) => setError(err.message || 'Transaction hash not found'))
      .finally(() => setLoading(false));
  }, [hash]);

  if (loading) return <div className="p-6 max-w-7xl mx-auto space-y-4"><CardSkeleton /><CardSkeleton /></div>;
  if (error || !transaction) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <ErrorState title="Transaction Not Found" description={error || 'The requested transaction hash could not be located.'} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link to="/transactions" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Transactions</span>
      </Link>

      {/* Header Info */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-[#F7931A]">
                <Hash className="w-5 h-5" />
              </div>
              <h1 className="text-base md:text-lg font-bold font-mono text-gray-900 dark:text-white break-all">{transaction.tx_hash}</h1>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Block #{transaction.block_height} • Confirmed {transaction.confirmations || 18} times • {formatDate(transaction.timestamp)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RiskBadge level={transaction.risk_level} score={transaction.risk_score} />
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* TRANSACTION FLOW GRAPH (Sender -> Transaction -> Receiver) */}
      <div className="saas-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#F7931A]" />
          <span>TRANSACTION FLOW MAP</span>
        </h2>

        <div className="saas-card-secondary p-6 flex flex-wrap items-center justify-between gap-6 text-center">
          {/* Sender Box */}
          <div className="flex-1 min-w-[200px] p-4 bg-white dark:bg-[#191C1F] rounded-xl border border-gray-200 dark:border-[#2D3135]">
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">INPUT / SENDER</div>
            <Link to={`/wallets/${transaction.sender}`} className="text-xs font-semibold font-mono text-[#F7931A] hover:underline break-all">
              {transaction.sender}
            </Link>
            <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">{formatBTC(transaction.total_input)}</div>
          </div>

          <div className="flex flex-col items-center justify-center text-[#F7931A]">
            <ArrowRight className="w-6 h-6" />
            <span className="text-[10px] font-mono text-gray-400 mt-1">Fee: {formatBTC(transaction.fee)}</span>
          </div>

          {/* Transaction Node */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl min-w-[180px]">
            <div className="text-xs font-bold text-[#F7931A]">TRANSACTION</div>
            <div className="text-sm font-bold font-mono text-gray-900 dark:text-white my-1">{formatBTC(transaction.amount)}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400">{formatUSD(transaction.usd_value)}</div>
          </div>

          <div className="flex flex-col items-center justify-center text-[#F7931A]">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* Receiver Box */}
          <div className="flex-1 min-w-[200px] p-4 bg-white dark:bg-[#191C1F] rounded-xl border border-gray-200 dark:border-[#2D3135]">
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">OUTPUT / RECEIVER</div>
            <Link to={`/wallets/${transaction.receiver}`} className="text-xs font-semibold font-mono text-[#F7931A] hover:underline break-all">
              {transaction.receiver}
            </Link>
            <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">{formatBTC(transaction.total_output)}</div>
          </div>
        </div>
      </div>

      {/* METADATA & AI ANALYSIS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Summary Metrics */}
        <div className="saas-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight border-b border-gray-100 dark:border-[#2D3135] pb-3">
            Transaction Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-[#2D3135]">
              <span className="text-gray-500 dark:text-gray-400">Total Transferred Volume</span>
              <span className="text-gray-900 dark:text-white font-bold font-mono">{formatBTC(transaction.amount)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-[#2D3135]">
              <span className="text-gray-500 dark:text-gray-400">USD Value Equivalent</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{formatUSD(transaction.usd_value)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-[#2D3135]">
              <span className="text-gray-500 dark:text-gray-400">Network Fee</span>
              <span className="text-gray-700 dark:text-gray-300 font-bold font-mono">{formatBTC(transaction.fee)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-[#2D3135]">
              <span className="text-gray-500 dark:text-gray-400">Transaction Size</span>
              <span className="text-gray-700 dark:text-gray-300 font-bold font-mono">{transaction.size} bytes</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-[#2D3135]">
              <span className="text-gray-500 dark:text-gray-400">Input / Output Structure</span>
              <span className="text-gray-700 dark:text-gray-300 font-bold font-mono">{transaction.input_count} In / {transaction.output_count} Out</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500 dark:text-gray-400">Block Hash</span>
              <span className="text-gray-600 dark:text-gray-400 font-mono text-[11px] truncate max-w-[240px]">{transaction.block_hash}</span>
            </div>
          </div>
        </div>

        {/* AI Analysis & Anomaly Indicators */}
        <div className="saas-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#2D3135] pb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#F7931A]" />
              <span>AI Analytical Indicators</span>
            </h3>
            <RiskBadge level={transaction.risk_level} score={transaction.risk_score} />
          </div>

          <div className="space-y-3 text-xs">
            <div className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Detected Risk Indicators:</div>
            {transaction.ai_reasons && transaction.ai_reasons.length > 0 ? (
              <ul className="space-y-2">
                {transaction.ai_reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 saas-card-secondary p-2.5 text-gray-700 dark:text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 italic">No anomalous indicators detected for this transaction.</div>
            )}

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>ANALYTICAL NOTICE:</strong> AI risk scores represent statistical behavioral indicators computed by IsolationForest and graph algorithms. They serve as investigative indicators rather than proof of unlawful activity.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

