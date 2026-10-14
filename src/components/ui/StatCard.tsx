import type { LucideIcon } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Card } from './Card';
import { Skeleton } from './Skeleton';

type Tone = 'violet' | 'emerald' | 'sky' | 'amber';

const tones: Record<Tone, { tile: string; glow: string }> = {
  violet: { tile: 'from-brand-400 to-brand-700', glow: 'bg-brand-500/25' },
  emerald: { tile: 'from-emerald-400 to-emerald-600', glow: 'bg-emerald-500/25' },
  sky: { tile: 'from-sky-400 to-blue-600', glow: 'bg-sky-500/25' },
  amber: { tile: 'from-amber-400 to-orange-500', glow: 'bg-amber-500/25' },
};

type Props = {
  label: string;
  value?: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  loading?: boolean;
};

export function StatCard({ label, value, hint, icon: Icon, tone = 'violet', loading }: Props) {
  const t = tones[tone];
  return (
    <Card className="relative flex items-start justify-between gap-3 overflow-hidden transition hover:-translate-y-0.5 hover:shadow-pop">
      <div
        aria-hidden
        className={cx('absolute -top-10 -right-10 size-32 rounded-full blur-2xl', t.glow)}
      />
      <div className="relative min-w-0">
        <p className="text-sm font-medium text-ink-2">{label}</p>
        {loading ? (
          <>
            <Skeleton className="mt-3 h-8 w-28" />
            <Skeleton className="mt-2.5 h-4 w-24" />
          </>
        ) : (
          <>
            <p className="mt-2 truncate text-3xl font-semibold tracking-tight tabular-nums">
              {value}
            </p>
            <p className="mt-1.5 text-xs text-ink-2">{hint}</p>
          </>
        )}
      </div>
      <div
        className={cx(
          'relative rounded-xl bg-gradient-to-br p-2.5 text-white shadow-lg shadow-black/10',
          t.tile,
        )}
      >
        <Icon size={20} aria-hidden />
      </div>
    </Card>
  );
}
