import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.js'),
      name: 'ReactViteMonoStarterUI',
      fileName: (format) => `ui.${format}.js`,
    },
    rolldownOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  test: {
    projects: [
      {
        // Component unit tests (*.test.jsx) in jsdom.
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.{js,jsx}'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.js'],
        },
      },
      {
        // Every story is a smoke test; stories with a `play` function are interaction tests.
        // Runs in headless Chromium. See https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
        extends: true,
        plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
