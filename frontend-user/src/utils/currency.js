const CONFIG = {
  INR: { prefix: '₹', suffix: '' },
  AED: { prefix: 'AED ', suffix: '' },
};

export const formatCurrency = (amount, currency = 'AED') => {
  const cur = (currency || 'AED').toUpperCase();
  const { prefix, suffix } = CONFIG[cur] || { prefix: `${cur} `, suffix: '' };
  const value = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
  return `${prefix}${value}${suffix}`;
};

export const getStoredCurrency = () => localStorage.getItem('currency') || 'AED';

export const setStoredCurrency = (currency) => {
  localStorage.setItem('currency', currency);
};
