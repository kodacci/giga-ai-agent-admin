# Proposal

## Why

Admins have no way to see which AI models the giga-ai-agent backend actually
exposes at any moment. The backend already serves the authoritative list via
`GET /api/v1/ai-agent/models` (no auth required), and that list drifts from any
hardcoded view of it — it includes preview variants and embedding models that
other parts of the API contract don't mention. This change delivers the first
data-driven page of the admin panel and establishes the API-fetching pattern the
rest of the app will reuse.

## What Changes

- New read-only page at `/models` listing available AI models received from the
  backend, with loading, error (with retry), and empty states.
- New typed API layer in `src/api/` wrapping the models endpoint through the
  relative `/api/...` path, and a `src/hooks/` query hook for it.
- `@tanstack/react-query` added as a dependency as the server-state solution
  (README already declares it the stack; `QueryClientProvider` wired in `App.tsx`).
- New shared header navigation (antd `Menu`) with `Home` and `Models` entries;
  layout chrome (Header/Footer) hoisted out of `HomePage` into reusable atoms so
  pages compose content only.
- No backend changes; no mutations introduced.

## Capabilities

### New Capabilities

- `ai-model-catalog`: Fetching and read-only presentation of the AI model list
  exposed by the giga-ai-agent backend, including state handling (loading,
  error, retry, empty) and grouping of chat vs embedding models.
- `app-navigation`: Persistent top-level navigation shell that lets users move
  between admin sections and shows the active section.

### Modified Capabilities

_None — the project has no existing specs._

## Impact

- `src/app/App.tsx` — add `QueryClientProvider`.
- `src/app/AppRouter.tsx` — layout route wrapping `/` and `/models`.
- `src/api/`, `src/hooks/` — new modules (currently empty placeholders).
- `src/components/` — new `ModelsPage`, new header/navigation atoms; `HomePage`
  refactored to render content only.
- `package.json` — add `@tanstack/react-query` dependency.
- Tests for the new API layer, hook, page, and navigation (coverage thresholds
  90/90/90/80 stay enforced); `global.fetch` stubbed in Jest, no new test tooling.
- CI order (`pretty -> lint -> typecheck -> test -> build`) unaffected in shape.
