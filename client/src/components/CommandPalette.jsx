import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  ArrowRightLeft,
  Wallet,
  BrainCircuit,
  Network,
  Bell,
  BarChart3,
  FileText,
  User,
  Settings,
  ArrowUpRight,
  Sparkles,
  Command,
  X
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const commands = [
    { label: 'Dashboard', category: 'Navigation', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Transactions Ledger', category: 'Navigation', icon: ArrowRightLeft, path: '/transactions' },
    { label: 'Wallet Registry', category: 'Navigation', icon: Wallet, path: '/wallets' },
    { label: 'AI Risk Intelligence Engine', category: 'Navigation', icon: BrainCircuit, path: '/ai-analysis' },
    { label: 'Network Flow Graph', category: 'Navigation', icon: Network, path: '/network' },
    { label: 'Alert Investigation Queue', category: 'Navigation', icon: Bell, path: '/alerts' },
    { label: 'Analytics Suite & Metrics', category: 'Navigation', icon: BarChart3, path: '/analytics' },
    { label: 'Compliance Reports Generator', category: 'Navigation', icon: FileText, path: '/reports' },
    { label: 'User Profile & Security Keys', category: 'Navigation', icon: User, path: '/profile' },
    { label: 'System Settings & Nodes', category: 'Navigation', icon: Settings, path: '/settings' },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent state update
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (item) => {
    if (item.path) {
      navigate(item.path);
      onClose();
      toast.info(`Navigated to ${item.label}`);
    } else if (query.trim()) {
      // Execute search query directly
      navigate(`/transactions?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      } else if (query.trim()) {
        navigate(`/transactions?search=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-dark-900 border border-white/15 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-5 h-5 text-btc-orange shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, route, transaction hash, or wallet address..."
            className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-sm focus:outline-none font-sans"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-gray-400">
              ESC to exit
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={cmd.path || cmd.label}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-150 ${
                    isSelected
                      ? 'bg-gradient-to-r from-btc-orange/20 via-btc-orange/10 to-transparent border border-btc-orange/30 text-white shadow-glow-soft'
                      : 'text-gray-300 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        isSelected
                          ? 'bg-btc-orange/20 border-btc-orange/40 text-btc-orange'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{cmd.label}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{cmd.category}</div>
                    </div>
                  </div>

                  <ArrowUpRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-btc-orange opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                  />
                </div>
              );
            })
          ) : (
            <div
              onClick={() => handleSelect({})}
              className="p-6 text-center text-gray-400 hover:text-white cursor-pointer group"
            >
              <Sparkles className="w-6 h-6 mx-auto text-btc-orange mb-2 animate-bounce" />
              <p className="text-xs">Search for hash or address: <span className="font-mono text-white underline">{query}</span></p>
              <p className="text-[10px] text-gray-500 mt-1">Press ENTER to launch global search query</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 text-[10px]">↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 text-[10px]">↵</kbd> select
            </span>
          </div>
          <div className="flex items-center gap-1 text-btc-orange">
            <Command className="w-3.5 h-3.5" />
            <span>Bitcoin SOC Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
