import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

type Props = {
  label: string;
  value?: string;
  hint?: string;
  icon: LucideIcon;
  loading?: boolean;
};

export function StatCard({ label, value, hint, icon: Icon, loading }: Props) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        {loading ? (
          <>
            <Skeleton className="mt-2 h-8 w-28" />
            <Skeleton className="mt-2 h-4 w-24" />
          </>
        ) : (
          <>
            <p className="mt-1 truncate text-2xl font-semibold tabular-nums">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          </>
        )}
      </div>
      <div className="rounded-lg bg-brand-50 p-2 text-brand-600 dark:bg-brand-600/20 dark:text-brand-50">
        <Icon size={20} aria-hidden />
      </div>
    </Card>
  );
}
