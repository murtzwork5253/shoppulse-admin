# Project 1 build guide: ShopPulse Admin

You will build **ShopPulse Admin**, an e-commerce admin dashboard in React 19 + TypeScript + Vite + Tailwind CSS, using the free [DummyJSON](https://dummyjson.com/docs) API. Plan on about 10 working sessions (2 weeks at 2 hours on weekdays and 5 to 6 hours on weekends). The ready-made README.md is in the chat; copy it into the repo root on day 1 and update the links at the end.

Why this project: it matches your resume stack (React, TypeScript, Tailwind, REST APIs, Vitest), and "admin dashboard" is one of the most common React jobs on Upwork.

## What you are building

| Page | Route | What it shows |
| --- | --- | --- |
| Login | `/login` | Username + password form, error message, redirect after login |
| Dashboard | `/` | 4 KPI cards, revenue trend line chart, revenue by category bar chart, recent orders |
| Products | `/products` | Table with search, sort, category filter, pagination |
| Product detail | `/products/:id` | Images, price, stock, specs, reviews |
| Orders | `/orders` | Paginated orders (DummyJSON carts) |
| Order detail | `/orders/:id` | Items, quantities, totals, discount |
| Customers | `/customers` | Searchable customer list |
| Settings | `/settings` | Theme choice (light / dark / system), profile info |
| Not found | `*` | Friendly 404 with link home |

### API endpoints you will use

| Purpose | Endpoint |
| --- | --- |
| Login | `POST /auth/login` with `{ username, password, expiresInMins }` (demo user: `emilys` / `emilyspass`) |
| Current user | `GET /auth/me` with header `Authorization: Bearer <token>` |
| Products (paged) | `GET /products?limit=10&skip=0&sortBy=price&order=desc` |
| Search products | `GET /products/search?q=phone` |
| Category list | `GET /products/category-list` |
| Products by category | `GET /products/category/smartphones` |
| One product | `GET /products/1` |
| Orders (carts) | `GET /carts?limit=10&skip=0` and `GET /carts/1` |
| Customers | `GET /users?limit=10&skip=0` and `GET /users/search?q=john` |
| Pick fields only | add `&select=title,price` to any list call |
| Get everything | `limit=0` returns all items |

Every list response looks like `{ products: [...], total: 194, skip: 0, limit: 10 }` (the array key changes: `products`, `carts`, `users`). Add, update and delete calls are simulated and never saved.

## Day-by-day plan

| Session | Goal | Steps |
| --- | --- | --- |
| 1 | Project created, Tailwind working, pushed to GitHub | 0 to 2 |
| 2 | API layer + types | 3 |
| 3 | Login + protected routes | 4 |
| 4 | Layout, sidebar, dark mode, routing | 5 to 6 |
| 5 | Hooks + reusable table + pagination | 7 to 8 |
| 6 | Products page complete | 8 |
| 7 | Dashboard KPIs + charts | 9 |
| 8 | Orders, customers, detail pages, 404 | 10 |
| 9 | Loading/empty/error polish + tests | 11 to 12 |
| 10 | Deploy, screenshots, video, README, LinkedIn post | 13 to 14 |

Commit at the end of every step with a clear message (for example `feat: add products table with pagination`). Clients sometimes look at commit history; small, clear commits look professional.

## Step 0: Prerequisites

- [ ] Node.js 20 or newer (`node -v`)
- [ ] VS Code with extensions: ESLint, Prettier, Tailwind CSS IntelliSense, Pretty TypeScript Errors
- [ ] GitHub account and Git configured (`git config --global user.name` / `user.email`)
- [ ] Vercel account (sign in with GitHub)
- [ ] Open https://dummyjson.com/products?limit=2 in the browser to see what the data looks like

## Step 1: Create the project

```bash
npm create vite@latest shoppulse-admin -- --template react-ts
cd shoppulse-admin
npm install
npm install react-router recharts lucide-react
npm install tailwindcss @tailwindcss/vite
npm install -D prettier eslint-config-prettier
npm run dev
```

Add the Tailwind plugin in `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Replace everything in `src/index.css` with:

```css
@import 'tailwindcss';

/* lets you use dark: classes when <html class="dark"> is set */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-brand-50: #eef2ff;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
}

body {
  @apply bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100;
}
```

Delete `src/App.css` and the Vite demo content in `App.tsx`. Put `<h1 className="text-3xl font-bold text-brand-600">ShopPulse</h1>` in `App.tsx`; if it shows in indigo, Tailwind works.

Create `.prettierrc`:

```json
{ "singleQuote": true, "semi": true, "printWidth": 100, "trailingComma": "all" }
```

Add to `package.json` scripts: `"format": "prettier --write src"`.

Push to GitHub:

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + TS + Tailwind"
git branch -M main
git remote add origin https://github.com/murtzwork5253/shoppulse-admin.git
git push -u origin main
```

## Step 2: Folder structure and environment

Create these folders inside `src/`: `api`, `components/layout`, `components/ui`, `components/table`, `components/charts`, `context`, `hooks`, `pages`, `routes`, `types`, `utils`, `test`.

Create `.env` and `.env.example` (both with the same content), and make sure `.env` is listed in `.gitignore`:

```bash
VITE_API_BASE_URL=https://dummyjson.com
```

Create `src/utils/format.ts`:

```ts
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

export const formatCompact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
```

USD is used because DummyJSON prices are in dollars and your clients are mostly abroad.

## Step 3: API layer and types

`src/types/index.ts`:

```ts
export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku: string;
  availabilityStatus: string;
  thumbnail: string;
  images: string[];
  reviews: { rating: number; comment: string; date: string; reviewerName: string }[];
};

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountedTotal: number;
  thumbnail: string;
};

export type Cart = {
  id: number;
  userId: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  image: string;
  address: { city: string; state: string; country: string };
};

export type Paged<K extends string, T> = { [key in K]: T[] } & {
  total: number;
  skip: number;
  limit: number;
};
```

`src/api/client.ts` (one place for base URL, token and errors):

```ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://dummyjson.com';
export const TOKEN_KEY = 'shoppulse_token';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}
```

`src/api/products.ts`:

```ts
import { api } from './client';
import type { Paged, Product } from '../types';

export type ProductQuery = {
  page: number;
  pageSize: number;
  q?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

type ProductPage = Paged<'products', Product>;

export async function getProducts(query: ProductQuery, signal?: AbortSignal): Promise<ProductPage> {
  const { page, pageSize, q, category, sortBy, order = 'asc' } = query;
  const skip = (page - 1) * pageSize;

  // The API can't search inside a category, so fetch the category and filter here.
  if (q && category) {
    const all = await api<ProductPage>(`/products/category/${category}?limit=0`, { signal });
    const term = q.toLowerCase();
    const matches = all.products.filter((p) => p.title.toLowerCase().includes(term));
    return { products: matches.slice(skip, skip + pageSize), total: matches.length, skip, limit: pageSize };
  }

  const params = new URLSearchParams({ limit: String(pageSize), skip: String(skip) });
  if (sortBy) {
    params.set('sortBy', sortBy);
    params.set('order', order);
  }
  let path = '/products';
  if (q) {
    path = '/products/search';
    params.set('q', q);
  } else if (category) {
    path = `/products/category/${category}`;
  }
  return api<ProductPage>(`${path}?${params}`, { signal });
}

export const getProduct = (id: string, signal?: AbortSignal) =>
  api<Product>(`/products/${id}`, { signal });

export const getCategories = (signal?: AbortSignal) =>
  api<string[]>('/products/category-list', { signal });
```

Create `src/api/orders.ts` and `src/api/users.ts` the same way (`/carts`, `/carts/:id`, `/users`, `/users/search?q=`). Test each function once by logging the result in `App.tsx`, then remove the log.

## Step 4: Login and protected routes

`src/context/AuthContext.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, TOKEN_KEY } from '../api/client';

type AuthUser = { id: number; username: string; firstName: string; lastName: string; email: string; image: string };

type AuthValue = {
  user: AuthUser | null;
  checking: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  // Restore the session after a page refresh
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    api<AuthUser>('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setChecking(false));
  }, []);

  async function login(username: string, password: string) {
    const res = await api<AuthUser & { accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setUser(res);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, checking, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
```

`src/routes/ProtectedRoute.tsx`:

```tsx
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return <div className="grid h-screen place-items-center text-slate-500">Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
```

Login page (`src/pages/Login.tsx`) must have:

- Labelled username and password inputs (`<label htmlFor>`), demo credentials shown under the form.
- Submit button that shows "Signing in…" and is disabled while the request runs.
- Red error message from the API (for example "Invalid credentials") with `role="alert"`.
- After success: `navigate(location.state?.from ?? '/', { replace: true })`.
- If the user is already logged in, redirect straight to `/`.

QA check before moving on: wrong password shows an error, correct login works, refresh keeps you logged in, logout sends you to `/login`, visiting `/products` while logged out redirects to login and back after signing in.

## Step 5: Layout, sidebar and dark mode

Build these components in `src/components/layout/`:

- **`AppLayout.tsx`**: a flex row with the sidebar on the left and, on the right, the top bar plus `<Outlet />` inside `<main className="p-4 md:p-6">`.
- **`Sidebar.tsx`**: logo, then `NavLink`s to Dashboard, Products, Orders, Customers, Settings with lucide icons (`LayoutDashboard`, `Package`, `ShoppingCart`, `Users`, `Settings`). Use NavLink's `className={({ isActive }) => ...}` to highlight the current page.
- **`Topbar.tsx`**: page title, theme toggle button, user avatar + name from `useAuth()`, logout button.

Responsive behaviour (this is what clients check first on their phone):

| Screen | Sidebar |
| --- | --- |
| Desktop (`lg`, 1024 px+) | Always visible, 256 px wide, icons + labels |
| Tablet (`md` to `lg`) | Collapsed to icons only, 72 px wide |
| Phone (below `md`) | Hidden; a menu button in the top bar opens it as a slide-out panel over a dark backdrop. Close it when a link is clicked or the backdrop is tapped |

`src/context/ThemeContext.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null);

function readStored(): Theme {
  try {
    return (localStorage.getItem('theme') as Theme) ?? 'system';
  } catch {
    return 'system';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStored);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    localStorage.setItem('theme', theme);
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
```

Reusable UI pieces to create in `src/components/ui/` (small, but you'll use them everywhere): `Button` (variants: primary, secondary, ghost), `Input`, `Select`, `Card`, `Badge` (colors: green, amber, red, slate), `Skeleton` (a pulsing grey block: `animate-pulse rounded bg-slate-200 dark:bg-slate-800`), `EmptyState`, `ErrorState` (message + Retry button).

Design rules to keep it looking professional: one brand color (indigo) for actions only; cards are white with a light border in light mode and `slate-900` in dark mode; 8 px spacing steps (`p-2`, `p-4`, `p-6`); numbers right-aligned in tables; one font size for body text (`text-sm`).

## Step 6: Routing

`src/routes/router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Customers from '../pages/Customers';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'products', element: <Products /> },
          { path: 'products/:id', element: <ProductDetail /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/:id', element: <OrderDetail /> },
          { path: 'customers', element: <Customers /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from './routes/router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
```

Create each page file with a simple placeholder heading first, check every link in the sidebar works, then fill pages one by one. Set the browser tab title per page with `document.title` in a small `useEffect`.

## Step 7: Custom hooks

`src/hooks/useDebounce.ts`:

```ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

`src/hooks/useFetch.ts` (loading, error, retry, and cancelling outdated requests):

```ts
import { useEffect, useState, type DependencyList } from 'react';

export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetcher(controller.signal)
      .then(setData)
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message || 'Something went wrong');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { data, error, loading, retry: () => setAttempt((n) => n + 1) };
}
```

`src/hooks/useTableParams.ts` (keeps table state in the URL, so refresh and shared links keep the view):

```ts
import { useSearchParams } from 'react-router';

export function useTableParams(defaults = { pageSize: 10 }) {
  const [params, setParams] = useSearchParams();

  const state = {
    page: Number(params.get('page') ?? 1),
    pageSize: Number(params.get('size') ?? defaults.pageSize),
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sortBy: params.get('sortBy') ?? '',
    order: (params.get('order') as 'asc' | 'desc') ?? 'asc',
  };

  function update(changes: Record<string, string | number | undefined>, resetPage = true) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === undefined || value === '') next.delete(key);
      else next.set(key, String(value));
    });
    if (resetPage && !('page' in changes)) next.delete('page');
    setParams(next, { replace: true });
  }

  return { ...state, update };
}
```

Note: changing search, sort, category or page size resets to page 1. That avoids the classic bug where you are on page 8, search for something with 2 results, and see an empty table.

## Step 8: Reusable table, pagination and the Products page

`src/components/table/DataTable.tsx`:

```tsx
import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right';
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  loading?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  skeletonRows?: number;
};

export function DataTable<T>({ columns, rows, getRowId, loading, sortBy, order, onSort, emptyMessage = 'No results found.', skeletonRows = 10 }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800/50">
          <tr>
            {columns.map((col) => {
              const active = sortBy === col.key;
              const Icon = !active ? ArrowUpDown : order === 'asc' ? ArrowUp : ArrowDown;
              return (
                <th key={col.key} scope="col" className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : ''}`}
                  aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {col.sortable && onSort ? (
                    <button onClick={() => onSort(col.key)} className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                      {col.header} <Icon size={14} aria-hidden />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.length === 0
              ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">{emptyMessage}</td>
                </tr>
              )
              : rows.map((row) => (
                  <tr key={getRowId(row)} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 ${col.align === 'right' ? 'text-right tabular-nums' : ''}`}>{col.render(row)}</td>
                    ))}
                  </tr>
                ))}
        </tbody>
      </table>
    </div>
  );
}
```

`src/components/ui/Pagination.tsx` must show "Showing 11–20 of 194", a rows-per-page select (10 / 20 / 50), and Previous / Next buttons that are disabled on the first and last page. Total pages = `Math.ceil(total / pageSize)`.

### Products page, piece by piece

1. Read state: `const { page, pageSize, q, category, sortBy, order, update } = useTableParams();`
2. Keep the search box in local state, debounce it, and push the debounced value to the URL:

   ```tsx
   const [search, setSearch] = useState(q);
   const debounced = useDebounce(search);
   useEffect(() => { if (debounced !== q) update({ q: debounced }); }, [debounced]);
   ```
3. Fetch: `const { data, loading, error, retry } = useFetch((signal) => getProducts({ page, pageSize, q, category, sortBy, order }, signal), [page, pageSize, q, category, sortBy, order]);`
4. Categories dropdown: `useFetch(getCategories, [])`, with an "All categories" option. Turn slugs into labels: `home-decoration` → "Home decoration".
5. Sorting: clicking a column toggles asc → desc; clicking a new column starts at asc:

   ```tsx
   const onSort = (key: string) =>
     update({ sortBy: key, order: sortBy === key && order === 'asc' ? 'desc' : 'asc' });
   ```
6. Columns: thumbnail + title (link to `/products/:id`), category, price (right-aligned, `formatCurrency`), rating (★ 4.5), stock (right-aligned), status badge. Sortable: title, price, rating, stock.
7. Stock badge rule: 0 → red "Out of stock"; under 10 → amber "Low stock"; otherwise green "In stock".
8. A "Clear filters" button appears only when search, category or sort is active.
9. If `error`, render `<ErrorState message={error} onRetry={retry} />` instead of the table.
10. On phones, hide less important columns with `hidden md:table-cell` (category, rating) so the table doesn't scroll sideways too much.

QA check: type fast in search (only one request after you stop, no flicker of old results), sort each column both ways, choose a category then search inside it, go to page 3 then search (back to page 1), refresh the page (same view), paste the URL in a new tab (same view), turn off Wi-Fi and reload (error with Retry).

## Step 9: Dashboard KPIs and charts

`src/api/stats.ts` loads everything the dashboard needs in parallel:

```ts
import { api } from './client';
import type { Cart, Paged, Product } from '../types';

export async function getDashboardStats(signal?: AbortSignal) {
  const [carts, users, products] = await Promise.all([
    api<Paged<'carts', Cart>>('/carts?limit=0', { signal }),
    api<{ total: number }>('/users?limit=1&select=id', { signal }),
    api<Paged<'products', Pick<Product, 'id' | 'category'>>>('/products?limit=0&select=category', { signal }),
  ]);

  const revenue = carts.carts.reduce((sum, c) => sum + c.discountedTotal, 0);

  // Revenue by category: map each product id to its category, then add up cart lines
  const categoryOf = new Map(products.products.map((p) => [p.id, p.category]));
  const byCategory = new Map<string, number>();
  carts.carts.forEach((cart) =>
    cart.products.forEach((item) => {
      const cat = categoryOf.get(item.id) ?? 'other';
      byCategory.set(cat, (byCategory.get(cat) ?? 0) + item.discountedTotal);
    }),
  );
  const revenueByCategory = [...byCategory]
    .map(([category, value]) => ({ category, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return {
    revenue,
    orders: carts.total,
    customers: users.total,
    products: products.total,
    revenueByCategory,
    recentOrders: carts.carts.slice(0, 5),
  };
}
```

`src/api/mockStats.ts`: the API has no order dates, so generate a believable 12-month trend that ends at the real revenue figure. Say so honestly in the README (already done) and in a small note under the chart ("Trend uses sample data").

```ts
export function monthlyTrend(total: number) {
  const weights = [0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.09, 0.09, 0.09, 0.1, 0.1, 0.11];
  const now = new Date();
  return weights.map((w, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return {
      month: d.toLocaleString('en-US', { month: 'short' }),
      revenue: Math.round(total * w),
    };
  });
}
```

`src/components/charts/RevenueLineChart.tsx`:

```tsx
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCompact, formatCurrency } from '../../utils/format';

export function RevenueLineChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <div className="h-72" role="img" aria-label="Revenue over the last 12 months">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickFormatter={formatCompact} tickLine={false} axisLine={false} fontSize={12} width={48} />
          <Tooltip formatter={(v: number) => formatCurrency(v)} />
          <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

Build `CategoryBarChart.tsx` the same way with `BarChart` and `layout="vertical"` (horizontal bars read better with long category names), sorted largest first.

Dashboard layout:

- Row 1: 4 KPI cards in `grid gap-4 sm:grid-cols-2 xl:grid-cols-4`. Each card: label, big number, an icon, and a small grey sub-line (for example "Across 50 orders").
- Row 2: line chart (2/3 width) + bar chart (1/3 width) on desktop, stacked on mobile: `grid gap-4 lg:grid-cols-3` with the line chart `lg:col-span-2`.
- Row 3: "Recent orders" using the same `DataTable` (order #, customer id, items, total, link).
- While loading: skeleton cards and grey chart boxes of the same size, so nothing jumps when data arrives.

## Step 10: Orders, customers, details and 404

- **Orders page**: reuse `DataTable` + `Pagination` with `/carts?limit=&skip=`. Columns: Order # (link), Customer ID, Products, Quantity, Total, Discounted total, Savings (green). DummyJSON cart sorting is limited, so leave columns unsortable unless you check it works.
- **Order detail**: header with order number and totals; a table of line items (thumbnail, title, price, qty, line total); a "Back to orders" link.
- **Customers page**: search via `/users/search?q=` with the same debounced pattern. Columns: avatar + full name, email, phone, city/country.
- **Product detail**: image gallery (main image + clickable thumbnails), title, brand, category badge, price with discount, rating, stock badge, description, specs list (SKU, warranty, shipping, return policy) and reviews with star ratings. Show a 404-style message if the id doesn't exist.
- **Settings**: three theme buttons (Light / Dark / System) with the current one highlighted; profile card with the logged-in user's details.
- **NotFound**: big "404", one line, "Go to dashboard" button.

## Step 11: Polish (what makes it look senior)

- [ ] Every data view has 3 states: loading skeleton, empty state with a helpful line, error state with Retry
- [ ] Buttons show a disabled + loading state while working
- [ ] Visible keyboard focus everywhere (`focus-visible:ring-2 ring-brand-500`)
- [ ] Every icon-only button has `aria-label` (theme toggle, menu, logout)
- [ ] Images have `alt` text and fixed width/height to avoid layout jumps
- [ ] Page titles change per page ("Products · ShopPulse")
- [ ] Dark mode checked on every page (look for white boxes or unreadable grey text)
- [ ] Tested at 360 px, 768 px, 1024 px and 1440 px widths in Chrome DevTools
- [ ] Lighthouse (Chrome DevTools) run on the deployed site; aim for 90+ in Accessibility and Best Practices
- [ ] No console errors or warnings; `npm run lint` and `npm run build` pass with zero errors
- [ ] A favicon and a proper `<title>` in `index.html`

## Step 12: Tests with Vitest

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add to `vite.config.ts` (first line plus the `test` block):

```ts
/// <reference types="vitest/config" />
// ...existing imports
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

`src/test/setup.ts`: `import '@testing-library/jest-dom/vitest';`

Add scripts: `"test": "vitest"` and `"test:run": "vitest run"`.

Example tests:

```ts
// src/utils/format.test.ts
import { formatCurrency, formatCompact } from './format';

describe('formatters', () => {
  it('formats currency', () => expect(formatCurrency(1234.5)).toBe('$1,234.50'));
  it('formats compact numbers', () => expect(formatCompact(12500)).toBe('12.5K'));
});
```

```ts
// src/hooks/useDebounce.test.ts
import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

it('updates only after the delay', () => {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(({ v }) => useDebounce(v, 400), { initialProps: { v: 'a' } });
  rerender({ v: 'ab' });
  expect(result.current).toBe('a');
  act(() => vi.advanceTimersByTime(400));
  expect(result.current).toBe('ab');
  vi.useRealTimers();
});
```

```tsx
// src/components/table/DataTable.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type Column } from './DataTable';

type Row = { id: number; name: string };
const columns: Column<Row>[] = [{ key: 'name', header: 'Name', sortable: true, render: (r) => r.name }];

it('shows the empty message', () => {
  render(<DataTable columns={columns} rows={[]} getRowId={(r) => r.id} />);
  expect(screen.getByText('No results found.')).toBeInTheDocument();
});

it('calls onSort when a sortable header is clicked', async () => {
  const onSort = vi.fn();
  render(<DataTable columns={columns} rows={[{ id: 1, name: 'A' }]} getRowId={(r) => r.id} onSort={onSort} />);
  await userEvent.click(screen.getByRole('button', { name: /name/i }));
  expect(onSort).toHaveBeenCalledWith('name');
});
```

Also test `Pagination` (Previous disabled on page 1, Next disabled on the last page) and `ProtectedRoute` (render it inside a `MemoryRouter` with `initialEntries={['/products']}` and an `AuthContext` value of `user: null`, then expect the login page). If `globals: true` causes TypeScript errors for `describe`/`vi`, add `"types": ["vitest/globals"]` to `tsconfig.app.json`.

## Step 13: Deploy on Vercel

Create `vercel.json` in the project root so refreshing `/products` doesn't give a 404:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

1. Run `npm run build` and `npm run preview` locally; fix any errors.
2. Push to GitHub.
3. On vercel.com: Add New → Project → import `shoppulse-admin`. Vercel detects Vite automatically.
4. Add environment variable `VITE_API_BASE_URL` = `https://dummyjson.com`.
5. Deploy, then rename the project/domain to `shoppulse-admin` so the URL looks clean.
6. Open the live link on your phone and test login, products, dark mode.
7. Every push to `main` now redeploys automatically.

## Step 14: Turn it into a portfolio piece

- [ ] Screenshots at 1440 px wide: dashboard light, dashboard dark, products table, product detail, plus one phone screenshot (DevTools device mode, iPhone size). Save in `docs/screenshots/` with the names used in the README.
- [ ] Record a 60-second Loom: log in → dashboard → search "phone" → sort by price → open a product → toggle dark mode → shrink to mobile. Talk over it in simple English, or add captions.
- [ ] Copy README.md into the repo root; replace the live demo, video and portfolio links.
- [ ] GitHub repo: add description ("E-commerce admin dashboard — React 19, TypeScript, Tailwind, Recharts"), website link, and topics: `react`, `typescript`, `vite`, `tailwindcss`, `dashboard`, `admin-dashboard`, `recharts`. Pin it on your profile.
- [ ] Add it to Upwork (React specialized profile) with a cover image, 4 screenshots, the video and a problem → solution → result description.
- [ ] LinkedIn post (use Sample post 4 from the main playbook) with the video; live link in the first comment.
- [ ] Add to the Projects section of your React resume, replacing or alongside LiveMD.

## Final checklist before calling it done

- [ ] Login, logout, session restore, protected routes all work
- [ ] Products: search, category filter, sort, pagination, page size, URL sharing
- [ ] Dashboard numbers load, charts render in light and dark mode
- [ ] Orders, order detail, customers, product detail, settings, 404 all work
- [ ] Loading, empty and error states everywhere
- [ ] Responsive from 360 px to 1440 px
- [ ] `npm run lint`, `npm run test:run`, `npm run build` all pass
- [ ] No secrets in the repo; `.env` ignored, `.env.example` committed
- [ ] Live on Vercel, README complete, video recorded, pinned on GitHub

## Questions a client may ask you about this project

Prepare a 2 to 3 sentence answer for each; these come up in Upwork interviews.

1. Why did you put the filters in the URL instead of state? (Shareable links, refresh keeps the view, back button works.)
2. How do you stop old search results from appearing? (Debounce + AbortController cancels outdated requests.)
3. Why server-side pagination? (Only downloads what's shown; scales to large datasets.)
4. How would you connect this to our real backend? (Change the base URL and the functions in `src/api/`; components don't change.)
5. How do you handle an expired login token? (The API returns 401; clear the token and redirect to login. Next improvement: refresh token via `/auth/refresh`.)
6. How did you make it accessible? (Labels, focus states, `aria-sort`, `aria-label` on icon buttons, colour contrast checked in both themes.)
7. What would you add next? (Product create/edit form with validation, CSV export, role-based access, date filters.)

## Stretch goals (only after it's live)

- Add/edit product form with React Hook Form + Zod validation (API simulates the save)
- CSV export of the current table view
- Replace `useFetch` with TanStack Query and mention it in the README (many client job posts ask for it)
- Code-split pages with `React.lazy` and compare bundle size before and after

Sources: [DummyJSON auth docs](https://dummyjson.com/docs/auth) · [DummyJSON products docs](https://dummyjson.com/docs/products)
