import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

type Props = {
  title: string;
  message?: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
      <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-600 dark:text-brand-300">
        <Inbox size={28} aria-hidden />
      </div>
      <p className="font-semibold">{title}</p>
      {message && <p className="max-w-sm text-sm text-ink-2">{message}</p>}
      {action}
    </div>
  );
}
