import { NavLink } from 'react-router';
import { Activity, LayoutDashboard, Package, Settings, ShoppingCart, Users, X } from 'lucide-react';
import { cx } from '../../utils/cx';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

type Props = {
  /** Only affects phones: whether the slide-out panel is open. */
  open: boolean;
  onClose: () => void;
};

// The sidebar stays deep indigo in both themes. Labels use sr-only (not display:none) in the
// icon-only tablet layout so links keep their accessible names.
export function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        id="sidebar"
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-gradient-to-b from-[#16134a] via-[#14123f] to-[#0b0a28] text-indigo-100 shadow-2xl transition-transform',
          'md:sticky md:top-0 md:h-screen md:w-[76px] md:translate-x-0 md:shadow-none lg:w-64',
          open ? 'translate-x-0' : '-translate-x-full max-md:invisible',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-brand-500/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-10 size-56 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative flex h-16 items-center justify-between px-5 md:justify-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-fuchsia-500 text-white shadow-lg shadow-brand-500/30">
              <Activity size={20} aria-hidden />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white md:sr-only lg:not-sr-only">
              ShopPulse
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-indigo-200 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:outline-none md:hidden"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <nav aria-label="Main" className="relative flex-1 px-3 py-2">
          <p className="mb-2 hidden px-3 text-[11px] font-semibold tracking-widest text-indigo-300/50 uppercase lg:block">
            Menu
          </p>
          <ul className="space-y-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onClose}
                  title={label}
                  className={({ isActive }) =>
                    cx(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:outline-none md:justify-center lg:justify-start',
                      isActive
                        ? 'bg-gradient-to-r from-brand-500/45 to-brand-500/5 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)]'
                        : 'text-indigo-200/75 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        aria-hidden
                        className={cx(
                          'shrink-0 transition',
                          isActive ? 'text-brand-200' : 'group-hover:text-brand-200',
                        )}
                      />
                      <span className="md:sr-only lg:not-sr-only">{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative m-3 hidden rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 lg:block">
          <p className="text-xs font-semibold text-white">Demo data</p>
          <p className="mt-1 text-xs leading-relaxed text-indigo-200/70">
            Powered by the DummyJSON mock API. Changes aren&apos;t saved.
          </p>
        </div>
      </aside>
    </>
  );
}
