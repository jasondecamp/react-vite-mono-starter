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
- **Node `^22.22.2` or `^24.15`** (required by Lerna 10)
- **React 19.3**
- **Vite 8** (Rolldown-based) with `@vitejs/plugin-react` 6, a single version shared by every package
- **Storybook 10** (`@storybook/react-vite`, plus `@storybook/addon-docs` for autodocs) in `packages/ui`
- **pnpm 12 workspaces** for installing and linking (version pinned via `packageManager`) + **Lerna 10** (Nx-powered) for running scripts across packages
- **ESLint 10** flat config, in `packages/app` only

## Layout

```
.
├── package.json          # root scripts; packageManager: pnpm@12.15.0
├── pnpm-workspace.yaml   # workspace globs (packages/*) + allowBuilds
├── pnpm-lock.yaml
├── lerna.json            # independent versioning, npmClient: pnpm
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

- `ui` and `services` set `"main"`/`"exports"` to files in `src/`. pnpm symlinks them into each consumer's `node_modules/@react-vite-mono-starter/*`.
- The app's Vite dev server and build compile the ui JSX/CSS directly. Edits to `ui` or `services` hot-reload in the app with no rebuild step.
- `packages/ui`'s `vite build` emits a library bundle (`dist/ui.es.js`, `dist/ui.umd.js`, `dist/ui.css`, React externalized), but **nothing in the repo consumes it**. It exists to prove the library builds and as a starting point for publishing. If you ever publish `ui`, `"main"`/`"exports"` must point at `dist/`.
- Internal deps use the workspace protocol, `"workspace:*"`, so pnpm always links the local package and never fetches from the registry.

## Commands (run from repo root)

| Command | What it does |
|---|---|
| `pnpm install` | Install + link all workspaces |
| `pnpm dev:app` | Vite dev server for the app (http://localhost:5173) |
| `pnpm dev:ui` | Storybook for the ui library (http://localhost:6006) |
| `pnpm build` | `lerna run build`: builds `ui` then `app` (services has no build) |
| `pnpm build:app` / `pnpm build:ui` | Build one package |
| `pnpm --filter @react-vite-mono-starter/app lint` | ESLint (app only) |
| `pnpm --filter @react-vite-mono-starter/app preview` | Serve the app's production build |
| `pnpm --filter @react-vite-mono-starter/ui build-storybook` | Static Storybook → `packages/ui/storybook-static/` |
| `pnpm clean` | `lerna clean`: deletes package `node_modules` |

There are no tests. To verify a change, run `pnpm build` and the app's lint, and check visually with `pnpm dev:app` / `pnpm dev:ui` when UI is involved.

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
4. Add `dev:<name>` / `build:<name>` scripts to the root `package.json` and run `pnpm install`. `pnpm build` picks it up automatically through `packages/*`.

## Conventions

- Named exports for components and functions. The app's `App` is the only default export besides config files.
- Component styling: a plain CSS file per component using BEM-ish classes (`button`, `button--primary`, `button--small`), composed with `classNames` from `@react-vite-mono-starter/services/helpers`.
- Service functions are arrow functions with JSDoc (`@param`/`@returns`). Browser-only helpers guard with `isBrowser()` and fail soft (try/catch, return a default or `false`).
- 2-space indent, single quotes. `app` omits semicolons (Vite template style); `ui` and `services` use them. Match the file you are editing.
- Package names are always scoped `@react-vite-mono-starter/*`. When turning the template into a real project, rename the scope everywhere, including root scripts, internal dependency entries, and imports.

## Gotchas

- **pnpm's `node_modules` is strict.** A package can only import what its own `package.json` declares; there is no hoisting. If you add an import, add the dependency to that package (`pnpm --filter <pkg> add <dep>`), not just to the root.
- **Release-age guard.** pnpm refuses versions published less than a day ago. If a just-released version fails to install, wait, or use a range that allows the previous patch. Don't add `minimumReleaseAgeExclude` entries unless a human asks for one.
- **Build scripts are opt-in.** Only the packages under `allowBuilds` in `pnpm-workspace.yaml` (`esbuild`, `nx`) may run install scripts. If a new dependency needs one, `pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`; review the package, then run `pnpm approve-builds <pkg>`.
- **`pnpm clean` runs the repo's `clean` script** (`lerna clean`), not pnpm's built-in clean command. To reset installs, delete `node_modules` and `packages/*/node_modules` and run `pnpm install`.
- `pnpm peers check` reports an unmet `conventional-commits-parser` peer inside Lerna's changelog tooling. Those tools are only used for publishing, which this repo doesn't do, so the warning is harmless.
- **Keep a single Vite version.** `app` and `ui` both declare `vite@^8`. Bump them together, and check that `@vitejs/plugin-react` and `@storybook/react-vite` peer ranges allow the new major first.
- **Vite 8 uses Rolldown.** Configure bundler options under `build.rolldownOptions` (the old `rollupOptions` is a deprecated alias). In ESM config files, use `import.meta.dirname` instead of `__dirname`.
- **Storybook 9+ consolidated addons.** Controls, actions, viewport, backgrounds, and interactions are built into `storybook` core. Don't reinstall `@storybook/addon-essentials`, `addon-interactions`, or `@storybook/blocks` (they stopped at 8.6). Doc blocks import from `@storybook/addon-docs/blocks`.
- `build-storybook` warns about a chunk over 500 kB. That's Storybook's own bundle and expected.
- `lerna.json` uses `"version": "independent"`, but every package is `private` and at `0.0.0`. Nothing is published.
- Only `app` has ESLint config. `ui` and `services` are not linted.
- The `ui` build doesn't externalize `@react-vite-mono-starter/services`, so services code gets bundled into `ui/dist`.
- `dist/` and `storybook-static/` are gitignored. Don't commit build output.
- `packages/app/README.md` is the untouched Vite template README, not project docs.
