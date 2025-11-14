# react-vite-mono-starter

Starter template for building a monorepo React app powered by Vite with a Storybook UI library of shared components.

## 🏗️ Structure

This monorepo uses [Lerna](https://lerna.js.org/) and Yarn Workspaces to manage packages:

- **`packages/app`** - React + Vite standalone application
- **`packages/ui`** - React component library with Storybook

## 🚀 Getting Started

### Prerequisites

- Node.js v20 or higher
- Yarn v1.22 or higher

### Installation

```bash
# Install dependencies for all packages
yarn install
```

### Development

```bash
# Run the app in development mode
yarn dev:app

# Run Storybook for the UI library
yarn dev:ui

# Build all packages
yarn build

# Build specific packages
yarn build:app
yarn build:ui
```

## 📦 Packages

### App (`@react-vite-mono-starter/app`)

A standalone React application built with Vite. The app uses components from the `ui` package.

**Available scripts:**
- `yarn workspace @react-vite-mono-starter/app dev` - Start development server
- `yarn workspace @react-vite-mono-starter/app build` - Build for production
- `yarn workspace @react-vite-mono-starter/app preview` - Preview production build
- `yarn workspace @react-vite-mono-starter/app lint` - Run ESLint

### UI Library (`@react-vite-mono-starter/ui`)

A React component library with Storybook for component development and documentation.

**Available scripts:**
- `yarn workspace @react-vite-mono-starter/ui storybook` - Start Storybook
- `yarn workspace @react-vite-mono-starter/ui build` - Build the library
- `yarn workspace @react-vite-mono-starter/ui build-storybook` - Build Storybook for deployment

## 🛠️ Technologies

- **React 19.2** - UI library
- **Vite 7.2 / 5.4** - Build tool and dev server
- **Lerna 8.1** - Monorepo management
- **Yarn Workspaces** - Package linking
- **Storybook 8.6** - Component development environment
- **ESLint** - Code linting

## 📝 Adding New Components

1. Create your component in `packages/ui/src/components/`
2. Export it from `packages/ui/src/index.js`
3. Create a story file (`.stories.jsx`) for Storybook
4. Use the component in the app by importing from `@react-vite-mono-starter/ui`

## 🤝 Contributing

1. Make your changes in the appropriate package
2. Test locally using the dev scripts
3. Build to ensure no errors
4. Commit your changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

