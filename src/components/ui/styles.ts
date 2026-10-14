/** Shared class strings so focus, links and icon buttons look identical everywhere. */

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-app';

export const linkClass = `rounded font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-300 dark:hover:text-brand-200 ${focusRing}`;

export const iconButtonClass = `rounded-xl p-2.5 text-ink-2 hover:bg-surface-2 hover:text-ink ${focusRing}`;

export const fieldClass =
  'block w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink shadow-sm placeholder:text-ink-3 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40';

export const rowLinkClass = `flex items-center gap-3 rounded-lg font-medium hover:text-brand-600 dark:hover:text-brand-300 ${focusRing}`;

export const backLinkClass = `inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-ink-2 hover:text-brand-600 dark:hover:text-brand-300 ${focusRing}`;
