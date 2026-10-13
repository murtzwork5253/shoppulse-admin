import { useEffect } from 'react';
import { Link } from 'react-router';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · ShopPulse';
  }, []);

  return (
    <main className="grid min-h-screen place-items-center p-4 text-center">
      <div>
        <p className="text-6xl font-bold text-brand-600">404</p>
        <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for doesn&apos;t exist or was moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
