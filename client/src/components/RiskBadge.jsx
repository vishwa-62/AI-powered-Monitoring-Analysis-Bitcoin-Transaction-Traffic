import React from 'react';
import { getRiskColor, getStatusColor } from '../utils/risk';

export function RiskBadge({ level, score }) {
  const style = getRiskColor(level);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style.badge}`}
      style={{ boxShadow: `0 0 14px ${style.hex}24` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: style.hex, boxShadow: `0 0 7px ${style.hex}` }}
      />
      <span>{level || 'LOW'}</span>
      {score !== undefined && <span className="opacity-75 font-mono">({score})</span>}
    </span>
  );
}

export function StatusBadge({ status }) {
  const styleClass = getStatusColor(status);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styleClass}`}>
      {status || 'NORMAL'}
    </span>
  );
}