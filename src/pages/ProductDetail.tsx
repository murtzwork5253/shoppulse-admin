import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Package, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { getProduct } from '../api/products';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { Stars } from '../components/ui/Stars';
import { StockBadge } from '../components/ui/StockBadge';
import { backLinkClass, focusRing } from '../components/ui/styles';
import { useFetch } from '../hooks/useFetch';
import type { Product } from '../types';
import { cx } from '../utils/cx';
import { formatCategory, formatCurrency } from '../utils/format';

function Gallery({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <div className="rounded-2xl bg-surface-2/70 p-4 ring-1 ring-line">
        <img
          src={images[selected]}
          alt={product.title}
          width={480}
          height={480}
          className="aspect-square w-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-pressed={i === selected}
              className={cx(
                'rounded-xl border-2 p-0.5 transition',
                focusRing,
                i === selected ? 'border-brand-500' : 'border-transparent hover:border-line',
              )}
            >
              <img
                src={src}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="size-14 rounded-lg bg-surface-2 object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Details({ product }: { product: Product }) {
  const discounted = product.price * (1 - product.discountPercentage / 100);
  const perks = [
    { icon: ShieldCheck, label: 'Warranty', value: product.warrantyInformation },
    { icon: Truck, label: 'Shipping', value: product.shippingInformation },
    { icon: RotateCcw, label: 'Returns', value: product.returnPolicy },
    { icon: Package, label: 'SKU', value: product.sku },
  ];

  return (
    <div className="space-y-5">
      <div>
        {product.brand && (
          <p className="text-sm font-medium tracking-wide text-brand-600 uppercase dark:text-brand-300">
            {product.brand}
          </p>
        )}
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{product.title}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge color="brand">{formatCategory(product.category)}</Badge>
          <StockBadge stock={product.stock} />
          <span className="text-sm text-ink-2">{product.stock} in stock</span>
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-4xl font-bold tracking-tight tabular-nums">
          {formatCurrency(discounted)}
        </span>
        {product.discountPercentage > 0 && (
          <>
            <span className="text-ink-2 tabular-nums line-through">
              {formatCurrency(product.price)}
            </span>
            <Badge color="green">{Math.round(product.discountPercentage)}% off</Badge>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Stars rating={product.rating} />
        <span className="font-medium">{product.rating.toFixed(1)}</span>
        <span className="text-ink-2">· {product.reviews.length} reviews</span>
      </div>

      <p className="text-sm leading-relaxed text-ink-2">{product.description}</p>

      <dl className="grid gap-3 sm:grid-cols-2">
        {perks.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 rounded-xl bg-surface-2/70 p-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300">
              <Icon size={18} aria-hidden />
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-ink-2">{label}</dt>
              <dd className="text-sm font-medium break-words">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function Reviews({ product }: { product: Product }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold tracking-tight">Reviews ({product.reviews.length})</h2>
      {product.reviews.length === 0 ? (
        <p className="mt-2 text-sm text-ink-2">No reviews yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {product.reviews.map((r) => (
            <li
              key={`${r.reviewerName}-${r.date}`}
              className="flex gap-3 py-4 first:pt-0 last:pb-0"
            >
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-semibold text-white"
              >
                {initials(r.reviewerName)}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold">{r.reviewerName}</span>
                  <Stars rating={r.rating} size={14} />
                  <time dateTime={r.date} className="text-xs text-ink-2">
                    {new Date(r.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </time>
                </div>
                <p className="mt-1 text-sm text-ink-2">{r.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function ProductDetail() {
  const { id = '' } = useParams();
  const { data: product, loading, error, status, retry } = useFetch((s) => getProduct(id, s), [id]);

  return (
    <div className="space-y-4">
      <Link to="/products" className={backLinkClass}>
        <ArrowLeft size={16} aria-hidden /> Back to products
      </Link>

      {error ? (
        <Card>
          {status === 404 ? (
            <ErrorState message={`Product #${id} doesn't exist.`} />
          ) : (
            <ErrorState message={error} onRetry={retry} />
          )}
        </Card>
      ) : loading || !product ? (
        <Card className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-24" />
          </div>
        </Card>
      ) : (
        <>
          <Card className="grid gap-8 md:grid-cols-2 lg:p-8">
            <Gallery key={product.id} product={product} />
            <Details product={product} />
          </Card>
          <Reviews product={product} />
        </>
      )}
    </div>
  );
}
