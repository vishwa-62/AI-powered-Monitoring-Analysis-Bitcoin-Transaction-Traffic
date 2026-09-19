import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Cpu, Radio, Save } from 'lucide-react';

export default function Settings() {
  const [provider, setProvider] = useState('synthetic');
  const [apiUrl, setApiUrl] = useState('https://blockchain.info');
  const [aiUrl, setAiUrl] = useState('http://localhost:8000');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 font-mono max-w-3xl">
      <div className="flex items-center gap-3 glass-panel p-5 rounded-2xl border border-gray-800">
        <SettingsIcon className="w-6 h-6 text-btc-orange" />
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System & Monitoring Settings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Configure data provider endpoints and AI service parameters.</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-5 text-xs">
        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl">
            Settings saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-bold mb-1.5">Bitcoin Data Provider Engine</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-dark-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:border-btc-orange"
            >
              <option value="synthetic">Synthetic High-Frequency Data Stream (Development)</option>
              <option value="live">Live Blockchain RPC API (Blockchain.info / Mempool.space)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1.5">Bitcoin API Node Endpoint</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full bg-dark-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:border-btc-orange"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1.5">Python AI Service REST URL</label>
            <input
              type="text"
              value={aiUrl}
              onChange={(e) => setAiUrl(e.target.value)}
              className="w-full bg-dark-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:border-btc-orange"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-btc-orange hover:bg-btc-amber text-black font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
