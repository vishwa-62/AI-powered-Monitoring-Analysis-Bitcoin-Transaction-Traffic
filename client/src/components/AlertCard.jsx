import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Shield, ShieldCheck, MessageSquare, ChevronDown } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { formatDate, truncateHash } from '../utils/formatters';

const SEVERITY_STYLES = {
  CRITICAL: { tile: 'from-soc-purple/25 to-soc-purple/[0.02] border-soc-purple/35 text-soc-purple' },
  HIGH: { tile: 'from-soc-red/25 to-soc-red/[0.02] border-soc-red/35 text-soc-red' },
  MEDIUM: { tile: 'from-soc-yellow/25 to-soc-yellow/[0.02] border-soc-yellow/35 text-soc-yellow' },
  LOW: { tile: 'from-soc-green/25 to-soc-green/[0.02] border-soc-green/35 text-soc-green' },
  INFO: { tile: 'from-soc-blue/25 to-soc-blue/[0.02] border-soc-blue/35 text-soc-blue' },
};

function SeverityIcon({ severity }) {
  const sev = (severity || '').toUpperCase();
  if (sev === 'CRITICAL') return <ShieldAlert className="w-5 h-5" />;
  if (sev === 'HIGH') return <AlertTriangle className="w-5 h-5" />;
  if (sev === 'MEDIUM' || sev === 'LOW') return <Shield className="w-5 h-5" />;
  return <ShieldCheck className="w-5 h-5" />;
}

export default function AlertCard({ alert, onUpdateStatus, onAddNote }) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(alert.id, noteText);
    setNoteText('');
  };

  const style = SEVERITY_STYLES[(alert.severity || '').toUpperCase()] || SEVERITY_STYLES.HIGH;

  return (
    <div className="glass-panel card-lift p-5 rounded-xl group hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${style.tile} shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`}>
            <SeverityIcon severity={alert.severity} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-white tracking-tight">{alert.alert_type}</h4>
              <RiskBadge level={alert.severity} score={alert.risk_score} />
            </div>
            <div className="text-xs text-gray-500 mt-0.5 font-mono">
              <span>Alert #{alert.id}</span> <span className="text-gray-700">•</span> <span>{formatDate(alert.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={alert.status}
            onChange={(e) => onUpdateStatus(alert.id, e.target.value)}
            className="bg-dark-800/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-gray-200 focus:outline-none focus:border-btc-orange/60 transition-all hover:border-white/20"
          >
            <option value="NEW">NEW</option>
            <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-400 my-3 leading-relaxed bg-black/25 p-3 rounded-lg border border-white/5">
        {alert.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 pt-2.5 border-t border-white/5">
        <div className="flex items-center gap-4">
          {alert.tx_hash && (
            <div>
              <span>Tx: </span>
              <a href={`/transactions/${alert.tx_hash}`} className="text-btc-orange/90 hover:text-btc-orange hover:underline font-semibold transition-colors">
                {truncateHash(alert.tx_hash)}
              </a>
            </div>
          )}
          {alert.wallet_address && (
            <div>
              <span>Wallet: </span>
              <a href={`/wallets/${alert.wallet_address}`} className="text-soc-blue/90 hover:text-soc-blue hover:underline font-semibold transition-colors">
                {truncateHash(alert.wallet_address, 6, 4)}
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-500">
            Assigned: <strong className="text-gray-200">{alert.assigned_user || 'Lead Security Analyst'}</strong>
          </span>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1 text-gray-300 hover:text-white px-2 py-1 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 rounded-md transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Notes ({alert.notes ? alert.notes.length : 0})</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showNotes ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Investigation Notes Panel */}
      {showNotes && (
        <div className="mt-3 pt-3 border-t border-white/5 space-y-2 animate-fade-in">
          {alert.notes && alert.notes.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {alert.notes.map((n, idx) => (
                <div key={idx} className="bg-black/25 p-2.5 rounded-lg text-xs border border-white/5">
                  <div className="flex justify-between text-gray-500 text-[10px] mb-0.5">
                    <span className="font-bold text-gray-200">{n.user_name || 'Analyst'}</span>
                    <span>{formatDate(n.created_at)}</span>
                  </div>
                  <div className="text-gray-300">{n.note}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-gray-600 italic">No investigation notes attached yet.</div>
          )}

          <form onSubmit={handleNoteSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add investigation note..."
              className="flex-1 field !py-1.5 text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-brand-gradient hover:shadow-glow-btc text-black font-bold text-xs rounded-lg transition-all duration-300"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}