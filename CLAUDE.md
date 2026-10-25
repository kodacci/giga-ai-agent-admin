# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Admin panel SPA for Giga AI Agent. TypeScript + React 19, React Router, Ant Design 6 (dark theme via `ConfigProvider` in `src/app/App.tsx`), Tailwind CSS 4, bundled with webpack + Babel (no `tsc` emit). TanStack Query is planned (ESLint plugin already configured) but not yet a dependency.

## Commands

Requires Node 24+ (`engines` in `package.json`; CI uses NodeJS v24). Older Node versions fail on modern syntax in the toolchain.

```bash
npm install
npm start            # webpack dev server on :8080, proxies /api -> https://api.giga-ai-agent.test.cloud.ra-tech.pro
npm run build        # production bundle into build/dist
npm run pretty       # prettier check (src/)
npm run pretty:fix
npm run lint         # eslint with type-aware rules
npm run lint:fix
npm run typecheck    # tsc --noEmit (Babel strips types without checking them)
npm test             # all tests with coverage (enforces 90/90/90/80 thresholds)
npm test -- src/app/App.test.tsx --coverage=false   # single test file
```

CI (`Jenkinsfile`) runs, in order: `npm run pretty`, `npm run lint`, `npm run typecheck`, `npm run test` (Clover coverage from `coverage/clover.xml`, thresholds: 90% methods/statements, 80% conditionals), `npm run build`. All must pass.

`tsconfig.json` uses `moduleResolution: bundler`, so relative imports need no file extensions; non-TS side-effect imports (e.g. CSS) need a declaration in `src/global.d.ts`.

Testing: Jest 30 + Testing Library in jsdom; tests live next to the code as `src/**/*.test.tsx` and import `describe`/`it`/`expect`/`jest` from `@jest/globals` (no global types). Run tests through `npm test`, not bare `npx jest`: `react-router` v8 is ESM-only and uses `import.meta`, so Babel can't convert it to CommonJS. The script therefore sets `NODE_OPTIONS=--experimental-vm-modules` so Node loads it natively. Test-only support files are in `test/` (`setup.ts` for jest-dom matchers and the `matchMedia` mock Ant Design needs, `polyfills.js` for `TextEncoder`/`TextDecoder`). Babel presets are shared by webpack and Jest via `babel.config.json`.

## Architecture

- `src/index.tsx` mounts `<App />` into `#root` (template: `assets/index.ejs`).
- `src/app/` — top-level wrappers: `App.tsx` (theme provider + `BrowserRouter`), `AppRouter.tsx` (route table).
- `src/components/` — Atomic Design (`atoms/`, …, `pages/`). Pages compose layout atoms like `AppLayout`.
- `src/api/` (backend API layer), `src/services/` (non-UI logic, e.g. auth), `src/hooks/`, `src/context/`, `src/stores/` — currently empty placeholders.
- Import via webpack aliases: `@app`, `@api`, `@components`, `@context`, `@hooks`, `@services`, `@stores`, `@test` (→ `test/`). When adding an alias, update both `webpack.config.js` and `compilerOptions.paths` in `tsconfig.json`.
- Backend is reached only through relative `/api/...` paths: proxied by the webpack dev server locally and by nginx (`distrib/nginx.conf`) in production.

## Code style (enforced by ESLint/Prettier)

- Prettier: no semicolons, single quotes, 2-space indent, width 80, trailing commas `es5`.
- Explicit function return types are required (`@typescript-eslint/explicit-function-return-type`); components are written as `export const X: FC<...> = (...): ReactNode => ...`.
- Use `import type` for type-only imports (`verbatimModuleSyntax`).
- `curly`, `prefer-const`, `@typescript-eslint/prefer-readonly`; unused args must be prefixed with `_`.
- Named exports, no React import needed for JSX.

## Deployment

`Dockerfile` serves the static bundle with nginx (`:8080` app, `:8081` `/health`). The main `Jenkinsfile` builds, uploads a zip to Nexus, builds/pushes the image, then triggers `distrib/deploy/Jenkinsfile`, which renders the Jinja2 k8s/Istio templates in `distrib/templates/` with `distrib/deploy/{test-,}vars.yaml` and applies them. `release/*` branches deploy to prod (`giga-ai-agent-admin` namespace); everything else to the test namespace.

## Workflow conventions

- Trunk-based development: `main` is protected (PRs only, squash/fast-forward). Branches: `feature/<issue>-<slug>`, `bugfix/<issue>-<slug>`, `release/*`.
- Conventional commits including the GitHub issue number (e.g. `feat: #75 app skeleton`).
- Requirements: >90% coverage, Playwright tests (not yet set up).
