export function getRiskColor(level) {
  switch ((level || '').toUpperCase()) {
    case 'CRITICAL':
      return {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/40',
        text: 'text-purple-400',
        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        hex: '#8B5CF6'
      };
    case 'HIGH':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/40',
        text: 'text-red-400',
        badge: 'bg-red-500/20 text-red-300 border-red-500/30',
        hex: '#EF4444'
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        hex: '#F59E0B'
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        hex: '#10B981'
      };
  }
}

export function getStatusColor(status) {
  switch ((status || '').toUpperCase()) {
    case 'FLAGGED':
    case 'SUSPICIOUS':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'INVESTIGATING':
    case 'MONITORED':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'RESOLVED':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'NORMAL':
    default:
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  }
}
