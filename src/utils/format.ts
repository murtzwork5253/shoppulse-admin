export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

/** Turns an API category slug into a label: `home-decoration` → `Home decoration`. */
export const formatCategory = (slug: string) => {
  const text = slug.replace(/-/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatCompact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
