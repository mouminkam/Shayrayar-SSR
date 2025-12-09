/**
 * Test helper functions
 * دوال مساعدة للاختبار
 */

import { render } from '@testing-library/react';
import { LanguageProvider } from '../../context/LanguageContext';
import { HighlightsProvider } from '../../context/HighlightsContext';

/**
 * Render component with all providers
 * @param {React.Component} component - Component to render
 * @param {Object} options - Render options
 */
export function renderWithProviders(component, options = {}) {
  return render(
    <LanguageProvider>
      <HighlightsProvider>
        {component}
      </HighlightsProvider>
    </LanguageProvider>,
    options
  );
}

/**
 * Wait for async operations
 * @param {number} ms - Milliseconds to wait
 */
export function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
}

/**
 * Create mock axios response
 * @param {Object} data - Response data
 * @param {number} status - HTTP status code
 */
export function createMockAxiosResponse(data, status = 200) {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  };
}

/**
 * Create mock axios error
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 */
export function createMockAxiosError(message, status = 400) {
  return {
    message,
    response: {
      data: {
        success: false,
        message,
      },
      status,
    },
  };
}

