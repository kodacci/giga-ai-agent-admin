# AGENTS.md

Admin panel SPA for Giga AI Agent. TypeScript + React 19, React Router 8, Ant Design 6 (dark theme), Tailwind CSS 4, bundled with webpack + Babel — **no `tsc` emit**, types are stripped by Babel, so `npm run typecheck` is the only type verification.

## Commands

Node 24+ is required (`engines` + `engine-strict=true` in `.npmrc`; CI uses NodeJS v24). Older Node fails on modern toolchain syntax.

```bash
npm start            # webpack dev server :8080, proxies /api -> https://api.giga-ai-agent.test.cloud.ra-tech.pro
npm run build        # production bundle -> build/dist
npm run pretty       # prettier check (src/); pretty:fix to write
npm run lint         # eslint, type-aware rules
npm run typecheck    # tsc --noEmit
npm test             # jest with coverage, enforces 90/90/90/80 thresholds
npm test -- src/app/App.test.tsx --coverage=false   # single test file
```

CI (`Jenkinsfile`) runs this exact order, all must pass: `pretty -> lint -> typecheck -> test -> build`. Local verification should follow the same order.

Run tests via `npm test`, never bare `npx jest`: react-router v8 is ESM-only and uses `import.meta`, which Babel can't transpile. The npm script sets `NODE_OPTIONS=--experimental-vm-modules` so Node loads it natively.

## Architecture

- `src/index.tsx` mounts `<App />` into `#root` (template `assets/index.ejs`).
- `src/app/` — `App.tsx` (antd `ConfigProvider` theme + `BrowserRouter`), `AppRouter.tsx` (route table).
- `src/components/` — Atomic Design (`atoms/`, …, `pages/`); pages compose layout atoms like `AppLayout`.
- `src/api/`, `src/services/`, `src/hooks/`, `src/context/`, `src/stores/` are currently **empty placeholders** (`.gitkeep` only).
- Backend is reached only through relative `/api/...` paths — proxied by the webpack dev server locally and by nginx (`distrib/nginx.conf`) in production. Never hardcode absolute API URLs.

### Path aliases: three files, not two

`@app @api @components @context @hooks @services @stores @test` (→ `test/`) must be kept in sync in **all three**:
`webpack.config.js` (`resolve.alias`), `tsconfig.json` (`compilerOptions.paths`), and `jest.config.js` (`moduleNameMapper`). Adding an alias in only some of them breaks the build or tests silently.

`tsconfig.json` uses `moduleResolution: bundler` (no extensions in relative imports) and `verbatimModuleSyntax` (use `import type` for types). Non-TS side-effect imports (CSS) need a declaration in `src/global.d.ts`.

## Testing

- Jest 30 + Testing Library, jsdom; tests colocated as `src/**/*.test.tsx`.
- Import `describe`/`it`/`expect`/`jest` from `@jest/globals` — no global types (`"types": []` in tsconfig).
- `test/setup.ts` registers jest-dom matchers and mocks `matchMedia` (Ant Design needs it in jsdom); `test/polyfills.js` provides `TextEncoder`/`TextDecoder`. `test/styleMock.ts` stubs CSS imports.
- Coverage excludes `src/index.tsx` and `*.d.ts`. Playwright tests are a stated requirement but not set up yet.

## Code style (enforced)

- Prettier: no semicolons, single quotes, 2-space indent, width 80, trailing commas `es5`.
- Explicit function return types required (`@typescript-eslint/explicit-function-return-type`).
- Components: `export const X: FC<Props> = (...): ReactNode => ...`, named exports, no `React` import for JSX.
- Unused args must be prefixed `_`. `curly`, `prefer-const`, `prefer-readonly` are errors.
- The TanStack Query ESLint plugin is configured, but `@tanstack/react-query` is not yet a dependency.

## Workflow

- Trunk-based: `main` is protected (PRs only, squash / fast-forward). Branches: `feature/<issue>-<slug>`, `bugfix/<issue>-<slug>`, `release/*` — issue number required in branch names.
- Conventional commits with GitHub issue number: `feat: #75 app skeleton`.
- Feature work goes through OpenSpec (`openspec/`, slash commands in `.claude/commands/opsx/`).

## Deployment (context, not usually touched from code sessions)

`Dockerfile` serves the static bundle via nginx (`:8080` app, `:8081` `/health`). Main `Jenkinsfile` builds and uploads to Nexus, then triggers `distrib/deploy/Jenkinsfile`, which renders Jinja2 k8s/Istio templates in `distrib/templates/` with `distrib/deploy/{test-,}vars.yaml`. `release/*` → prod namespace; everything else → test (https://admin.giga-ai-agent.test.cloud.ra-tech.pro).

`build/`, `coverage/` are gitignored generated artifacts — never edit or commit them.
