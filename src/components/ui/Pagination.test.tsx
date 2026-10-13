import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

const setup = (props: Partial<React.ComponentProps<typeof Pagination>> = {}) => {
  const onPageChange = vi.fn();
  const onPageSizeChange = vi.fn();
  render(
    <Pagination
      page={1}
      pageSize={10}
      total={194}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      {...props}
    />,
  );
  return { onPageChange, onPageSizeChange };
};

describe('Pagination', () => {
  it('shows the visible range and total', () => {
    setup({ page: 2 });
    expect(screen.getByText('Showing 11–20 of 194')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 20')).toBeInTheDocument();
  });

  it('clamps the range on the last page', () => {
    setup({ page: 20 });
    expect(screen.getByText('Showing 191–194 of 194')).toBeInTheDocument();
  });

  it('shows zeros when there are no results', () => {
    setup({ total: 0 });
    expect(screen.getByText('Showing 0–0 of 0')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('disables Previous on the first page', () => {
    setup({ page: 1 });
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });

  it('disables Next on the last page', () => {
    setup({ page: 20 });
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
  });

  it('asks for the next and previous page', async () => {
    const { onPageChange } = setup({ page: 5 });
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
    await userEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
  });

  it('reports a new page size', async () => {
    const { onPageSizeChange } = setup();
    await userEvent.selectOptions(screen.getByLabelText('Rows per page'), '50');
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });
});
