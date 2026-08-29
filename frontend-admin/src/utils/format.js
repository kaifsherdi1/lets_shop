const PREFIX = { AED: 'AED ', INR: '₹' };

/**
 * Format a monetary amount with the order/wallet currency.
 * Falls back to AED when the record has no currency set.
 */
export function money(amount, currency = 'AED') {
  const cur = (currency || 'AED').toUpperCase();
  const prefix = PREFIX[cur] || `${cur} `;
  const value = Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${prefix}${value}`;
}

export function shortDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

export function titleCase(s) {
  return String(s || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
