import { render, screen } from '@testing-library/react';
import { StockBadge } from './StockBadge';

describe('StockBadge', () => {
  it.each([
    [0, 'Out of stock'],
    [1, 'Low stock'],
    [9, 'Low stock'],
    [10, 'In stock'],
    [250, 'In stock'],
  ])('shows the right label for stock %i', (stock, label) => {
    render(<StockBadge stock={stock} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
