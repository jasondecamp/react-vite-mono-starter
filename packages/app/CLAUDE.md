# packages/app: SPA build

`@react-vite-mono-starter/app`, the reference SPA. Copy this package to create additional builds (steps in the root `CLAUDE.md`).

- `index.html` is Vite's entry. It loads `/src/main.jsx`, which mounts `<App />` in `StrictMode` on `#root`.
- `src/App.jsx` is a demo that shows how to consume the shared packages: `Button` from `@react-vite-mono-starter/ui`, and `formatDate`, `capitalize`, and the localStorage helpers from `@react-vite-mono-starter/services`. Replace it freely.
- Static assets: `public/` is served from `/`; `src/assets/` holds imported, hashed assets.
- `vite.config.js` is minimal (only `@vitejs/plugin-react`). There is no router, state library, or env handling yet. Vite exposes `import.meta.env.VITE_*` variables from `.env*` files, and `.env*` files are gitignored.
- **Lint:** `pnpm --filter @react-vite-mono-starter/app lint`. The ESLint 10 flat config enables recommended rules, react-hooks, and react-refresh (Vite). `no-unused-vars` ignores names that start with an uppercase letter or `_`.
- Code style: no semicolons, single quotes (Vite template style).
