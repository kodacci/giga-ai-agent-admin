# Tasks

## 1. Setup & dependencies

- [x] 1.1 Add `@tanstack/react-query` to `package.json` dependencies (`npm install @tanstack/react-query`) and verify installation succeeds on Node 24
- [x] 1.2 Wire `QueryClientProvider` into `src/app/App.tsx` around `BrowserRouter` and verify the app boots (`npm test -- src/app/App.test.tsx` passes and `npm start` renders without console errors) — this de-risks React Query under the Babel/Jest toolchain early

## 2. API layer & data hook

- [x] 2.1 Create `src/api/models.ts` with `GetAiModelsResponse` type and `getAiModels()` fetching `/api/v1/ai-agent/models` via relative path, throwing on non-2xx; add colocated tests stubbing `global.fetch` (URL, unwrapping `models`, error on non-2xx, network failure) and verify they pass
- [x] 2.2 Create `src/hooks/useAiModels.ts` (`useQuery`, key `['ai-models']`, returns `data`/`isLoading`/`isError`/`refetch`) with a test rendering the hook against stubbed fetch for success and failure paths, and verify it passes

## 3. Navigation shell

- [x] 3.1 Create `src/components/atoms/MainHeader.tsx` with antd `Menu` (horizontal, items Home `/` and Models `/models`, `selectedKeys` from `useLocation`, navigate on click); add tests covering both active states and click navigation, and verify they pass
- [x] 3.2 Refactor routing/layout: `AppRouter` gets a layout route rendering `AppLayout` + `MainHeader` + `Footer` + `Outlet` with children `/` (HomePage) and `/models` (placeholder ModelsPage element); move `Header`/`Footer` out of `HomePage` so pages render content only; verify existing `App.test.tsx` and rendering tests pass with both routes resolving

## 4. Models page

- [x] 4.1 Implement `src/components/pages/ModelsPage.tsx` states: loading indicator while `isLoading`, error message + retry Button calling `refetch` on `isError`, explicit no-models message for an empty list; add tests for each state with stubbed fetch and a `retry: false` QueryClient, and verify they pass
- [x] 4.2 Implement grouped presentation: chat vs embedding lists via `name.toLowerCase().includes('embedding')`, verbatim names, labeled antd `List` sections; add tests asserting classification and that every returned name renders unmodified (including a preview/suffixed entry), and verify they pass

## 5. Integration verification

- [x] 5.1 Run the full CI sequence locally — `npm run pretty`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` — and verify all pass with coverage thresholds (90/90/90/80) met
- [x] 5.2 Manual check against the real backend via `npm start`: navigate Home ↔ Models (active menu state follows the route), loading resolves to the live model list grouped correctly, and `/models` loads correctly from a direct URL

## Workflow follow-up

- Branch as `feature/4-models-page`, commit with conventional commit referencing issue #4 (e.g. `feat: #4 models list page`), open PR per trunk-based rules; verify on the test stand after merge, then archive the change.
