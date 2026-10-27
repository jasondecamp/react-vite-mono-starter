import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button label="Save" />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('applies variant, size, and extra classes', () => {
    render(<Button label="Save" variant="secondary" size="large" className="extra" />);

    expect(screen.getByRole('button')).toHaveClass('button', 'button--secondary', 'button--large', 'extra');
  });

  it('defaults to primary and medium', () => {
    render(<Button label="Save" />);

    expect(screen.getByRole('button')).toHaveClass('button--primary', 'button--medium');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button label="Save" onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button label="Save" onClick={onClick} disabled />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
