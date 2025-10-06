/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {Object} [options] - Formatting options
 * @param {string} [options.locale] - BCP 47 language tag (default: 'en-US')
 * @param {string} [options.currency] - ISO 4217 currency code (default: 'USD')
 * @param {boolean} [options.showCurrencyCode] - Show currency code (default: false)
 * @param {number} [options.decimalPlaces] - Number of decimal places (auto-detected by default)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(
  amount,
  {
    locale = 'en-IN',
    currency = 'INR',
    showCurrencyCode = false,
    decimalPlaces = null
  } = {}
) {
  // Handle invalid amounts
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '---';
  }

  // Auto-detect decimal places for common zero-decimal currencies
  const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND', 'CLP', 'ISK'];
  const autoDecimalPlaces = zeroDecimalCurrencies.includes(currency) ? 0 : 2;
  
  // Configure number format options
  const formatOptions = {
    style: 'currency',
    currency,
    currencyDisplay: showCurrencyCode ? 'code' : 'symbol',
    minimumFractionDigits: decimalPlaces ?? autoDecimalPlaces,
    maximumFractionDigits: decimalPlaces ?? autoDecimalPlaces
  };

  try {
    const formatter = new Intl.NumberFormat(locale, formatOptions);
    return formatter.format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    // Fallback formatting
    return showCurrencyCode 
      ? `${currency} ${amount.toFixed(formatOptions.maximumFractionDigits)}`
      : `${amount.toFixed(formatOptions.maximumFractionDigits)}`;
  }
}

// Optional: Create commonly used currency formatters
export const currencyFormatters = {
  // usd: (amount) => formatCurrency(amount, { currency: 'USD' }),
  eur: (amount) => formatCurrency(amount, { currency: 'EUR' }),
  jpy: (amount) => formatCurrency(amount, { currency: 'JPY' }),
  inr: (amount) => formatCurrency(amount, { currency: 'INR' })
};

export function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Invalid date:', dateStr);
    return 'Invalid Date';
  }
}
