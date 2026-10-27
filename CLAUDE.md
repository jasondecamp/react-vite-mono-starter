# CLAUDE.md

Context for Claude Code agents working in this repo. Package-specific notes live in `packages/*/CLAUDE.md` and load automatically when you work in that package.

## What this repo is

A **template** monorepo for scaffolding React single-page apps. It is meant to grow into:

- one or more **SPA builds** (each its own Vite app package, like `packages/app`)
- a shared **component library** (`packages/ui`) documented and showcased in **Storybook**
- a shared **services** package (`packages/services`) of framework-agnostic utilities and helpers

Right now it holds one app, one `Button` component, and a handful of utilities. Treat the existing code as reference patterns to copy, not finished product.

## Stack

- Plain **JavaScript + JSX** (ES modules, `"type": "module"` everywhere). No TypeScript, no test runner, no CSS framework.
- **React 19.2**
- **Vite 7** (app); the ui package declares Vite 5 (see Gotchas)
- **Storybook 8.6** (`@storybook/react-vite`) in `packages/ui`
- **Yarn 1 workspaces** for linking + **Lerna 8** (Nx-powered) for running scripts across packages
- **ESLint 9** flat config, in `packages/app` only

## Layout

```
.
├── package.json          # workspaces: packages/*; root scripts
├── lerna.json            # independent versioning, npmClient: yarn
└── packages/
    ├── app/              # @react-vite-mono-starter/app      – Vite SPA (the "build")
    │   ├── index.html    # Vite entry HTML → /src/main.jsx
    │   ├── src/main.jsx  # createRoot + StrictMode
    │   ├── src/App.jsx   # demo consuming ui + services
    │   └── eslint.config.js
    ├── ui/               # @react-vite-mono-starter/ui       – component library + Storybook
    │   ├── .storybook/   # main.js (story globs, addons), preview.js
    │   ├── src/index.js  # public exports
    │   └── src/components/Button.{jsx,css,stories.jsx}
    └── services/         # @react-vite-mono-starter/services – shared utils, no build step
        └── src/{index.js, utils/, helpers/}
```

Dependency direction: `app → ui → services`, and `app → services`. **Never** import from `app` inside `ui`/`services`, and keep `services` free of React.

## How the packages connect

Workspace packages are consumed **as source, not as built output**:

- `ui` and `services` set `"main"`/`"exports"` to files in `src/`. Yarn symlinks them into `node_modules/@react-vite-mono-starter/*`.
- The app's Vite dev server and build compile the ui JSX/CSS directly. Edits to `ui` or `services` hot-reload in the app with no rebuild step.
- `packages/ui`'s `vite build` emits a library bundle (`dist/ui.es.js`, `dist/ui.umd.js`, `dist/ui.css`, React externalized), but **nothing in the repo consumes it**. It exists to prove the library builds and as a starting point for publishing. If you ever publish `ui`, `"main"`/`"exports"` must point at `dist/`.
- Internal deps are declared with the exact version `"0.0.0"`, which matches the workspace packages' versions so Yarn links them locally.

## Commands (run from repo root)

| Command | What it does |
|---|---|
| `yarn install` | Install + link all workspaces |
| `yarn dev:app` | Vite dev server for the app (http://localhost:5173) |
| `yarn dev:ui` | Storybook for the ui library (http://localhost:6006) |
| `yarn build` | `lerna run build`: builds `ui` then `app` (services has no build) |
| `yarn build:app` / `yarn build:ui` | Build one package |
| `yarn workspace @react-vite-mono-starter/app lint` | ESLint (app only) |
| `yarn workspace @react-vite-mono-starter/app preview` | Serve the app's production build |
| `yarn workspace @react-vite-mono-starter/ui build-storybook` | Static Storybook → `packages/ui/storybook-static/` |
| `yarn clean` | `lerna clean`: deletes package `node_modules` |

There are no tests. To verify a change, run `yarn build` and the app's lint, and check visually with `yarn dev:app` / `yarn dev:ui` when UI is involved.

## Common tasks

### Add a UI component
1. `packages/ui/src/components/<Name>.jsx` as a named export, plus `<Name>.css` imported by the component.
2. `<Name>.stories.jsx` next to it (CSF3: default export with `title: 'Components/<Name>'`, `tags: ['autodocs']`, `argTypes`; named exports with `args`). Storybook picks up `src/**/*.stories.*` and `src/**/*.mdx` automatically.
3. Export it from `packages/ui/src/index.js`.
4. Import in an app with `import { Name } from '@react-vite-mono-starter/ui'`.

### Add a service function
1. Add it to an existing module in `packages/services/src/utils/` or `src/helpers/`, or create a new module there.
2. Re-export it by name from that folder's `index.js`. The root `src/index.js` re-exports both folders with `export *`.
3. A new top-level folder also needs an entry in `services/package.json` `"exports"` if you want it importable as a subpath.
4. Update `packages/services/README.md`'s function list.

### Add another SPA build
1. Copy `packages/app` to `packages/<name>` (drop `dist/` and `node_modules/`).
2. Rename it in `package.json` to `@react-vite-mono-starter/<name>`, and update `<title>` in `index.html`.
3. Give it a distinct dev port in `vite.config.js` (`server: { port: 5174 }`) so it can run alongside the app.
4. Add `dev:<name>` / `build:<name>` scripts to the root `package.json` and run `yarn install`. `yarn build` picks it up automatically through `packages/*`.

## Conventions

- Named exports for components and functions. The app's `App` is the only default export besides config files.
- Component styling: a plain CSS file per component using BEM-ish classes (`button`, `button--primary`, `button--small`), composed with `classNames` from `@react-vite-mono-starter/services/helpers`.
- Service functions are arrow functions with JSDoc (`@param`/`@returns`). Browser-only helpers guard with `isBrowser()` and fail soft (try/catch, return a default or `false`).
- 2-space indent, single quotes. `app` omits semicolons (Vite template style); `ui` and `services` use them. Match the file you are editing.
- Package names are always scoped `@react-vite-mono-starter/*`. When turning the template into a real project, rename the scope everywhere, including root scripts, internal dependency entries, and imports.

## Gotchas

- **Vite version split.** `ui` declares `vite@^5.4.11` (Storybook 8 compatibility), while `app` uses `^7.2.2`. Both resolve in `yarn.lock`, but hoisting can let `ui`'s `vite` bin point at the root Vite 7. Check which Vite actually runs before debugging Vite-version-specific behavior.
- `lerna.json` uses `"version": "independent"`, but every package is `private` and at `0.0.0`. Nothing is published.
- Only `app` has ESLint config. `ui` and `services` are not linted.
- The `ui` build doesn't externalize `@react-vite-mono-starter/services`, so services code gets bundled into `ui/dist`.
- `dist/` and `storybook-static/` are gitignored. Don't commit build output.
- `packages/app/README.md` is the untouched Vite template README, not project docs.
