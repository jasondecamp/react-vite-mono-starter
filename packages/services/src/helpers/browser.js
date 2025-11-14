/**
 * Check if code is running in browser environment
 * @returns {boolean} True if in browser
 */
export const isBrowser = () => {
  return typeof window !== 'undefined';
};

/**
 * Get value from localStorage
 * @param {string} key - The key to retrieve
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} The stored value or default
 */
export const getLocalStorage = (key, defaultValue = null) => {
  if (!isBrowser()) return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set value in localStorage
 * @param {string} key - The key to set
 * @param {*} value - The value to store
 * @returns {boolean} True if successful
 */
export const setLocalStorage = (key, value) => {
  if (!isBrowser()) return false;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove value from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} True if successful
 */
export const removeLocalStorage = (key) => {
  if (!isBrowser()) return false;
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Class name helper for conditional CSS classes
 * @param {...(string|Object|Array)} args - Class names or objects/arrays of classes
 * @returns {string} Combined class names
 */
export const classNames = (...args) => {
  return args
    .flat()
    .filter(Boolean)
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object' && !Array.isArray(arg)) {
        return Object.keys(arg)
          .filter((key) => arg[key])
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
};
