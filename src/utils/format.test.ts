import { formatCategory, formatCompact, formatCurrency, formatNumber } from './format';

describe('formatters', () => {
  it('formats currency', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats numbers with separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('formats compact numbers', () => {
    expect(formatCompact(12500)).toBe('12.5K');
    expect(formatCompact(3456710)).toBe('3.5M');
  });

  it('turns category slugs into labels', () => {
    expect(formatCategory('home-decoration')).toBe('Home decoration');
    expect(formatCategory('beauty')).toBe('Beauty');
  });
});
