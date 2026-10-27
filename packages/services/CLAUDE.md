# packages/services: shared utilities

`@react-vite-mono-starter/services`. It has **no build step**; its only script is `test`. Consumers import the source files directly.

- **Subpath exports** (`package.json`): `.` → `src/index.js`, `./utils` → `src/utils/index.js`, `./helpers` → `src/helpers/index.js`.
- `src/utils/`: pure, environment-agnostic functions (`formatDate`, `debounce`, `generateId`, `capitalize` in `common.js`).
- `src/helpers/`: browser-oriented helpers (`isBrowser`, `get/set/removeLocalStorage`, `classNames` in `browser.js`). Guard browser APIs with `isBrowser()`, wrap them in try/catch, and fail soft.
- Each folder's `index.js` re-exports **by name**. The root `src/index.js` does `export *` from both folders, so watch for name collisions between them.
- Use relative imports with explicit `.js` extensions (plain ESM).
- Keep this package free of React and of any dependency on `ui` or `app`. Put shared React hooks or components in `ui`.
- **Tests:** `<module>.test.js` next to each module, using Vitest's default Node environment. A test file that needs `window`/`localStorage` starts with `// @vitest-environment jsdom` (see `helpers/browser.test.js`). Use `vi.useFakeTimers()` for timing code like `debounce`. Run with `pnpm --filter @react-vite-mono-starter/services test`.
- When adding or removing a function, add or remove its tests and update the list in `README.md`.
