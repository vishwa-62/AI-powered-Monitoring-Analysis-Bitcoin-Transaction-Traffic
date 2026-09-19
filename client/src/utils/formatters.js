export function formatBTC(val) {
  if (val === undefined || val === null) return '0.00000000 BTC';
  return `${Number(val).toFixed(8)} BTC`;
}

export function formatUSD(val) {
  if (val === undefined || val === null) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

export function truncateHash(str, start = 8, end = 6) {
  if (!str) return '';
  if (str.length <= start + end) return str;
  return `${str.substring(0, start)}...${str.substring(str.length - end)}`;
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
