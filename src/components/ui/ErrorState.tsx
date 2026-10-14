import { TriangleAlert } from 'lucide-react';
import { Button } from './Button';

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-4 py-14 text-center">
      <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-600 dark:text-rose-300">
        <TriangleAlert size={28} aria-hidden />
      </div>
      <div>
        <p className="font-semibold">Something went wrong</p>
        <p className="mt-1 text-sm text-ink-2">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
