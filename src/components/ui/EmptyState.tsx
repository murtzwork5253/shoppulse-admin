import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

type Props = {
  title: string;
  message?: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <Inbox size={32} className="text-slate-400" aria-hidden />
      <p className="font-medium">{title}</p>
      {message && <p className="max-w-sm text-sm text-slate-500">{message}</p>}
      {action}
    </div>
  );
}
