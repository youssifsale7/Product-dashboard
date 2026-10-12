# Product Dashboard

A responsive product dashboard built for a frontend internship screening task.

**Live demo:** _add your Vercel URL here_

## Features

- **Dashboard page:** 8 stat cards (products, categories, brands, favourites, average price and rating, units in stock, inventory value), bar charts (products and average price per category, rating distribution), price-range and stock-status pie charts, and top rated, low stock and favourites lists
- **Products page:** search, category filters, favourites with a live count, "Show more" paging
- Data fetched from the public [DummyJSON](https://dummyjson.com/products) API
- Loading skeletons, an error state with a **Retry** button (plus one automatic retry), and empty states
- Favourites persist across reloads (saved in `localStorage`)
- Responsive layout with a collapsible sidebar, light and dark mode, keyboard-accessible controls

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · TanStack React Query 5 · Zustand 5 · shadcn/ui-style components (Base UI) · Recharts

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

Requires Node.js 20.9 or newer. No environment variables are needed.

## Approach

- **Starting point.** I started from the free [AdminCN](https://themewagon.com/themes/admincn/) admin template
  (MIT, by shadcn/studio) for the app shell: sidebar, header, theme toggle and UI primitives. I removed all
  demo pages (mail, calendar, users, forms, auth, data tables), fake data, "Pro" menu items, the nav-apps
  API call, the download button and unused UI components. I changed the colour palette, radius and sidebar
  style, and built the dashboard and products pages myself.
- **Server state vs. client state.** React Query owns the API data (caching, loading, error, retry).
  Zustand owns the only client state that must outlive a page load: the favourite product IDs.
  Search text, the selected category and the "favourites only" toggle are local `useState`.
- **One request, client-side filtering.** The API supports `limit=0`, so all products arrive in a single
  request and both pages share the same cached query (`["products"]`). Search and category filters run
  instantly with `useMemo`; the search input is debounced.
- **Retry behaviour.** React Query retries once automatically. If that fails, the user sees an error message
  with a Retry button that calls `refetch()` and shows "Retrying…" while it runs.
- **Favourites persistence.** Zustand's `persist` middleware stores IDs in `localStorage`. Hydration is
  triggered manually after mount (`skipHydration` + `rehydrate()` in `Providers`), so server and client
  renders match and there is no hydration mismatch.

## Project structure

```
src/
  app/                  routes: /dashboard and /products (inside the (pages) layout)
  components/layout/    Sidebar, Header, Footer, ModeToggle
  components/shared/    loading / error / empty states
  components/ui/        shadcn-style primitives (only the ones in use)
  views/dashboard/      dashboard overview + category chart
  views/products/       products view + product card
  hooks/                use-products (React Query), use-debounce, use-mobile
  lib/                  API client, types, formatters
  store/                favourites store (Zustand)
```

## Testing the error state

In DevTools, open the Network tab, set throttling to **Offline**, then reload. The error state appears.
Switch back to **No throttling** and press **Retry**.

## AI assistance

I used an AI assistant (Claude) to help clean the template, write the first draft of the components and
this README. _Edit this paragraph to describe exactly what you reviewed, tested and changed yourself._

## License

The template code is MIT licensed (see `LICENSE.md`, Copyright shadcn/studio). The notice is kept as required.
