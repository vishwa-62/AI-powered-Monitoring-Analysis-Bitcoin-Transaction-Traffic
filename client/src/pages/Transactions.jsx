import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRightLeft, Download, RefreshCw, FileText } from 'lucide-react';
import TransactionTable from '../components/TransactionTable';
import FilterPanel from '../components/FilterPanel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useWebSocket } from '../hooks/useWebSocket';
import API from '../services/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [status, setStatus] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        search,
        risk_level: riskLevel,
        status,
        min_amount: minAmount,
        max_amount: maxAmount
      });

      const res = await API.get(`/transactions?${params.toString()}`);
      if (res.success) {
        setTransactions(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, riskLevel, status, minAmount, maxAmount]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // WebSocket Live Stream Listener
  const handleNewTx = useCallback((newTx) => {
    setTransactions((prev) => [newTx, ...prev.slice(0, 19)]);
  }, []);

  useWebSocket(handleNewTx);

  const handleResetFilters = () => {
    setSearch('');
    setRiskLevel('');
    setStatus('');
    setMinAmount('');
    setMaxAmount('');
    setPage(1);
  };

  const handleExportCSV = () => {
    const headers = ['Tx Hash', 'Block Height', 'Timestamp', 'Sender', 'Receiver', 'BTC Amount', 'USD Value', 'Risk Score', 'Risk Level', 'Status'];
    const rows = transactions.map(t => [
      t.tx_hash,
      t.block_height,
      t.timestamp,
      t.sender,
      t.receiver,
      t.amount,
      t.usd_value || (t.amount * 65000),
      t.risk_score,
      t.risk_level,
      t.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bitcoin_transactions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `bitcoin_transactions_export_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 font-mono">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-6 h-6 text-btc-orange" />
            <h2 className="text-xl font-bold text-white tracking-tight">Real-Time Transaction Monitoring</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Live ingestion, search, filter, and inspect Bitcoin traffic with AI risk scores. Total indexed: {totalCount}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-800 hover:bg-gray-800 text-xs font-semibold text-gray-200 border border-gray-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-btc-orange" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-800 hover:bg-gray-800 text-xs font-semibold text-gray-200 border border-gray-700 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-soc-blue" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={fetchTransactions}
            className="p-2 bg-dark-800 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        search={search}
        setSearch={setSearch}
        riskLevel={riskLevel}
        setRiskLevel={setRiskLevel}
        status={status}
        setStatus={setStatus}
        minAmount={minAmount}
        setMinAmount={setMinAmount}
        maxAmount={maxAmount}
        setMaxAmount={setMaxAmount}
        onReset={handleResetFilters}
      />

      {/* Transactions Table Card */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
        {loading ? (
          <LoadingSpinner message="Filtering Bitcoin transactions dataset..." />
        ) : (
          <>
            <TransactionTable transactions={transactions} />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-400">
              <div>
                Showing Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong> ({totalCount} total results)
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 bg-dark-800 border border-gray-700 rounded-lg text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 bg-dark-800 border border-gray-700 rounded-lg text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
