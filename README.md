# ShopPulse Admin — E-commerce Admin Dashboard

A responsive admin dashboard for an online store, built with **React 19, TypeScript, Vite and Tailwind CSS**. It shows live business KPIs and charts, and lets an admin search, sort, filter and page through products, orders and customers pulled from a REST API.

**🔗 Live demo:** [shoppulse-admin.vercel.app](https://shoppulse-admin.vercel.app) &nbsp;·&nbsp; **🎥 Video walkthrough:** [Watch (60 sec)](https://your-loom-or-youtube-link)

> **Demo login** — username: `emilys` · password: `emilyspass`

![ShopPulse Admin dashboard](docs/screenshots/dashboard-light.png)

---

## ✨ Features

**Authentication**
- Login with JWT access token (DummyJSON auth API)
- Protected routes — unauthenticated users are redirected to `/login` and sent back to the page they wanted after signing in
- Session restored on page refresh; logout clears the session

**Dashboard**
- 4 KPI cards: total revenue, orders, customers, products
- Revenue trend line chart (last 12 months)
- Revenue by category bar chart
- Recent orders table with links to order details

**Products**
- Server-side pagination (10 / 20 / 50 rows per page)
- Debounced search (waits 400 ms after typing stops)
- Sort by title, price, rating or stock (ascending / descending)
- Filter by category
- Stock status badges (In stock / Low stock / Out of stock)
- Product detail page with image gallery, specs and reviews

**Orders & Customers**
- Paginated orders table with order totals, item counts and discounts
- Customer list with search, avatar, contact details and location

**UX & quality**
- Filters, search and page number stored in the URL, so a filtered view can be bookmarked or shared
- Light / dark / system theme, remembered between visits
- Loading skeletons, empty states and friendly error messages with a retry button
- Fully responsive: collapsible sidebar on tablets, slide-out menu on phones (tested down to 360 px)
- Keyboard accessible: visible focus states, labelled buttons and form fields
- Unit and component tests with Vitest and React Testing Library

---

## 📸 Screenshots

| Dashboard (light) | Dashboard (dark) |
| --- | --- |
| ![Dashboard light](docs/screenshots/dashboard-light.png) | ![Dashboard dark](docs/screenshots/dashboard-dark.png) |

| Products table | Mobile view |
| --- | --- |
| ![Products](docs/screenshots/products.png) | ![Mobile](docs/screenshots/mobile.png) |

---

## 🛠 Tech stack

| Area | Tools |
| --- | --- |
| Framework | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Charts | Recharts |
| Icons | lucide-react |
| Data | [DummyJSON](https://dummyjson.com) REST API (products, carts, users, auth) |
| State | React Context (auth, theme), custom hooks, URL search params |
| Testing | Vitest, React Testing Library, jsdom |
| Code quality | ESLint, Prettier |
| Hosting | Vercel |

---

## 🚀 Getting started

### Prerequisites
- Node.js 20 or newer
- npm 10 or newer

### Installation

```bash
git clone https://github.com/murtzwork5253/shoppulse-admin.git
cd shoppulse-admin
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 and sign in with the demo credentials above.

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL of the REST API | `https://dummyjson.com` |

### Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Format code with Prettier |

---

## 📁 Project structure

```
src/
├── api/              # API client and one file per resource (auth, products, orders, users)
├── components/
│   ├── layout/       # AppLayout, Sidebar, Topbar
│   ├── ui/           # Reusable UI: Button, Input, Select, Badge, Card, Skeleton, Pagination
│   ├── table/        # Generic DataTable component
│   └── charts/       # RevenueLineChart, CategoryBarChart
├── context/          # AuthContext, ThemeContext
├── hooks/            # useFetch, useDebounce, useTableParams
├── pages/            # Login, Dashboard, Products, ProductDetail, Orders, OrderDetail, Customers, Settings, NotFound
├── routes/           # Router setup and ProtectedRoute
├── types/            # TypeScript types for API responses
├── utils/            # Formatters (currency, numbers) and helpers
└── test/             # Test setup
```

---

## 🧠 Key decisions

- **Server-side pagination, search and sorting.** The table only downloads the rows it shows (`limit` / `skip` / `sortBy` / `order`), so it stays fast with large datasets — the same approach a real admin panel needs.
- **URL as the source of truth for table state.** Page, search, sort and category live in the query string, so refreshing the page or sharing the link keeps the exact view.
- **One reusable `DataTable`.** Products, orders and customers all use the same typed table component with column definitions, so new tables take minutes to add.
- **Request cancellation.** `useFetch` aborts outdated requests with `AbortController`, so fast typing in the search box never shows stale results.
- **Typed API layer.** Every response has a TypeScript type, which catches mismatches at build time instead of in production.

---

## 🧪 Testing

```bash
npm run test:run
```

Covered so far:
- Currency and number formatters
- `useDebounce` hook
- `DataTable` rendering, empty state and sort clicks
- `Pagination` page changes and disabled states
- `ProtectedRoute` redirect when logged out

---

## ⚠️ Known limitations

- DummyJSON is a mock API: create, update and delete requests are simulated and not saved on the server.
- The API has no order dates, so the 12-month revenue trend uses generated sample data (`src/api/mockStats.ts`). All other numbers come from the API.
- The API cannot combine text search with a category filter, so when both are used, the category's products are fetched and searched in the browser.

---

## 🗺 Roadmap

- [ ] Add / edit product form with validation
- [ ] CSV export of the current table view
- [ ] Role-based access (admin vs viewer)
- [ ] Date-range filter on the dashboard

---

## 👤 Author

**Murtaza Lakdawala** — Flutter & React Developer

- Portfolio: [your-portfolio-link](https://your-portfolio-link)
- LinkedIn: [linkedin.com/in/murtaza-lakdawala](https://linkedin.com/in/murtaza-lakdawala)
- GitHub: [github.com/murtzwork5253](https://github.com/murtzwork5253)
- Email: murtazaworkspace@gmail.com

Available for freelance work — React dashboards, business websites and Flutter apps.

---

## 📄 License

MIT
