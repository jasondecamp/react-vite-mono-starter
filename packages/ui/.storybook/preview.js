/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      // Show the Introduction docs page first in the sidebar.
      storySort: {
        order: ['Introduction', 'Components'],
      },
    },
  },
};

export default preview;
