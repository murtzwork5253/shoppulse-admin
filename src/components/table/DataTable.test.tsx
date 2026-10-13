import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type Column } from './DataTable';

type Row = { id: number; name: string; price: number };

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', sortable: true, render: (r) => r.name },
  { key: 'price', header: 'Price', align: 'right', render: (r) => `$${r.price}` },
];

const rows: Row[] = [
  { id: 1, name: 'Alpha', price: 10 },
  { id: 2, name: 'Beta', price: 20 },
];

describe('DataTable', () => {
  it('renders rows and headers', () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
  });

  it('shows the default empty message', () => {
    render(<DataTable columns={columns} rows={[]} getRowId={(r) => r.id} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('shows a custom empty message', () => {
    render(
      <DataTable columns={columns} rows={[]} getRowId={(r) => r.id} emptyMessage="Nothing here" />,
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('shows skeleton rows instead of data while loading', () => {
    render(
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} loading skeletonRows={3} />,
    );
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    // one header row + three skeleton rows
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('calls onSort with the column key when a sortable header is clicked', async () => {
    const onSort = vi.fn();
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} onSort={onSort} />);
    await userEvent.click(screen.getByRole('button', { name: /name/i }));
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('does not render a sort button for non-sortable columns', () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} onSort={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /price/i })).not.toBeInTheDocument();
  });

  it('marks the active sort column with aria-sort', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onSort={vi.fn()}
        sortBy="name"
        order="desc"
      />,
    );
    expect(screen.getByRole('columnheader', { name: /name/i })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
  });
});
