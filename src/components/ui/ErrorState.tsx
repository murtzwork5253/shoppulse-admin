import { TriangleAlert } from 'lucide-react';
import { Button } from './Button';

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <TriangleAlert size={32} className="text-red-500" aria-hidden />
      <div>
        <p className="font-medium">Something went wrong</p>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
