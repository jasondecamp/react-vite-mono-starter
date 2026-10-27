# react-vite-mono-starter

Starter template for building a monorepo React app powered by Vite with a Storybook UI library of shared components.

## 🏗️ Structure

This monorepo uses [pnpm workspaces](https://pnpm.io/workspaces) and [Lerna](https://lerna.js.org/) to manage packages:

- **`packages/app`** - React + Vite standalone application
- **`packages/ui`** - React component library with Storybook
- **`packages/services`** - Shared utilities and helper functions (no build step)

## 🚀 Getting Started

### Prerequisites

- Node.js v22.22.2+, v24.15+, or v26+ (required by Lerna 10 and enforced on install; `.nvmrc` selects Node 24)
- pnpm 12 (the exact version is pinned in `package.json` `packageManager`, and pnpm or Corepack fetches it automatically)

### Installation

```bash
# Install dependencies for all packages
pnpm install

# One-time: download the browser that Storybook story tests run in
pnpm --filter @react-vite-mono-starter/ui exec playwright install chromium
```

### Development

```bash
# Run the app in development mode
pnpm dev:app

# Run Storybook for the UI library
pnpm dev:ui

# Lint every package
pnpm lint

# Run all tests (services, ui unit + story tests, app)
pnpm test

# Build all packages
pnpm build

# Build specific packages
pnpm build:app
pnpm build:ui
```

## 📦 Packages

### App (`@react-vite-mono-starter/app`)

A standalone React application built with Vite. The app uses components from the `ui` package.

**Available scripts:**
- `pnpm --filter @react-vite-mono-starter/app dev` - Start development server
- `pnpm --filter @react-vite-mono-starter/app build` - Build for production
- `pnpm --filter @react-vite-mono-starter/app preview` - Preview production build
- `pnpm --filter @react-vite-mono-starter/app test` - Run tests (Vitest + React Testing Library)

### UI Library (`@react-vite-mono-starter/ui`)

A React component library with Storybook for component development and documentation.

**Available scripts:**
- `pnpm --filter @react-vite-mono-starter/ui storybook` - Start Storybook
- `pnpm --filter @react-vite-mono-starter/ui build` - Build the library
- `pnpm --filter @react-vite-mono-starter/ui build-storybook` - Build Storybook for deployment
- `pnpm --filter @react-vite-mono-starter/ui test` - Run component unit tests and every story as a test (headless Chromium)

### Services (`@react-vite-mono-starter/services`)

A shared package containing utilities and helper functions used across the monorepo. This package does not have its own build process and exports source files directly.

**Features:**
- Utility functions (date formatting, debouncing, ID generation, string manipulation)
- Browser helpers (localStorage management, className builder)
- No build step required - imports source files directly
- `pnpm --filter @react-vite-mono-starter/services test` - Run tests

**Usage example:**
```javascript
import { formatDate, classNames } from '@react-vite-mono-starter/services';
// Or import from specific modules
import { debounce } from '@react-vite-mono-starter/services/utils';
import { getLocalStorage } from '@react-vite-mono-starter/services/helpers';
```

## 🛠️ Technologies

- **React 19.3** - UI library
- **Vite 8.3** - Build tool and dev server
- **Lerna 10.1** - Monorepo management
- **pnpm 12 workspaces** - Package installation and linking
- **Storybook 10.6** - Component development environment
- **Vitest 5** + **React Testing Library** - Unit and component tests
- **Playwright** - Runs Storybook stories as tests in headless Chromium
- **ESLint 10** - Code linting (one shared config for all packages)
- **GitHub Actions** - CI runs lint, tests, and builds on every pull request

## 📝 Adding New Components

1. Create your component in `packages/ui/src/components/`
2. Export it from `packages/ui/src/index.js`
3. Create a story file (`.stories.jsx`) for Storybook. Add `play` functions for interactions; every story runs as a test.
4. Add a `.test.jsx` file for edge cases that don't need their own story
5. Use the component in the app by importing from `@react-vite-mono-starter/ui`

## 🤝 Contributing

1. Make your changes in the appropriate package
2. Check them locally with `pnpm lint && pnpm test && pnpm build` (the same checks CI runs)
3. Commit your changes and open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

