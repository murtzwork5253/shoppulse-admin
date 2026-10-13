import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { getProduct } from '../api/products';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { Stars } from '../components/ui/Stars';
import { StockBadge } from '../components/ui/StockBadge';
import { useFetch } from '../hooks/useFetch';
import type { Product } from '../types';
import { cx } from '../utils/cx';
import { formatCategory, formatCurrency } from '../utils/format';

const backLink =
  'inline-flex items-center gap-1 rounded text-sm text-slate-600 hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none dark:text-slate-400';

function Gallery({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <img
        src={images[selected]}
        alt={product.title}
        width={480}
        height={480}
        className="aspect-square w-full rounded-lg bg-slate-100 object-contain dark:bg-slate-800"
      />
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
                'rounded-lg border-2 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none',
                i === selected ? 'border-brand-600' : 'border-transparent',
              )}
            >
              <img
                src={src}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="size-14 rounded-md bg-slate-100 object-contain dark:bg-slate-800"
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
  const specs = [
    ['SKU', product.sku],
    ['Warranty', product.warrantyInformation],
    ['Shipping', product.shippingInformation],
    ['Returns', product.returnPolicy],
  ];

  return (
    <div className="space-y-4">
      <div>
        {product.brand && <p className="text-sm text-slate-500">{product.brand}</p>}
        <h2 className="text-xl font-semibold">{product.title}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge>{formatCategory(product.category)}</Badge>
          <StockBadge stock={product.stock} />
          <span className="text-sm text-slate-500">{product.stock} in stock</span>
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums">{formatCurrency(discounted)}</span>
        {product.discountPercentage > 0 && (
          <>
            <span className="text-slate-500 tabular-nums line-through">
              {formatCurrency(product.price)}
            </span>
            <Badge color="green">{Math.round(product.discountPercentage)}% off</Badge>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Stars rating={product.rating} />
        <span className="text-slate-500">{product.rating.toFixed(1)}</span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">{product.description}</p>

      <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200 text-sm dark:divide-slate-800 dark:border-slate-800">
        {specs.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 px-3 py-2">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Reviews({ product }: { product: Product }) {
  return (
    <Card>
      <h2 className="font-semibold">Reviews ({product.reviews.length})</h2>
      {product.reviews.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {product.reviews.map((r) => (
            <li key={`${r.reviewerName}-${r.date}`} className="py-3 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <Stars rating={r.rating} size={14} />
                <span className="text-sm font-medium">{r.reviewerName}</span>
                <time dateTime={r.date} className="text-xs text-slate-500">
                  {new Date(r.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </time>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
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
      <Link to="/products" className={backLink}>
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
        <Card className="grid gap-6 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-24" />
          </div>
        </Card>
      ) : (
        <>
          <Card className="grid gap-6 md:grid-cols-2">
            <Gallery key={product.id} product={product} />
            <Details product={product} />
          </Card>
          <Reviews product={product} />
        </>
      )}
    </div>
  );
}
