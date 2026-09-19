import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Hash, Wallet, AlertTriangle, Layers } from 'lucide-react';
import API from '../services/api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      API.get(`/search?q=${encodeURIComponent(query)}`)
        .then(res => {
          if (res.success) {
            setResults(res.results || []);
            setIsOpen(true);
          }
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (link) => {
    setIsOpen(false);
    setQuery('');
    navigate(link);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'TRANSACTION': return <Hash className="w-4 h-4 text-btc-orange" />;
      case 'WALLET': return <Wallet className="w-4 h-4 text-soc-blue" />;
      case 'ALERT': return <AlertTriangle className="w-4 h-4 text-soc-red" />;
      default: return <Layers className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search Tx Hash, Wallet Address, Block, Alert ID..."
          className="w-full pl-9 pr-8 py-1.5 bg-white/[0.045] border border-white/10 hover:border-white/20 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-btc-orange/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12),inset_0_1px_2px_rgba(0,0,0,0.35)] transition-all font-mono"
        />
        {loading && <Loader2 className="absolute right-3 w-4 h-4 text-btc-orange animate-spin" />}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-dark-850/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-1 space-y-0.5">
              {results.map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectResult(res.link)}
                  className="flex items-center justify-between p-2.5 hover:bg-white/[0.06] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-1.5 bg-black/30 border border-white/10 rounded-md">
                      {getIcon(res.type)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm font-medium text-gray-200 truncate font-mono">{res.title}</div>
                      <div className="text-xs text-gray-500 truncate">{res.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/[0.07] border border-white/10 text-gray-300 ml-2 whitespace-nowrap">
                    {res.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-400 font-mono">
              No matching transaction, wallet, or alert found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
