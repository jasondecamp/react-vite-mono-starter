# CLAUDE.md

Context for Claude Code agents working in this repo. Package-specific notes live in `packages/*/CLAUDE.md` and load automatically when you work in that package.

## What this repo is

A **template** monorepo for scaffolding React single-page apps. It is meant to grow into:

- one or more **SPA builds** (each its own Vite app package, like `packages/app`)
- a shared **component library** (`packages/ui`) documented and showcased in **Storybook**
- a shared **services** package (`packages/services`) of framework-agnostic utilities and helpers

Right now it holds one app, one `Button` component, and a handful of utilities. Treat the existing code as reference patterns to copy, not finished product.

## Stack

- Plain **JavaScript + JSX** (ES modules, `"type": "module"` everywhere). No TypeScript, no CSS framework.
- **Node `^22.22.2`, `^24.15`, or `>=26`** (required by Lerna 10). This is enforced: root `engines` plus `engineStrict` in `pnpm-workspace.yaml` make `pnpm install` and `pnpm <script>` fail on other versions. `.nvmrc` selects Node 24.
- **React 19.3**
- **Vite 8** (Rolldown-based) with `@vitejs/plugin-react` 6, a single version shared by every package
- **Storybook 10** (`@storybook/react-vite`, `@storybook/addon-docs` for autodocs, `@storybook/addon-vitest` for stories as tests) in `packages/ui`
- **Vitest 5** + **React Testing Library** for tests. Story tests run in headless Chromium through Playwright.
- **pnpm 12 workspaces** for installing and linking (version pinned via `packageManager`) + **Lerna 10** (Nx-powered) for running scripts across packages. Lerna is an intentional part of the template for scaling to many packages; keep it.
- **ESLint 10**: one root flat config (`eslint.config.js`) covering every package, including `eslint-plugin-storybook` for stories
- **GitHub Actions** CI (`.github/workflows/ci.yml`)

## Layout

```
.
├── package.json          # root scripts, engines; packageManager: pnpm@12.15.0
├── pnpm-workspace.yaml   # workspace globs (packages/*), allowBuilds, engineStrict
├── pnpm-lock.yaml
├── lerna.json            # independent versioning, npmClient: pnpm
├── eslint.config.js      # shared lint config for all packages
├── .nvmrc
├── .github/
│   ├── workflows/ci.yml  # lint → test → build → build-storybook on PRs and pushes to main
│   └── dependabot.yml    # weekly GitHub Actions version bumps
└── packages/
    ├── app/              # @react-vite-mono-starter/app      – Vite SPA (the "build")
    │   ├── index.html    # Vite entry HTML → /src/main.jsx
    │   ├── src/main.jsx  # createRoot + StrictMode
    │   ├── src/App.jsx   # demo consuming ui + services (+ App.test.jsx)
    │   ├── vite.config.js    # Vite + Vitest (jsdom) config
    │   └── vitest.setup.js   # jest-dom matchers + RTL cleanup
    ├── ui/               # @react-vite-mono-starter/ui       – component library + Storybook
    │   ├── .storybook/   # main.js (story globs, addons), preview.js
    │   ├── src/index.js  # public exports
    │   ├── src/Introduction.mdx  # Storybook landing docs page (MDX)
    │   ├── src/components/Button.{jsx,css,stories.jsx,test.jsx}
    │   ├── vite.config.js    # library build + Vitest projects: `unit` (jsdom) and `storybook` (Chromium)
    │   └── vitest.setup.js
    └── services/         # @react-vite-mono-starter/services – shared utils, no build step
        └── src/{index.js, utils/, helpers/}   # *.test.js next to each module
```

Dependency direction: `app → ui → services`, and `app → services`. **Never** import from `app` inside `ui`/`services`, and keep `services` free of React.

## How the packages connect

Workspace packages are consumed **as source, not as built output**:

- `ui` and `services` set `"main"`/`"exports"` to files in `src/`. pnpm symlinks them into each consumer's `node_modules/@react-vite-mono-starter/*`.
- The app's Vite dev server and build compile the ui JSX/CSS directly. Edits to `ui` or `services` hot-reload in the app with no rebuild step.
- `packages/ui`'s `vite build` emits a library bundle (`dist/ui.es.js`, `dist/ui.umd.js`, `dist/ui.css`, React externalized), but **nothing in the repo consumes it**. It exists to prove the library builds and as a starting point for publishing. If you ever publish `ui`, `"main"`/`"exports"` must point at `dist/`.
- Internal deps use the workspace protocol, `"workspace:*"`, so pnpm always links the local package and never fetches from the registry.

## Commands (run from repo root)

| Command | What it does |
|---|---|
| `pnpm install` | Install + link all workspaces |
| `pnpm --filter @react-vite-mono-starter/ui exec playwright install chromium` | One-time: download the browser that story tests run in |
| `pnpm dev:app` | Vite dev server for the app (http://localhost:5173) |
| `pnpm dev:ui` | Storybook for the ui library (http://localhost:6006) |
| `pnpm lint` | ESLint across every package |
| `pnpm test` | `lerna run test`: Vitest in every package (services, ui unit + stories, app) |
| `pnpm --filter <pkg> test` | Test one package, e.g. `@react-vite-mono-starter/ui` |
| `pnpm --filter @react-vite-mono-starter/ui exec vitest run --project storybook` | Only the story tests (`--project unit` for only unit tests) |
| `pnpm --filter <pkg> exec vitest` | Watch mode |
| `pnpm build` | `lerna run build`: builds `ui` then `app` (services has no build) |
| `pnpm build:app` / `pnpm build:ui` | Build one package |
| `pnpm --filter @react-vite-mono-starter/app preview` | Serve the app's production build |
| `pnpm --filter @react-vite-mono-starter/ui build-storybook` | Static Storybook → `packages/ui/storybook-static/` |
| `pnpm clean` | `lerna clean`: deletes package `node_modules` |

To verify a change, run `pnpm lint && pnpm test && pnpm build`, which is what CI runs, plus `build-storybook` if you touched Storybook config. Check visually with `pnpm dev:app` / `pnpm dev:ui` when UI is involved.

## Testing

- Tests live next to the code they test as `<module>.test.js(x)`. Import `describe`/`it`/`expect`/`vi` from `vitest` explicitly (Vitest globals are off).
- **services:** Vitest's default Node environment. Files that need browser APIs opt in with a `// @vitest-environment jsdom` first line (see `helpers/browser.test.js`).
- **app** and **ui unit tests:** jsdom + React Testing Library. Each package's `vitest.setup.js` registers jest-dom matchers (`toBeInTheDocument`, `toHaveClass`, …) and calls RTL `cleanup()` after each test. Query by role and accessible name, and drive interactions with `userEvent.setup()`.
- **Stories are tests.** The `storybook` Vitest project in `packages/ui` renders every story in headless Chromium, so a story that throws fails the run. A story with a `play` function is an interaction test: it receives `{ args, canvas, userEvent }`, and its assertions use `expect` from `storybook/test`. The Button meta sets `args: { onClick: fn() }` so stories can assert on the spy, and clicks also show in the Actions panel. The same tests run from the Storybook UI's test panel.
- Prefer a `play` function for behaviour that's visible in a story. Use a `*.test.jsx` unit test for edge cases that don't deserve their own story.

## Common tasks

### Add a UI component
1. `packages/ui/src/components/<Name>.jsx` as a named export, plus `<Name>.css` imported by the component.
2. `<Name>.stories.jsx` next to it (CSF3: default export with `title: 'Components/<Name>'`, `tags: ['autodocs']`, `argTypes`, and `fn()` spies for callback args; named exports with `args`, plus `play` functions for interactions). Storybook picks up `src/**/*.stories.*` and `src/**/*.mdx` automatically.
3. Add `<Name>.test.jsx` for any edge cases not covered by stories.
4. Export it from `packages/ui/src/index.js`.
5. Import in an app with `import { Name } from '@react-vite-mono-starter/ui'`.

### Add a service function
1. Add it to an existing module in `packages/services/src/utils/` or `src/helpers/`, or create a new module there.
2. Add tests to the module's `*.test.js`.
3. Re-export it by name from that folder's `index.js`. The root `src/index.js` re-exports both folders with `export *`.
4. A new top-level folder also needs an entry in `services/package.json` `"exports"` if you want it importable as a subpath.
5. Update `packages/services/README.md`'s function list.

### Add another SPA build
1. Copy `packages/app` to `packages/<name>` (drop `dist/` and `node_modules/`).
2. Rename it in `package.json` to `@react-vite-mono-starter/<name>`, and update `<title>` in `index.html`.
3. Give it a distinct dev port in `vite.config.js` (`server: { port: 5174 }`) so it can run alongside the app.
4. Add `dev:<name>` / `build:<name>` scripts to the root `package.json` and run `pnpm install`. `pnpm build` and `pnpm test` pick it up automatically through `packages/*`.
5. Add the package to the react-refresh `files` glob in `eslint.config.js` (`packages/{app,ui}/src/**/*.jsx`).

## Conventions

- Named exports for components and functions. The app's `App` is the only default export besides config files and story metas.
- Component styling: a plain CSS file per component using BEM-ish classes (`button`, `button--primary`, `button--small`), composed with `classNames` from `@react-vite-mono-starter/services/helpers`.
- Service functions are arrow functions with JSDoc (`@param`/`@returns`). Browser-only helpers guard with `isBrowser()` and fail soft (try/catch, return a default or `false`).
- 2-space indent, single quotes. `app` and the root config omit semicolons (Vite template style); `ui` and `services` use them. Match the file you are editing. ESLint doesn't enforce style.
- Package names are always scoped `@react-vite-mono-starter/*`. When turning the template into a real project, rename the scope everywhere, including root scripts, internal dependency entries, imports, CI filters, and test files.

## Gotchas

- **pnpm's `node_modules` is strict.** A package can only import what its own `package.json` declares; there is no hoisting. If you add an import, add the dependency to that package (`pnpm --filter <pkg> add <dep>`), not just to the root. Lint tooling is the exception: ESLint and its plugins are root dev dependencies, because the config lives at the root.
- **Release-age guard.** pnpm refuses versions published less than a day ago. If a just-released version fails to install, wait, or use a range that allows the previous patch. Don't add `minimumReleaseAgeExclude` entries unless a human asks for one.
- **Build scripts are opt-in.** Only the packages under `allowBuilds` in `pnpm-workspace.yaml` (`esbuild`, `nx`) may run install scripts. If a new dependency needs one, `pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`; review the package, then run `pnpm approve-builds <pkg>`.
- **`pnpm clean` runs the repo's `clean` script** (`lerna clean`), not pnpm's built-in clean command. To reset installs, delete `node_modules` and `packages/*/node_modules` and run `pnpm install`.
- **Story tests need Chromium.** If `pnpm test` fails in `ui` with a missing-browser error, run the `playwright install chromium` command from the table above. CI installs it with `--with-deps`.
- A failing story test saves a screenshot to `__screenshots__/` next to the story (gitignored; CI uploads them as an artifact).
- `crypto.randomUUID()` (used by `generateId`) only exists in secure contexts: HTTPS or localhost.
- `pnpm peers check` reports an unmet `conventional-commits-parser` peer inside Lerna's changelog tooling. Those tools are only used for publishing, which this repo doesn't do, so the warning is harmless.
- **Keep a single Vite version.** `app` and `ui` both declare `vite@^8`. Bump them together, and check that `@vitejs/plugin-react`, `vitest`, and `@storybook/react-vite` peer ranges allow the new major first.
- **Vite 8 uses Rolldown.** Configure bundler options under `build.rolldownOptions` (the old `rollupOptions` is a deprecated alias). In ESM config files, use `import.meta.dirname` instead of `__dirname`.
- **Storybook 9+ consolidated addons.** Controls, actions, viewport, backgrounds, and interactions are built into `storybook` core. Don't reinstall `@storybook/addon-essentials`, `addon-interactions`, or `@storybook/blocks` (they stopped at 8.6). Doc blocks import from `@storybook/addon-docs/blocks`, and test utilities from `storybook/test`.
- `build-storybook` warns about a chunk over 500 kB. That's Storybook's own bundle and expected.
- `lerna.json` uses `"version": "independent"`, but every package is `private` and at `0.0.0`. Nothing is published.
- The `ui` build doesn't externalize `@react-vite-mono-starter/services`, so services code gets bundled into `ui/dist`.
- `dist/`, `storybook-static/`, and `coverage/` are gitignored. Don't commit build output.
