import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useTheme, type Theme } from '../context/ThemeContext';
import { cx } from '../utils/cx';

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a theme. &ldquo;System&rdquo; follows your device setting.
        </p>
        <div role="group" aria-label="Theme" className="mt-4 grid grid-cols-3 gap-2">
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={theme === value}
              className={cx(
                'flex flex-col items-center gap-2 rounded-lg border px-3 py-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none',
                theme === value
                  ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-50'
                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800',
              )}
            >
              <Icon size={20} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">Profile</h2>
        {user && (
          <div className="mt-4 flex items-center gap-4">
            <img
              src={user.image}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-full bg-slate-200 dark:bg-slate-700"
            />
            <dl className="min-w-0 text-sm">
              <dt className="sr-only">Name</dt>
              <dd className="text-base font-semibold">
                {user.firstName} {user.lastName}
              </dd>
              <dt className="sr-only">Username</dt>
              <dd className="text-slate-500">@{user.username}</dd>
              <dt className="sr-only">Email</dt>
              <dd className="break-all text-slate-500">{user.email}</dd>
            </dl>
          </div>
        )}
      </Card>
    </div>
  );
}
