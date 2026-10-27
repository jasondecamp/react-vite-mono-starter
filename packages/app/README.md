# @react-vite-mono-starter/app

The reference single-page app for this monorepo, built with React and Vite. It consumes components from [`@react-vite-mono-starter/ui`](../ui) and utilities from [`@react-vite-mono-starter/services`](../services).

To add another app, copy this package. The steps are in the root [`CLAUDE.md`](../../CLAUDE.md#add-another-spa-build).

## Scripts

Run these from the repo root:

| Command | What it does |
|---|---|
| `pnpm dev:app` | Start the dev server (http://localhost:5173) |
| `pnpm build:app` | Production build to `dist/` |
| `pnpm --filter @react-vite-mono-starter/app preview` | Serve the production build |
| `pnpm --filter @react-vite-mono-starter/app test` | Run the app's tests |

Linting runs for the whole repo with `pnpm lint`. See the [root README](../../README.md) for setup.
