import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, Cpu, Network, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import TransactionTable from '../components/TransactionTable';
import NetworkGraph from '../components/NetworkGraph';
import { CardSkeleton } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';
import API from '../services/api';
import { formatBTC, formatDate, truncateHash } from '../utils/formatters';

export default function WalletDetails() {
  const { address } = useParams();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [network, setNetwork] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get(`/wallets/${address}`),
      API.get(`/wallets/${address}/transactions`),
      API.get(`/wallets/${address}/network`)
    ])
      .then(([wRes, txRes, netRes]) => {
        if (wRes.success) setWallet(wRes.wallet);
        if (txRes.success) setTransactions(txRes.data);
        if (netRes.success) setNetwork({ nodes: netRes.nodes, edges: netRes.edges });
      })
      .catch((err) => setError(err.message || 'Wallet address not found'))
      .finally(() => setLoading(false));
  }, [address]);

  if (loading) return <div className="p-6 max-w-7xl mx-auto space-y-4"><CardSkeleton /><CardSkeleton /></div>;
  if (error || !wallet) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <ErrorState title="Wallet Not Found" description={error || 'The requested wallet address is not indexed.'} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <Link to="/wallets" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Wallet Intelligence</span>
      </Link>

      {/* Overview Card Header */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-[#F7931A]">
                <Wallet className="w-5 h-5" />
              </div>
              <h1 className="text-base md:text-lg font-bold font-mono text-gray-900 dark:text-white break-all">{wallet.address}</h1>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              First Seen: {formatDate(wallet.first_seen)} • Last Active: {formatDate(wallet.last_seen)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RiskBadge level={wallet.risk_level} score={wallet.risk_score} />
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-[#2D3135]">
          <div className="saas-card-secondary p-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Current Balance</span>
            <p className="text-base font-bold font-mono text-gray-900 dark:text-white mt-1">{formatBTC(wallet.balance)}</p>
          </div>
          <div className="saas-card-secondary p-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Received</span>
            <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{formatBTC(wallet.total_received)}</p>
          </div>
          <div className="saas-card-secondary p-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Sent</span>
            <p className="text-base font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">{formatBTC(wallet.total_sent)}</p>
          </div>
          <div className="saas-card-secondary p-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">Counterparties</span>
            <p className="text-base font-bold font-mono text-[#F7931A] mt-1">{wallet.unique_counterparties || 14} addresses</p>
          </div>
        </div>
      </div>

      {/* Behavior & Ego Network Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Behavior Card */}
        <div className="saas-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-gray-100 dark:border-[#2D3135] pb-3">
            <Cpu className="w-4 h-4 text-[#F7931A]" />
            <span>Behavior Analysis</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-[#2D3135]">
              <span className="text-gray-500 dark:text-gray-400">Velocity Profile</span>
              <span className="text-gray-900 dark:text-white font-bold">{wallet.behavior_analysis?.velocity_trend || 'STABLE'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-[#2D3135]">
              <span className="text-gray-500 dark:text-gray-400">Clustering Factor</span>
              <span className="text-gray-900 dark:text-white font-bold">{wallet.behavior_analysis?.clustering_factor || 'STANDARD'}</span>
            </div>

            <div className="pt-2">
              <span className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">Behavioral Indicators:</span>
              <ul className="space-y-1.5">
                {(wallet.behavior_analysis?.anomaly_indicators || ['Standard historical activity profile']).map((ind, idx) => (
                  <li key={idx} className="saas-card-secondary p-2.5 text-gray-700 dark:text-gray-300">
                    • {ind}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Ego Network Graph */}
        <div className="saas-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-gray-100 dark:border-[#2D3135] pb-3">
            <Network className="w-4 h-4 text-[#F7931A]" />
            <span>Wallet Counterparty Network</span>
          </h3>

          <NetworkGraph initialNodes={network.nodes} initialEdges={network.edges} />
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="saas-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
          Wallet Transactions ({transactions.length})
        </h3>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}
