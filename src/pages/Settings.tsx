import { Check, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { focusRing } from '../components/ui/styles';
import { useAuth } from '../context/AuthContext';
import { useTheme, type Theme } from '../context/ThemeContext';
import { cx } from '../utils/cx';

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

/** A tiny mock of the app in the given theme, so the choice is visual. */
function Preview({ mode }: { mode: Theme }) {
  const half = (dark: boolean) => (
    <div className={cx('flex flex-1 gap-1.5 p-2', dark ? 'bg-[#12152b]' : 'bg-white')}>
      <div className={cx('w-3 rounded', dark ? 'bg-[#2a2470]' : 'bg-brand-500/80')} />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className={cx('h-1.5 w-2/3 rounded', dark ? 'bg-[#3a4072]' : 'bg-slate-200')} />
        <div className={cx('h-5 rounded', dark ? 'bg-[#1a1e3a]' : 'bg-slate-100')} />
        <div className={cx('h-1.5 w-1/2 rounded', dark ? 'bg-[#3a4072]' : 'bg-slate-200')} />
      </div>
    </div>
  );
  return (
    <div
      aria-hidden
      className="flex h-20 w-full overflow-hidden rounded-lg ring-1 ring-black/10 dark:ring-white/15"
    >
      {mode === 'system' ? (
        <>
          {half(false)}
          {half(true)}
        </>
      ) : (
        half(mode === 'dark')
      )}
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="text-lg font-semibold tracking-tight">Appearance</h2>
        <p className="mt-1 text-sm text-ink-2">
          Choose a theme. &ldquo;System&rdquo; follows your device setting.
        </p>
        <div role="group" aria-label="Theme" className="mt-5 grid grid-cols-3 gap-3">
          {options.map(({ value, label, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={active}
                className={cx(
                  'relative flex flex-col gap-3 rounded-2xl border-2 p-2.5 text-sm font-medium transition',
                  focusRing,
                  active
                    ? 'border-brand-500 bg-brand-500/5'
                    : 'border-line hover:border-brand-300 hover:bg-surface-2',
                )}
              >
                <Preview mode={value} />
                <span className="flex items-center justify-center gap-1.5 pb-0.5">
                  <Icon size={16} aria-hidden />
                  {label}
                </span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full bg-brand-600 text-white shadow"
                  >
                    <Check size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card flush className="overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-brand-500 via-brand-700 to-[#1c1a5e]" />
        {user && (
          <div className="px-6 pb-6">
            <img
              src={user.image}
              alt=""
              width={80}
              height={80}
              className="-mt-10 size-20 rounded-2xl bg-surface-2 ring-4 ring-surface"
            />
            <dl className="mt-3 min-w-0">
              <dt className="sr-only">Name</dt>
              <dd className="text-xl font-semibold tracking-tight">
                {user.firstName} {user.lastName}
              </dd>
              <dt className="sr-only">Username</dt>
              <dd className="text-sm text-ink-2">@{user.username}</dd>
              <dt className="sr-only">Email</dt>
              <dd className="mt-1 text-sm break-all text-ink-2">{user.email}</dd>
            </dl>
          </div>
        )}
      </Card>
    </div>
  );
}
