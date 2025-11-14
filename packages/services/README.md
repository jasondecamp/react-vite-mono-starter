# @react-vite-mono-starter/services

Shared utilities and helper functions for the monorepo.

## Overview

This package contains common utilities and helper functions that can be used across all packages in the monorepo. It does not have its own build process and exports source files directly.

## Structure

- `src/utils/` - General utility functions
- `src/helpers/` - Browser and React-specific helpers

## Usage

### Import everything

```javascript
import { formatDate, capitalize, classNames } from '@react-vite-mono-starter/services';
```

### Import from specific modules

```javascript
import { formatDate, debounce } from '@react-vite-mono-starter/services/utils';
import { classNames, getLocalStorage } from '@react-vite-mono-starter/services/helpers';
```

## Available Functions

### Utils

- `formatDate(date, locale)` - Format dates to readable strings
- `debounce(func, wait)` - Debounce function execution
- `generateId()` - Generate unique IDs
- `capitalize(str)` - Capitalize first letter of string

### Helpers

- `isBrowser()` - Check if running in browser
- `getLocalStorage(key, defaultValue)` - Safe localStorage getter
- `setLocalStorage(key, value)` - Safe localStorage setter
- `removeLocalStorage(key)` - Safe localStorage remover
- `classNames(...args)` - Conditional CSS class name builder
