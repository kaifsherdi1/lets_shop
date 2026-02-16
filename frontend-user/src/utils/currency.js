export const formatCurrency = (amount, currency = 'INR') => {
  const symbols = {
    INR: '₹',
    AED: 'د.إ',
  };

  const symbol = symbols[currency] || currency;
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formatted}`;
};

export const getStoredCurrency = () => {
  return localStorage.getItem('currency') || 'INR';
};

export const setStoredCurrency = (currency) => {
  localStorage.setItem('currency', currency);
};
