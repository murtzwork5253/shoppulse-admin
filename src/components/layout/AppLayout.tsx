import { useEffect, useState } from 'react';
import { Outlet, useLocation, useMatches } from 'react-router';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Each route declares its title in `handle`; use the deepest one.
  const matches = useMatches();
  const title = matches
    .map((m) => (m.handle as { title?: string } | undefined)?.title)
    .findLast(Boolean);

  useEffect(() => {
    document.title = title ? `${title} · ShopPulse` : 'ShopPulse';
  }, [title]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title ?? 'ShopPulse'}
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen(true)}
        />
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-4 md:p-8">
          {/* Keyed by path so each page fades in; query-string changes don't re-trigger it. */}
          <div key={pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
