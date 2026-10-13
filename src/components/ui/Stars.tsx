import { Star } from 'lucide-react';

/** Five stars, filled up to the rounded rating. */
export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  const filled = Math.round(rating);
  return (
    <span
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
      className="inline-flex items-center gap-0.5 text-amber-500"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden
          fill={i < filled ? 'currentColor' : 'none'}
          className={i < filled ? '' : 'text-slate-300 dark:text-slate-600'}
        />
      ))}
    </span>
  );
}
