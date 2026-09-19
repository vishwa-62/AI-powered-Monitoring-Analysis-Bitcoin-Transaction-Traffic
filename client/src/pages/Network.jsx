import React, { useState, useEffect } from 'react';
import { Network as NetworkIcon, RefreshCw } from 'lucide-react';
import NetworkGraph from '../components/NetworkGraph';
import { CardSkeleton } from '../components/Skeleton';
import API from '../services/api';

export default function NetworkPage() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNetwork = () => {
    setLoading(true);
    API.get('/network?limit=60')
      .then((res) => {
        if (res.success) {
          setNodes(res.nodes);
          setEdges(res.edges);
        }
      })
      .catch((err) => console.error('Error fetching network graph:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNetwork();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#202428] text-[#F7931A]">
              <NetworkIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Transaction Network Graph</h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visual topology mapping of wallet nodes, transaction flows, and graph centrality relationships.
          </p>
        </div>

        <button
          onClick={fetchNetwork}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#191C1F] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2D3135] shadow-sm hover:bg-gray-50 dark:hover:bg-[#202428] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Graph</span>
        </button>
      </div>

      {/* Main Graph Canvas */}
      <div className="space-y-4">
        {loading ? (
          <CardSkeleton />
        ) : (
          <NetworkGraph initialNodes={nodes} initialEdges={edges} />
        )}
      </div>
    </div>
  );
}
