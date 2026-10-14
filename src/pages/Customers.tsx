import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getUsers } from '../api/users';
import { DataTable, type Column } from '../components/table/DataTable';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { useTableParams } from '../hooks/useTableParams';
import type { User } from '../types';

const columns: Column<User>[] = [
  {
    key: 'name',
    header: 'Customer',
    render: (u) => (
      <div className="flex items-center gap-3">
        <img
          src={u.image}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="size-10 shrink-0 rounded-full bg-surface-2 object-cover ring-2 ring-line"
        />
        <div className="min-w-0">
          <p className="font-medium">
            {u.firstName} {u.lastName}
          </p>
          <p className="text-xs text-ink-2">@{u.username}</p>
        </div>
      </div>
    ),
  },
  { key: 'email', header: 'Email', render: (u) => <span className="break-all">{u.email}</span> },
  {
    key: 'phone',
    header: 'Phone',
    className: 'hidden md:table-cell',
    render: (u) => u.phone,
  },
  {
    key: 'location',
    header: 'Location',
    className: 'hidden lg:table-cell',
    render: (u) => `${u.address.city}, ${u.address.country}`,
  },
];

export default function Customers() {
  const { page, pageSize, q, update } = useTableParams();

  const [search, setSearch] = useState(q);
  const debouncedSearch = useDebounce(search);
  useEffect(() => {
    if (debouncedSearch !== q) update({ q: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, loading, error, retry } = useFetch(
    (signal) => getUsers({ page, pageSize, q }, signal),
    [page, pageSize, q],
  );

  // If the URL asks for a page past the end, jump to the last real page.
  useEffect(() => {
    if (!data || data.total === 0) return;
    const lastPage = Math.ceil(data.total / pageSize);
    if (page > lastPage) update({ page: lastPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3 shadow-card sm:flex-row sm:items-center">
        <div className="sm:w-80">
          <Input
            label="Search customers"
            hideLabel
            icon={<Search size={16} />}
            type="search"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {q && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('');
              update({ q: undefined });
            }}
          >
            Clear search
          </Button>
        )}
      </div>

      {error ? (
        <div className="rounded-2xl border border-line bg-surface shadow-card">
          <ErrorState message={error} onRetry={retry} />
        </div>
      ) : (
        <>
          <DataTable
            caption="Customers"
            columns={columns}
            rows={data?.users ?? []}
            getRowId={(u) => u.id}
            loading={loading}
            skeletonRows={pageSize}
            emptyMessage={q ? 'No customers match your search.' : 'No customers found.'}
          />
          {data && (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={data.total}
              onPageChange={(p) => update({ page: p === 1 ? undefined : p })}
              onPageSizeChange={(size) => update({ size })}
            />
          )}
        </>
      )}
    </div>
  );
}
