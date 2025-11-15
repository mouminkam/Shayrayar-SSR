/**
 * API service layer
 * Centralized API communication
 */

// Base API URL - can be configured via environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Create axios instance (if needed in future)
 * For now, using fetch as Next.js 14 recommends
 */

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Example API methods (can be expanded)
export const productService = {
  getAll: () => apiRequest('/products'),
  getById: (id) => apiRequest(`/products/${id}`),
  search: (query) => apiRequest(`/products/search?q=${query}`),
};

export const cartService = {
  get: () => apiRequest('/cart'),
  add: (product) => apiRequest('/cart', { method: 'POST', body: JSON.stringify(product) }),
  remove: (id) => apiRequest(`/cart/${id}`, { method: 'DELETE' }),
};

