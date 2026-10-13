import { NavLink } from 'react-router';
import { LayoutDashboard, Package, Settings, ShoppingCart, Store, Users, X } from 'lucide-react';
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

// Labels use sr-only (not display:none) in the icon-only tablet layout so links keep their names.
export function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        id="sidebar"
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900',
          'md:sticky md:top-0 md:h-screen md:w-[72px] md:translate-x-0 lg:w-64',
          open ? 'translate-x-0' : '-translate-x-full max-md:invisible',
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 md:justify-center lg:justify-between">
          <div className="flex items-center gap-2 font-bold text-brand-600">
            <Store size={22} aria-hidden />
            <span className="md:sr-only lg:not-sr-only">ShopPulse</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:hidden dark:hover:bg-slate-800"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 space-y-1 p-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              title={label}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:justify-center lg:justify-start',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-50'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                )
              }
            >
              <Icon size={20} aria-hidden />
              <span className="md:sr-only lg:not-sr-only">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
