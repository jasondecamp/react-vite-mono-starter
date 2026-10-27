# packages/ui: component library + Storybook

`@react-vite-mono-starter/ui`. See the root `CLAUDE.md` for how packages connect.

- **Entry:** `src/index.js`. Every public component must be re-exported here. Consumers import `src/` directly (no build needed).
- **Components:** `src/components/<Name>.jsx`, `<Name>.css`, `<Name>.stories.jsx`, kept side by side. Use `Button` as the template:
  - a named-export function component with destructured props and defaults
  - classes built with `classNames` from `@react-vite-mono-starter/services/helpers`, using the pattern `block`, `block--variant`, `block--size`, plus a pass-through `className`
  - CSS imported by the component, so it ships with the component
- **Stories:** CSF3 objects. The default export sets `title: 'Components/<Name>'`, `component`, `tags: ['autodocs']` (auto-generated docs page), and `argTypes` with `select`/`boolean` controls for enum props. Add one named export per meaningful state.
- **Storybook config:** `.storybook/main.js` (stories glob `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` and `../src/**/*.mdx`; addons: `@storybook/addon-docs` and `@storybook/addon-links`; controls, actions, and interactions are built into Storybook 10 core) and `.storybook/preview.js` (control matchers). Add global decorators and styles in `preview.js`.
- **Scripts:** `storybook` (dev, port 6006), `build-storybook` (→ `storybook-static/`), `build` (Vite 8 library mode → `dist/ui.{es,umd}.js` + `dist/ui.css`, with `react`/`react-dom` external via `build.rolldownOptions`).
- React is a regular dependency here. If you ever publish this package, move `react`/`react-dom` to `peerDependencies`.
