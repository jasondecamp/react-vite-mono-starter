# packages/services: shared utilities

`@react-vite-mono-starter/services`. It has **no build step and no scripts**. Consumers import the source files directly.

- **Subpath exports** (`package.json`): `.` → `src/index.js`, `./utils` → `src/utils/index.js`, `./helpers` → `src/helpers/index.js`.
- `src/utils/`: pure, environment-agnostic functions (`formatDate`, `debounce`, `generateId`, `capitalize` in `common.js`).
- `src/helpers/`: browser-oriented helpers (`isBrowser`, `get/set/removeLocalStorage`, `classNames` in `browser.js`). Guard browser APIs with `isBrowser()`, wrap them in try/catch, and fail soft.
- Each folder's `index.js` re-exports **by name**. The root `src/index.js` does `export *` from both folders, so watch for name collisions between them.
- Use relative imports with explicit `.js` extensions (plain ESM).
- Keep this package free of React and of any dependency on `ui` or `app`. Put shared React hooks or components in `ui`.
- When adding or removing a function, update the list in `README.md`.
