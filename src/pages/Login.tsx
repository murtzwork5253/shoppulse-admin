import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Activity, BarChart3, MoonStar, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { linkClass } from '../components/ui/styles';

const DEMO_USERNAME = 'emilys';
const DEMO_PASSWORD = 'emilyspass';

const features = [
  { icon: BarChart3, text: 'Live revenue, orders and customer insights' },
  { icon: Zap, text: 'Fast, filterable tables with shareable links' },
  { icon: MoonStar, text: 'Light and dark themes, built for every screen' },
];

function BrandPanel() {
  return (
    <aside className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-brand-600 via-brand-800 to-[#15123f] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -top-24 -right-20 size-96 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
          <Activity size={22} aria-hidden />
        </div>
        <span className="text-xl font-semibold tracking-tight">ShopPulse</span>
      </div>

      <div className="relative max-w-md">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
          <Sparkles size={14} aria-hidden /> E-commerce admin dashboard
        </p>
        <p className="mt-5 text-4xl leading-tight font-semibold tracking-tight">
          Run your store with clarity.
        </p>
        <ul className="mt-8 space-y-4">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-white/85">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20">
                <Icon size={16} aria-hidden />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative preview card */}
      <div
        aria-hidden
        className="relative w-72 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md"
      >
        <p className="text-xs text-white/70">Total revenue</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">$3.46M</p>
        <svg viewBox="0 0 240 64" className="mt-3 h-14 w-full" fill="none">
          <defs>
            <linearGradient id="login-spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 52 C20 50 30 38 50 40 S80 54 100 36 S140 12 160 24 S200 10 240 6 V64 H0Z"
            fill="url(#login-spark)"
          />
          <path
            d="M0 52 C20 50 30 38 50 40 S80 54 100 36 S140 12 160 24 S200 10 240 6"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </aside>
  );
}

export default function Login() {
  const { user, checking, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Sign in · ShopPulse';
  }, []);

  if (checking) {
    return <div className="grid h-screen place-items-center text-ink-2">Loading…</div>;
  }
  // Once login() sets the user, this branch does the redirect, so it must honour `from`.
  if (user) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <BrandPanel />

      <main className="grid flex-1 place-items-center p-6 lg:max-w-xl lg:flex-none lg:basis-[34rem]">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-fuchsia-500 text-white shadow-lg shadow-brand-500/30">
              <Activity size={22} aria-hidden />
            </div>
            <span className="text-xl font-semibold tracking-tight">ShopPulse</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-2">Sign in to your admin account to continue.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Input
              label="Username"
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-700 ring-1 ring-rose-500/25 ring-inset dark:text-rose-300"
              >
                {error}
              </p>
            )}

            <Button type="submit" loading={submitting} className="w-full py-3">
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface-2/50 p-4 text-sm">
            <p className="font-medium">Demo account</p>
            <p className="mt-1 text-ink-2">
              Username <code className="font-semibold text-ink">{DEMO_USERNAME}</code> · password{' '}
              <code className="font-semibold text-ink">{DEMO_PASSWORD}</code>
            </p>
            <button
              type="button"
              onClick={() => {
                setUsername(DEMO_USERNAME);
                setPassword(DEMO_PASSWORD);
              }}
              className={`${linkClass} mt-2 text-sm`}
            >
              Fill in demo credentials
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
