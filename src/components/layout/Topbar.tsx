import { LogOut, Menu, Monitor, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, type Theme } from '../../context/ThemeContext';

const nextTheme: Record<Theme, Theme> = { light: 'dark', dark: 'system', system: 'light' };
const themeIcon = { light: Sun, dark: Moon, system: Monitor };

const iconButton =
  'rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-300 dark:hover:bg-slate-800';

type Props = {
  title: string;
  menuOpen: boolean;
  onMenuClick: () => void;
};

export function Topbar({ title, menuOpen, onMenuClick }: Props) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const ThemeIcon = themeIcon[theme];

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6 dark:border-slate-800 dark:bg-slate-900/90">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="sidebar"
        className={`${iconButton} md:hidden`}
      >
        <Menu size={20} aria-hidden />
      </button>

      <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>

      <button
        type="button"
        onClick={() => setTheme(nextTheme[theme])}
        aria-label={`Theme: ${theme}. Switch to ${nextTheme[theme]}`}
        title={`Theme: ${theme}`}
        className={iconButton}
      >
        <ThemeIcon size={20} aria-hidden />
      </button>

      {user && (
        <div className="flex items-center gap-2 pl-2">
          <img
            src={user.image}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full bg-slate-200 dark:bg-slate-700"
          />
          <span className="hidden text-sm font-medium sm:inline">
            {user.firstName} {user.lastName}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={logout}
        aria-label="Log out"
        title="Log out"
        className={iconButton}
      >
        <LogOut size={20} aria-hidden />
      </button>
    </header>
  );
}
