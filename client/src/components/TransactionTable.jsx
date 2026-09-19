import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Hash, ArrowUpRight } from 'lucide-react';
import { RiskBadge, StatusBadge } from './RiskBadge';
import { formatBTC, formatUSD, truncateHash, formatDate } from '../utils/formatters';

export default function TransactionTable({ transactions = [], onSelectTx }) {
  const navigate = useNavigate();

  if (!transactions.length) {
    return (
      <div className="p-8 text-center text-gray-400 font-mono text-sm">
        No transactions match the selected filter criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-300 font-mono">
        <thead className="text-xs uppercase bg-white/[0.03] text-gray-400 border-b border-white/10">
          <tr>
            <th className="px-4 py-3">Tx Hash</th>
            <th className="px-4 py-3">Block</th>
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Sender</th>
            <th className="px-4 py-3">Receiver</th>
            <th className="px-4 py-3">Amount (BTC)</th>
            <th className="px-4 py-3">USD Value</th>
            <th className="px-4 py-3">Fee</th>
            <th className="px-4 py-3">Risk Score</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {transactions.map((tx) => (
            <tr
              key={tx.tx_hash}
              onClick={() => navigate(`/transactions/${tx.tx_hash}`)}
              className="hover:bg-white/[0.035] transition-colors group cursor-pointer"
            >
              <td className="px-4 py-3 font-semibold text-btc-orange flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 opacity-60" />
                <a href={`/transactions/${tx.tx_hash}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:underline">
                  {truncateHash(tx.tx_hash)}
                </a>
              </td>
              <td className="px-4 py-3 text-gray-400">#{tx.block_height}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(tx.timestamp)}</td>
              <td className="px-4 py-3 text-gray-300">
                <Link to={`/wallets/${tx.sender}`} onClick={(e) => e.stopPropagation()} className="hover:text-btc-orange hover:underline">
                  {truncateHash(tx.sender, 6, 4)}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-300">
                <Link to={`/wallets/${tx.receiver}`} onClick={(e) => e.stopPropagation()} className="hover:text-btc-orange hover:underline">
                  {truncateHash(tx.receiver, 6, 4)}
                </Link>
              </td>
              <td className="px-4 py-3 font-bold text-white">{formatBTC(tx.amount)}</td>
              <td className="px-4 py-3 text-gray-400">{formatUSD(tx.usd_value || tx.amount * 65000)}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{formatBTC(tx.fee)}</td>
              <td className="px-4 py-3">
                <RiskBadge level={tx.risk_level} score={tx.risk_score} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={tx.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <a
                  href={`/transactions/${tx.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-md transition-colors"
                >
                  <span>Inspect</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
