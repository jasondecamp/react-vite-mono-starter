# packages/ui: component library + Storybook

`@react-vite-mono-starter/ui`. See the root `CLAUDE.md` for how packages connect.

- **Entry:** `src/index.js`. Every public component must be re-exported here. Consumers import `src/` directly (no build needed).
- **Components:** `src/components/<Name>.jsx`, `<Name>.css`, `<Name>.stories.jsx`, and `<Name>.test.jsx`, kept side by side. Use `Button` as the template:
  - a named-export function component with destructured props and defaults
  - classes built with `classNames` from `@react-vite-mono-starter/services/helpers`, using the pattern `block`, `block--variant`, `block--size`, plus a pass-through `className`
  - CSS imported by the component, so it ships with the component
- **Stories:** CSF3 objects. The default export sets `title: 'Components/<Name>'`, `component`, `tags: ['autodocs']` (auto-generated docs page), `argTypes` with `select`/`boolean` controls for enum props, and `args` with a `fn()` spy (from `storybook/test`) for every callback prop. Add one named export per meaningful state.
- **Stories are tests.** `pnpm test` renders every story in headless Chromium (Vitest project `storybook`), so a story that throws fails. Add a `play: async ({ args, canvas, userEvent }) => { ... }` function to turn a story into an interaction test. Query with `canvas.getByRole(...)`, and assert with `await expect(...)` from `storybook/test` (see `Primary` and `Disabled` in `Button.stories.jsx`). The same tests run from the test panel in the Storybook UI.
- **Unit tests:** `<Name>.test.jsx` for edge cases that don't deserve a story (Vitest project `unit`, jsdom + React Testing Library; `vitest.setup.js` adds jest-dom matchers and cleanup). Run one project with `pnpm exec vitest run --project unit` or `--project storybook` from this directory.
- **Storybook config:** `.storybook/main.js` (stories glob `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` and `../src/**/*.mdx`; addons: `@storybook/addon-docs`, `@storybook/addon-links`, and `@storybook/addon-vitest`; controls, actions, and interactions are built into Storybook 10 core) and `.storybook/preview.js` (control matchers). Add global decorators and styles in `preview.js`. `storySort` in `preview.js` pins `Introduction` first, then `Components`; add new top-level sidebar groups to that order.
- **Docs pages:** `src/Introduction.mdx` is the Storybook landing page. MDX pages use `<Meta title="..." />` and doc blocks from `@storybook/addon-docs/blocks` (e.g. `<Canvas of={Stories.Primary} />` to embed a live story). Keep it current when the component workflow changes. In MDX, `{` and `<` in prose are parsed as JSX; put them in backticks or code fences.
- **`vite.config.js`** holds both the library build config and the Vitest `test.projects` (`unit`, `storybook`). `extends: true` makes each project inherit the React plugin.
- **Scripts:** `storybook` (dev, port 6006), `test` (both Vitest projects; needs Chromium once: `pnpm exec playwright install chromium`), `build-storybook` (→ `storybook-static/`), `build` (Vite 8 library mode → `dist/ui.{es,umd}.js` + `dist/ui.css`, with `react`/`react-dom` external via `build.rolldownOptions`).
- React is a regular dependency here. If you ever publish this package, move `react`/`react-dom` to `peerDependencies`.
