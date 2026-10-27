import { expect, fn } from 'storybook/test';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // A spy for every story: clicks show in the Actions panel, and play functions can assert on it.
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export const Primary = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    size: 'medium',
  },
  // Interaction test: runs in the Storybook UI and as a Vitest test (`pnpm test`).
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Primary Button' });

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary = {
  args: {
    label: 'Secondary Button',
    variant: 'secondary',
    size: 'medium',
  },
};

export const Small = {
  args: {
    label: 'Small Button',
    size: 'small',
  },
};

export const Large = {
  args: {
    label: 'Large Button',
    size: 'large',
  },
};

export const Disabled = {
  args: {
    label: 'Disabled Button',
    disabled: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Disabled Button' });

    await expect(button).toBeDisabled();
    await userEvent.click(button);

    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
