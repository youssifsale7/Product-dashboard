# Product Dashboard

A responsive product dashboard built for a frontend internship screening task.

- **Live demo:** https://product-dashboard-blush-eta.vercel.app/dashboard
- **Repository:** https://github.com/youssifsale7/Product-dashboard
- **Time spent:** about 4 hours, from the first research to testing the live site

## Features

- **Dashboard page:** 8 stat cards (products, categories, brands, favourites, average price and rating, units in stock, inventory value), bar charts (products and average price per category, rating distribution), price-range and stock-status pie charts, and top rated, low stock and favourites lists
- **Products page:** search, category filters, favourites with a live count, a "favourites only" view and "Show more" paging
- Data fetched from the public [DummyJSON](https://dummyjson.com/products) API
- Loading skeletons, an error state with a **Retry** button (plus one automatic retry), and empty states
- Favourites persist across reloads (saved in `localStorage`)
- Responsive layout with a collapsible sidebar, light and dark mode, and keyboard-accessible controls

## What I used

| Tool                                     | Why                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Next.js 16 (App Router) + TypeScript     | Required framework; routing and project structure                    |
| Tailwind CSS 4                           | Required; styling and responsive layout                              |
| TanStack React Query 5                   | Required; API fetching, caching, loading / error / retry states      |
| Zustand 5                                | Required; favourites state, persisted to `localStorage`              |
| AdminCN template (MIT, by shadcn/studio) | Ready-made admin shell: sidebar, header, theme toggle, UI components |
| Recharts                                 | Bar and pie charts on the dashboard                                  |
| DummyJSON                                | Free public API for product data                                     |
| GitHub + Vercel                          | Source hosting and the live demo                                     |

## How I built it

1. **Research.** I looked at many dashboard and product-listing designs and compared how they organise
   information. I tried to find the clearest and most comfortable layout to use, and combined the ideas I
   liked best into one design.
2. **Data layer.** I added one API client and a React Query hook (`use-products`) shared by both pages, and a
   Zustand store for favourites.
3. **Products page.** Search (debounced), category filters, favourites with a count, product cards, and the
   loading, error / retry and empty states.
4. **Dashboard page.** Stat cards computed from the same product data, five charts and three lists, with
   loading and error states.
5. **Test.** I ran the project locally and tested each requirement by hand (see below).
6. **Deploy.** I pushed the code to GitHub and deployed it on Vercel.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Design decisions

- **Server state vs. client state.** React Query owns the API data (caching, loading, error, retry). Zustand
  owns the only client state that must outlive a page load: the favourite product IDs. Search text, the
  selected category and the "favourites only" toggle are local `useState`.
- **One request, client-side filtering.** The API supports `limit=0`, so all products arrive in a single
  request, and both pages share the same cached query (`["products"]`). Search and category filters run
  instantly with `useMemo`; the search input is debounced.
- **Retry behaviour.** React Query retries once automatically. If that fails, the user sees an error message
  with a Retry button that calls `refetch()` and shows "Retrying…" while it runs.
- **Favourites persistence.** Zustand's `persist` middleware stores IDs in `localStorage`. Hydration is
  triggered manually after mount (`skipHydration` + `rehydrate()` in `Providers`), so the server and client
  renders match and there is no hydration mismatch.

## Project structure

```
src/
  app/                  routes: /dashboard and /products (inside the (pages) layout)
  components/layout/    Sidebar, Header, Footer, ModeToggle
  components/shared/    loading / error / empty states
  components/ui/        shadcn-style primitives (only the ones in use)
  views/dashboard/      dashboard overview and charts
  views/products/       products view and product card
  hooks/                use-products (React Query), use-debounce, use-mobile
  lib/                  API client, types, formatters
  store/                favourites store (Zustand)
```

## Testing

I tested these by hand, locally and on the live site:

- Loading skeletons on first load
- Error state: DevTools, Network, **Offline**, reload; then back to **No throttling** and press **Retry**
- Search with matching and non-matching words, and search combined with a category filter
- Category filters, including selecting and clearing
- Favourites: add and remove, the count, the "favourites only" view, persistence after reload, and the
  favourites list on the dashboard
- Responsive layout on a phone-sized screen, and light and dark mode

## AI assistance

I used an AI assistant (Claude, by Anthropic) while building this project, and I want to be clear about how.

Research and direction (me). I researched many different designs for this idea, compared them, and tried to reach the best layout, the one that is easiest and most comfortable to use. I combined the ideas I found into one design. I decided the plan and directed the AI step by step: what to build, what to remove and what to change, for example adding more data and pie charts to the dashboard.
Code drafts (AI). Claude generated the first drafts of the code, following my plan and my instructions: the project cleanup and restyling, the pages, hooks, store, charts, and the first draft of this README.
Testing and review (me). I ran the project, tested every requirement, reviewed the code myself, deployed it to Vercel and prepared this repository.

## Possible improvements

- Unit tests (Vitest and React Testing Library) for the filter logic and the favourites store
- Sorting and a price-range filter on the products page
- A product details page

## License

The template code is MIT licensed (see `LICENSE.md`, Copyright shadcn/studio). The notice is kept as required.
