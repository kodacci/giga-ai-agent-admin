# Design

## Context

The app is a fresh skeleton: one index route (`HomePage`), empty placeholder
directories (`src/api`, `src/hooks`, `src/services`, ...), antd dark theme via
`ConfigProvider` in `App.tsx`, and a dev-server proxy for relative `/api` paths.
No data-fetching library is installed, though the README declares React Query
part of the stack and `@tanstack/eslint-plugin-query` is already configured.

The backend contract was verified live against `/v3/api-docs` and the endpoint
itself:

```
GET /api/v1/ai-agent/models        (no auth, no params)
-> 200 { "models": string[] }      (~14 entries, e.g. "GigaChat (saluteddevices)")
```

Constraints: webpack+Babel only (types stripped, `npm run typecheck` is the sole
type gate), CI order `pretty -> lint -> typecheck -> test -> build`, coverage
thresholds 90/90/90/80, path aliases must stay in sync across
`webpack.config.js`, `tsconfig.json`, `jest.config.js` (no new aliases needed
here), explicit function return types and `FC`/`ReactNode` component style.

## Goals / Non-Goals

**Goals:**
- First working vertical slice: backend call -> hook -> page, establishing the
  pattern all future data features copy.
- Shared navigation shell that survives growth (each new section = one menu
  item + one route).
- Keep the 90% coverage bar reachable with cheap, deterministic tests.

**Non-Goals:**
- Model administration (enable/disable, defaults, mutation) — explicitly out of
  scope; this is read-only observability.
- Caching policy tuning, polling, or websocket freshness — list changes rarely.
- Auth/session handling — endpoint requires none; add only when the backend does.
- Normalizing model names against the `AskAiModelRequest` enum — verbatim
  display is the point (see proposal/specs).

## Decisions

### 1. `@tanstack/react-query` as the server-state layer
Add the dependency now rather than hand-rolling a `useEffect` fetch hook.
A `QueryClientProvider` wraps the router in `App.tsx` (client created at module
scope or via `useState` factory). Rejected: hand-rolled hooks (throwaway — the
repo already commits to React Query in README and ESLint config); SWR/axios
(adds an unannounced dependency).

### 2. API layer: `src/api/models.ts` with native `fetch`
One typed function:

```
getAiModels(): Promise<string[]>        // GET /api/v1/ai-agent/models
interface GetAiModelsResponse { models: string[] }
```

Throws on non-2xx so React Query records an error state. Rejected: OpenAPI
client codegen (one endpoint doesn't justify a generator in the toolchain);
axios (extra dep for the same ergonomics).

### 3. Hook: `src/hooks/useAiModels.ts`
`useQuery` with query key `['ai-models']`, defaults for staleness (fresh on
mount is fine), exposing `data / isLoading / isError / refetch` to the page.
The retry button in the error state calls `refetch()`.

### 4. Presentation: antd `List`, grouped by kind
Two labeled sections — chat vs embedding — each an antd `List` of strings.
Classification: `name.toLowerCase().includes('embedding')` → embedding group;
everything else → chat. Rejected: `Table` (one string column is ceremony with
no sort/filter payoff); card grid (no metadata to display). If the backend later
returns objects, the row renderer changes but grouping/UI stays — acceptable.

### 5. Layout hoisting + navigation shell
New atom `src/components/atoms/MainHeader.tsx`: antd `Menu`
(`mode="horizontal"`, `items` = Home `/`, AI Models `/models`), `selectedKeys`
from `useLocation().pathname`, navigation via `useNavigate()`. `AppRouter` gains
a layout route (element renders `AppLayout` + `MainHeader` + `Footer` +
`Outlet`) wrapping `/` (HomePage) and `/models` (ModelsPage); `HomePage` sheds
its inline `Header`/`Footer`. Menu labels: "Home" and "Models" (nav label)
pointing at the AI Models page; future sections extend the `items` array only.
Rejected: keeping per-page chrome (duplicates header on every page, drifts);
sider layout (admin panel is small so far; horizontal menu is the cheaper
starting point, sider is a later swap that specs don't depend on).

### 6. Styling split
antd components for structure (Layout, Menu, List, Button, Alert/Skeleton);
Tailwind utility classes for spacing/typography only — matching how `HomePage`
already mixes them.

### 7. Testing approach
- `src/api/models.ts.test`: stub `global.fetch` (`jest.fn`), assert URL/method,
  unwrapping, and throw-on-error.
- `useAiModels` + `ModelsPage`: render with a fresh `QueryClient`
  (`retry: false`), stubbed fetch for success/error/empty/loading paths.
- `MainHeader`: active-key logic per route.
- `App.test.tsx` updated for the added provider if it mounts `App`.
Rejected: MSW (single GET doesn't need a mock server layer).

## Risks / Trade-offs

- [Backend list vs. ask-endpoint enum drift] → page deliberately shows raw
  names; a note in the spec makes this a feature, not a bug.
- [`Menu` horizontal may crowd as sections grow] → accepted trade-off;
  extension point is one array, sider migration is UI-only later.
- [Grouping by name substring breaks if vendor renames embeddings models] →
  worst case a model lands in the chat group; visible, non-blocking, one-line
  fix; no data loss since all names still render.
- [React Query + Jest ESM friction] → repo already runs Jest with
  `--experimental-vm-modules`; TanStack Query v5 ships dual CJS/ESM and works
  under Babel transform, but verify early in implementation (task 1 includes a
  smoke test) to avoid a late surprise against the 90% threshold.
- [Prod proxy path must match dev] → nginx `distrib/nginx.conf` already proxies
  `/api`; using the relative path keeps both environments identical.

## Migration Plan

Ordinary feature branch `feature/4-models-page` (GitHub issue #4) -> PR -> CI ->
auto-deploy to test stand. No data, config, or backend changes, so rollback is
a plain revert.
