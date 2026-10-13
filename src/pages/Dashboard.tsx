import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Placeholder until the layout (Session 4) and dashboard (Session 7) are built.
export default function Dashboard() {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'Dashboard · ShopPulse';
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-500">
        Signed in as {user?.firstName} {user?.lastName}
      </p>
      <button
        onClick={logout}
        className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        Log out
      </button>
    </main>
  );
}
