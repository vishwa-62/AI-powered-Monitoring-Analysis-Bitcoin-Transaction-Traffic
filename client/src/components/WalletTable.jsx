import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowUpRight } from 'lucide-react';
import { RiskBadge, StatusBadge } from './RiskBadge';
import { formatBTC, truncateHash, formatDate } from '../utils/formatters';

export default function WalletTable({ wallets = [] }) {
  if (!wallets.length) {
    return (
      <div className="p-8 text-center text-gray-400 font-mono text-sm">
        No wallets found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-300 font-mono">
        <thead className="text-xs uppercase bg-white/[0.03] text-gray-400 border-b border-white/10">
          <tr>
            <th className="px-4 py-3">Wallet Address</th>
            <th className="px-4 py-3">First Seen</th>
            <th className="px-4 py-3">Last Active</th>
            <th className="px-4 py-3">Txs</th>
            <th className="px-4 py-3">Counterparties</th>
            <th className="px-4 py-3">Total Received</th>
            <th className="px-4 py-3">Total Sent</th>
            <th className="px-4 py-3">Balance</th>
            <th className="px-4 py-3">Risk Score</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {wallets.map((w) => (
            <tr key={w.address} className="hover:bg-white/[0.035] transition-colors">
              <td className="px-4 py-3 font-semibold text-soc-blue flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 opacity-60" />
                <Link to={`/wallets/${w.address}`} className="hover:underline">
                  {truncateHash(w.address, 10, 6)}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(w.first_seen)}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(w.last_seen)}</td>
              <td className="px-4 py-3 text-white font-bold">{w.transaction_count}</td>
              <td className="px-4 py-3 text-gray-300">{w.unique_counterparties || Math.floor(w.transaction_count * 0.7)}</td>
              <td className="px-4 py-3 text-emerald-400">{formatBTC(w.total_received)}</td>
              <td className="px-4 py-3 text-red-400">{formatBTC(w.total_sent)}</td>
              <td className="px-4 py-3 text-white font-bold">{formatBTC(w.balance)}</td>
              <td className="px-4 py-3">
                <RiskBadge level={w.risk_level} score={w.risk_score} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={w.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/wallets/${w.address}`}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-md transition-colors"
                >
                  <span>Investigate</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
