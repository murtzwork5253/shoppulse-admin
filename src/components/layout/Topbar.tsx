import { LogOut, Menu, Monitor, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, type Theme } from '../../context/ThemeContext';
import { iconButtonClass } from '../ui/styles';

const nextTheme: Record<Theme, Theme> = { light: 'dark', dark: 'system', system: 'light' };
const themeIcon = { light: Sun, dark: Moon, system: Monitor };

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
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-line bg-surface/75 px-4 backdrop-blur-xl md:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="sidebar"
        className={`${iconButtonClass} -ml-2 md:hidden`}
      >
        <Menu size={20} aria-hidden />
      </button>

      <h1 className="flex-1 truncate text-lg font-semibold tracking-tight">{title}</h1>

      <button
        type="button"
        onClick={() => setTheme(nextTheme[theme])}
        aria-label={`Theme: ${theme}. Switch to ${nextTheme[theme]}`}
        title={`Theme: ${theme}`}
        className={iconButtonClass}
      >
        <ThemeIcon size={20} aria-hidden />
      </button>

      {user && (
        <div className="flex items-center gap-3 border-l border-line pl-3">
          <img
            src={user.image}
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full bg-surface-2 ring-2 ring-brand-500/40"
          />
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-ink-2">Administrator</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={logout}
        aria-label="Log out"
        title="Log out"
        className={iconButtonClass}
      >
        <LogOut size={20} aria-hidden />
      </button>
    </header>
  );
}
