/**
 * Formats a numeric price as INR currency (e.g. 1250000 -> "₹12,50,000").
 * @param {number|string} price
 * @returns {string}
 */
export const formatCurrency = (price) => {
  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice)) return '—';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numericPrice);
};
