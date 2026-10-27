// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  classNames,
  getLocalStorage,
  isBrowser,
  removeLocalStorage,
  setLocalStorage,
} from './browser.js';

describe('isBrowser', () => {
  it('is true when window exists', () => {
    expect(isBrowser()).toBe(true);
  });
});

describe('localStorage helpers', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('round-trips JSON values', () => {
    expect(setLocalStorage('user', { name: 'Ada', visits: 3 })).toBe(true);
    expect(getLocalStorage('user')).toEqual({ name: 'Ada', visits: 3 });
  });

  it('returns the default for a missing key', () => {
    expect(getLocalStorage('missing', 'fallback')).toBe('fallback');
  });

  it('returns the default instead of throwing on invalid JSON', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem('broken', '{not json');

    expect(getLocalStorage('broken', 0)).toBe(0);
    expect(console.error).toHaveBeenCalled();
  });

  it('removes a key', () => {
    setLocalStorage('temp', 1);
    expect(removeLocalStorage('temp')).toBe(true);
    expect(getLocalStorage('temp')).toBeNull();
  });
});

describe('classNames', () => {
  it('joins strings and skips falsy values', () => {
    expect(classNames('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('includes object keys whose values are truthy', () => {
    expect(classNames('button', { 'button--active': true, 'button--disabled': false })).toBe(
      'button button--active',
    );
  });

  it('flattens arrays', () => {
    expect(classNames(['a', 'b'], 'c')).toBe('a b c');
  });
});
