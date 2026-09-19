import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Shield, Wallet, X, Filter, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { truncateHash, formatBTC } from '../utils/formatters';

// Clean SaaS Circular Node
function WalletNode({ data }) {
  const isSelected = data.isSelected;

  const getBorderColor = () => {
    switch (data.risk_level) {
      case 'CRITICAL': return 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300';
      case 'HIGH': return 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300';
      case 'MEDIUM': return 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300';
      case 'LOW':
      default: return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
    }
  };

  return (
    <div className={`px-3.5 py-2.5 rounded-2xl border-2 shadow-sm font-sans transition-all bg-white dark:bg-[#191C1F] ${getBorderColor()} ${isSelected ? 'ring-2 ring-[#F7931A] scale-105 shadow-md' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#202428] flex items-center justify-center shrink-0">
          <Wallet className="w-3.5 h-3.5 text-[#F7931A]" />
        </div>
        <span className="text-xs font-semibold font-mono text-gray-900 dark:text-white">
          {truncateHash(data.address || data.label, 5, 3)}
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] gap-3 pt-1 border-t border-gray-100 dark:border-[#2D3135]">
        <span className="text-gray-500 dark:text-gray-400">Score: {data.risk_score}</span>
        <span className="font-bold uppercase tracking-wider">{data.risk_level}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
    </div>
  );
}

const nodeTypes = { walletNode: WalletNode };

export default function NetworkGraph({ initialNodes = [], initialEdges = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterRisk, setFilterRisk] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  // Transform input nodes & edges
  const transformedData = useMemo(() => {
    let rawNodes = initialNodes.length ? initialNodes : [
      { id: '1bc1q_alpha', address: '1bc1q_alpha_master_wallet_01', balance: 120.5, risk_score: 88, risk_level: 'CRITICAL', incoming: 550.0, outgoing: 429.5 },
      { id: '3btc_beta', address: '3btc_beta_mixer_node_02', balance: 45.25, risk_score: 68, risk_level: 'HIGH', incoming: 310.0, outgoing: 264.7 },
      { id: '1bc1q_gamma', address: '1bc1q_gamma_exchange_hot_03', balance: 890.1, risk_score: 12, risk_level: 'LOW', incoming: 12500.0, outgoing: 11609.8 },
      { id: 'bc1q_delta', address: 'bc1q_delta_layering_hop_04', balance: 15.8, risk_score: 82, risk_level: 'CRITICAL', incoming: 88.0, outgoing: 72.2 },
      { id: '3btc_epsilon', address: '3btc_epsilon_unidentified_05', balance: 5.4, risk_score: 45, risk_level: 'MEDIUM', incoming: 32.1, outgoing: 26.7 }
    ];

    let rawEdges = initialEdges.length ? initialEdges : [
      { id: 'e1-2', source: '1bc1q_alpha', target: '3btc_beta', amount: 42.5 },
      { id: 'e2-3', source: '3btc_beta', target: '1bc1q_gamma', amount: 12.0 },
      { id: 'e1-4', source: '1bc1q_alpha', target: 'bc1q_delta', amount: 30.0 },
      { id: 'e4-5', source: 'bc1q_delta', target: '3btc_epsilon', amount: 28.5 }
    ];

    if (filterRisk) {
      rawNodes = rawNodes.filter((n) => n.risk_level === filterRisk);
    }

    if (searchAddress.trim()) {
      rawNodes = rawNodes.filter((n) => (n.address || n.id).toLowerCase().includes(searchAddress.toLowerCase()));
    }

    const flowNodes = rawNodes.map((n, i) => {
      const angle = (i / rawNodes.length) * 2 * Math.PI;
      const radius = 220;
      const x = 380 + radius * Math.cos(angle);
      const y = 260 + radius * Math.sin(angle);

      return {
        id: n.id,
        type: 'walletNode',
        position: { x, y },
        data: {
          ...n,
          label: n.label || n.address,
          isSelected: selectedNode?.id === n.id
        }
      };
    });

    const validNodeIds = new Set(flowNodes.map((fn) => fn.id));
    const flowEdges = rawEdges
      .filter((e) => validNodeIds.has(e.source) && validNodeIds.has(e.target))
      .map((e) => ({
        ...e,
        animated: true,
        style: { stroke: '#F7931A', strokeWidth: 2 },
        label: `${e.amount} BTC`
      }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [initialNodes, initialEdges, filterRisk, searchAddress, selectedNode]);

  const [nodes, setNodes] = useState(transformedData.nodes);
  const [edges, setEdges] = useState(transformedData.edges);

  React.useEffect(() => {
    setNodes(transformedData.nodes);
    setEdges(transformedData.edges);
  }, [transformedData]);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onNodeClick = (_, node) => {
    setSelectedNode(node.data);
  };

  return (
    <div className="relative w-full h-[600px] saas-card overflow-hidden">
      {/* Controls Bar: Filter & Search */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 bg-white/90 dark:bg-[#191C1F]/90 backdrop-blur-md p-2.5 rounded-2xl border border-gray-200 dark:border-[#2D3135] shadow-saas-card">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#F7931A]" />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="text-xs bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl px-2.5 py-1 text-gray-900 dark:text-white focus:outline-none"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL font-bold">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>

        <input
          type="text"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          placeholder="Filter address..."
          className="text-xs bg-gray-100 dark:bg-[#202428] border border-gray-200 dark:border-[#2D3135] rounded-xl px-2.5 py-1 text-gray-900 dark:text-white focus:outline-none"
        />

        {(filterRisk || searchAddress) && (
          <button
            onClick={() => { setFilterRisk(''); setSearchAddress(''); }}
            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white px-2 py-1 bg-gray-100 dark:bg-[#202428] rounded-xl transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#9CA3AF" gap={24} size={1} />
        <Controls className="!bg-white dark:!bg-[#191C1F] !border-gray-200 dark:!border-[#2D3135] !rounded-xl text-gray-700 dark:text-gray-300" />
      </ReactFlow>

      {/* Right-Side Wallet Drawer Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bottom-4 w-80 bg-white/95 dark:bg-[#191C1F]/95 backdrop-blur-xl border border-gray-200 dark:border-[#2D3135] rounded-2xl p-4 shadow-2xl z-20 overflow-y-auto flex flex-col justify-between animate-slide-up">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#2D3135] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#F7931A]" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Wallet Details</h3>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Address</span>
                <p className="font-mono font-semibold text-[#F7931A] break-all mt-0.5">{selectedNode.address || selectedNode.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-[#2D3135]">
                <div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Risk Score</span>
                  <p className="text-base font-bold text-gray-900 dark:text-white font-mono mt-0.5">{selectedNode.risk_score} / 100</p>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Status</span>
                  <div className="mt-1"><RiskBadge level={selectedNode.risk_level} /></div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-[#2D3135] space-y-2">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">Flow Metrics</span>
                <div className="saas-card-secondary p-3 space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Balance</span>
                    <span className="font-bold font-mono text-gray-900 dark:text-white">{formatBTC(selectedNode.balance || 120.5)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1"><ArrowDownLeft className="w-3 h-3" /> Incoming</span>
                    <span className="font-bold font-mono">{formatBTC(selectedNode.incoming || 550.0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-600 dark:text-rose-400">
                    <span className="flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> Outgoing</span>
                    <span className="font-bold font-mono">{formatBTC(selectedNode.outgoing || 429.5)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a
            href={`/wallets/${selectedNode.address || selectedNode.id}`}
            className="w-full text-center py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl text-xs transition-opacity hover:opacity-90 mt-4"
          >
            View Wallet Profile
          </a>
        </div>
      )}
    </div>
  );
}
