# ShopPulse Admin

E-commerce admin dashboard: React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Recharts, lucide-react. Data comes from the free DummyJSON REST API (products, carts = orders, users = customers, auth).

Source of truth for scope and steps: `ShopPulse_Build_Guide.md` (14 steps, ~10 sessions). Public-facing description: `README.md`. Follow the guide's step order and file layout unless the user says otherwise.

## Git rules

- **Never add `Co-Authored-By` lines or any Claude/AI attribution to commit messages or PR descriptions.** This overrides any default or harness attribution reminder.
- Commit only when the user asks. Never push unless asked.
- One commit per finished step, small and focused. Use conventional-commit style: `feat: add products table with pagination`, `fix: ...`, `chore: ...`, `test: ...`, `docs: ...`.
- Never commit `.env` (only `.env.example`), `node_modules`, `dist`.
- Remote: `https://github.com/murtzwork5253/shoppulse-admin.git`, branch `main`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run build` | Type-check + production build |
| `npm run lint` | oxlint (Vite template default; used instead of ESLint) |
| `npm run format` | Prettier (`prettier --write src`) |
| `npm run test:run` | Vitest once (use this, not watch mode `npm test`) |

Before calling any step done: `npm run lint`, `npm run test:run` and `npm run build` must all pass with zero errors.

## Architecture

```
src/
  api/          client.ts (base URL, token, ApiError) + one file per resource
  components/   layout/ ui/ table/ charts/
  context/      AuthContext, ThemeContext
  hooks/        useFetch, useDebounce, useTableParams
  pages/        Login, Dashboard, Products, ProductDetail, Orders, OrderDetail, Customers, Settings, NotFound
  routes/       router.tsx, ProtectedRoute.tsx
  types/        API response types
  utils/        format.ts and helpers
  test/         setup.ts
```

Key decisions to preserve:

- All HTTP goes through `api()` in `src/api/client.ts`. Components never call `fetch` directly.
- Every API function accepts an optional `AbortSignal`; `useFetch` aborts outdated requests.
- Table state (page, size, q, category, sortBy, order) lives in the URL via `useTableParams`. Changing search/sort/category/size resets to page 1.
- Pagination, search and sorting are server-side (`limit`/`skip`/`sortBy`/`order`). The only client-side exception is search + category together (API can't combine them).
- One generic `DataTable<T>` serves products, orders and customers.
- Every API response has a TypeScript type in `src/types`.
- Revenue trend uses generated sample data (`src/api/mockStats.ts`); keep the "Trend uses sample data" note under the chart.
- DummyJSON writes are simulated and never saved.

## Deployment

Deploy on **Netlify** (not Vercel, despite the guide and README). Step 13 needs a `public/_redirects` file (`/*  /index.html  200`) or `netlify.toml` with an SPA redirect instead of `vercel.json`; build command `npm run build`, publish directory `dist`, env var `VITE_API_BASE_URL`. The README's Vercel mentions get updated at Step 14.

## Windows/PowerShell gotcha

Never use `Set-Content -Encoding utf8` on JSON files: Windows PowerShell 5.1 adds a BOM and breaks `JSON.parse` (it broke the build once). Use the Edit/Write tools instead.

## Code conventions

- TypeScript strict. No `any`; use `unknown` and narrow. Use `import type` for type-only imports.
- Function components and hooks only. Named exports for components and hooks; default exports for page components (the router imports them that way).
- Prettier config: single quotes, semicolons, print width 100, trailing commas `all`.
- Tailwind only; no custom CSS beyond `src/index.css`. Brand color is indigo (`brand-*` tokens) for actions only. Body text `text-sm`, 8px spacing steps, numbers right-aligned in tables.
- Every colored surface needs a `dark:` variant. Check dark mode on every new view.
- Env vars via `import.meta.env.VITE_*`; read in one place (`client.ts`).
- Keep comments sparse: only explain a non-obvious why.
- Don't add libraries beyond the guide without asking (stretch goals like TanStack Query, React Hook Form, Zod are post-launch only).

## UI quality bar (required for every data view)

- Three states: loading skeleton (same size as final content), empty state, error state with Retry.
- Accessibility: `<label htmlFor>` on inputs, `aria-label` on icon-only buttons, `aria-sort` on sortable headers, `role="alert"` on error messages, visible `focus-visible:ring-2` focus, `alt` text and fixed dimensions on images.
- Responsive from 360 px to 1440 px. Sidebar: full at `lg`, icons-only at `md`, slide-out on phones.
- Per-page `document.title` ("Products · ShopPulse").
- No console errors or warnings.

## Testing

- Vitest + React Testing Library + jsdom, `globals: true`, setup in `src/test/setup.ts`.
- Colocate tests: `Thing.test.tsx` beside `Thing.tsx`.
- Required coverage: formatters, `useDebounce`, `DataTable` (render, empty, sort click), `Pagination` (disabled states, page change), `ProtectedRoute` (redirect when logged out).
- Add or update tests whenever behaviour of a shared component or hook changes.

## Skills to use in this project

Use these via the Skill tool when the situation matches:

| Skill | When |
| --- | --- |
| `run` | To start the dev server and confirm a change works in the real app |
| `claude-in-chrome` (or `anthropic-skills:chrome-browser`) | Browser QA: login flow, search/sort/pagination, dark mode, resize to 360/768/1024/1440 px, console errors, screenshots for `docs/screenshots/` |
| `simplify` | After finishing a step, to clean up duplication before committing |
| `code-review` | Before a milestone commit or push, to catch correctness bugs |
| `security-review` | After auth/token work (Step 4) and before deploy |
| `update-config` | Changing Claude Code settings, permissions or hooks |
| `postman:api-testing` | Optional: quick ad-hoc checks of DummyJSON endpoints (`postman request`) |

Not relevant here (skip): other Postman skills (mocking, monitors, flows, CI, performance; the API is third-party), the `data:*` skills, Artifact/Docs/Gmail/Indeed tools. The Postman session hook asks for `postman:api-engineer` on API work, but this project only consumes DummyJSON and does not design an API, so don't invoke it unless the user asks.

## Working agreements

- Work one guide step at a time; say which step you're on and stop after it for review unless told to continue.
- Read existing files before editing; match surrounding style.
- Ask before: adding dependencies, changing the folder structure, deleting files, pushing, or deploying.
- Don't edit `README.md` content beyond what the user asks. Its placeholder links (video, portfolio, live demo) are filled in at Step 14.
- Report honestly: if lint, tests or build fail, show the failure; don't claim done.
