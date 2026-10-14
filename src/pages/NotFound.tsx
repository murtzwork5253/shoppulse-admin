import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { focusRing } from '../components/ui/styles';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · ShopPulse';
  }, []);

  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div className="animate-fade-up">
        <p className="bg-gradient-to-br from-brand-400 via-brand-600 to-fuchsia-500 bg-clip-text text-8xl font-bold tracking-tighter text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-2">
          The page you are looking for doesn&apos;t exist or was moved.
        </p>
        <Link
          to="/"
          className={`mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_-8px_rgb(106_63_232/0.75)] transition hover:brightness-110 ${focusRing}`}
        >
          <ArrowLeft size={16} aria-hidden /> Go to dashboard
        </Link>
      </div>
    </main>
  );
}
