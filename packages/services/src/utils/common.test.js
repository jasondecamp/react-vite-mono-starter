import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { capitalize, debounce, formatDate, generateId } from './common.js';

describe('formatDate', () => {
  it('formats a Date as a long US date by default', () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe('January 15, 2024');
  });

  it('accepts a locale', () => {
    expect(formatDate(new Date(2024, 0, 15), 'de-DE')).toBe('15. Januar 2024');
  });
});

describe('capitalize', () => {
  it('uppercases the first letter only', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('returns an empty string for empty input', () => {
    expect(capitalize('')).toBe('');
    expect(capitalize(undefined)).toBe('');
  });
});

describe('generateId', () => {
  it('returns a v4 UUID', () => {
    expect(generateId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('returns a different value each call', () => {
    expect(generateId()).not.toBe(generateId());
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the function once, with the last arguments, after the wait', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('a');
    debounced('b');
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('b');
  });
});
