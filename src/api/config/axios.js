/**
 * Axios instance configuration with interceptors
 * Handles authentication, error handling, and request/response transformation
 */

import axios from 'axios';

// Get base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shahrayar.peaklink.pro/api/v1';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Get authentication token from localStorage or sessionStorage
 * Token is stored in Zustand persist storage under 'auth-storage'
 * Or in sessionStorage as 'registrationToken' for multi-step registration
 */
const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // First, try to get token from localStorage (normal auth)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      // Token might be stored in state.user.token or directly in state.token
      const token = parsed.state?.user?.token || parsed.state?.token || null;
      if (token) {
        return token;
      }
    }
    
    // If no token in localStorage, check sessionStorage for registration token
    const registrationToken = sessionStorage.getItem('registrationToken');
    if (registrationToken) {
      return registrationToken;
    }
  } catch (error) {
    console.error('Error reading token from storage:', error);
  }
  
  return null;
};

/**
 * Get selected branch ID from localStorage
 * Branch is stored in Zustand persist storage under 'branch-storage'
 */
const getBranchId = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const branchStorage = localStorage.getItem('branch-storage');
    if (branchStorage) {
      const parsed = JSON.parse(branchStorage);
      const selectedBranch = parsed.state?.selectedBranch;
      return selectedBranch?.id || selectedBranch?.branch_id || null;
    }
  } catch (error) {
    console.error('Error reading branch from storage:', error);
  }
  
  return null;
};

/**
 * Get selected language from localStorage
 * Language is stored in localStorage under 'language'
 * Default value: 'bg' (Bulgarian)
 */
const getLanguage = () => {
  if (typeof window === 'undefined') return 'bg';
  
  try {
    const language = localStorage.getItem('language');
    return language || 'bg';
  } catch (error) {
    console.error('Error reading language from storage:', error);
    return 'bg';
  }
};

/**
 * Check if URL should exclude branch_id
 * URLs that don't need branch_id:
 * - /branches (getting all branches - exact match or query params only)
 * - /auth/google/web-login (Google OAuth web login)
 * - /customer/* (customer data)
 * - /notifications/* (notifications)
 */
const shouldExcludeBranchId = (url) => {
  if (!url) return true;
  
  // Remove query params and base URL for matching
  const urlPath = url.split('?')[0].replace(/^https?:\/\/[^\/]+/, '');
  
  // Exact matches
  if (urlPath === '/branches' || urlPath === '/v1/branches' || 
      urlPath === '/branches/default' || urlPath === '/v1/branches/default') {
    return true;
  }
  
  // Pattern matches
  const excludePatterns = [
    '/auth/google/web-login', // Google OAuth web login
    '/customer/', // Customer endpoints
    '/notifications/', // Notifications
    '/payments/stripe/config', // Stripe config (public endpoint, no branch_id needed)
  ];
  
  return excludePatterns.some(pattern => urlPath.includes(pattern));
};

/**
 * Request Interceptor
 * Adds Bearer token, branch_id, and Accept-Language header to all requests if available
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Debug: Log when token is missing for complete-registration
      if (config.url?.includes('complete-registration')) {
        console.warn('No token found for complete-registration request');
        console.log('localStorage auth-storage:', localStorage.getItem('auth-storage'));
        console.log('sessionStorage registrationToken:', sessionStorage.getItem('registrationToken'));
      }
    }
    
    // Add Accept-Language header based on selected language
    const language = getLanguage();
    config.headers['Accept-Language'] = language;
    
    // Remove Content-Type header for FormData to let axios set it automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Add branch_id if available and URL doesn't exclude it
    const branchId = getBranchId();
    // Build full URL for checking (baseURL + url)
    const fullUrl = config.baseURL && config.url 
      ? `${config.baseURL}${config.url.startsWith('/') ? '' : '/'}${config.url}`
      : config.url;
    
    
    if (branchId && !shouldExcludeBranchId(fullUrl)) {
      const method = config.method?.toLowerCase();
      
      if (method === 'get' || method === 'delete') {
        // Add branch_id as query parameter
        config.params = config.params || {};
        if (!config.params.branch_id) {
          config.params.branch_id = branchId;
        }
      } else if (method === 'post' || method === 'put' || method === 'patch') {
        // Add branch_id to request body
        if (config.data instanceof FormData) {
          // If data is FormData, append branch_id
          if (!config.data.has('branch_id')) {
            config.data.append('branch_id', branchId);
          }
        } else if (config.data && typeof config.data === 'object') {
          // If data is already an object, merge branch_id
          if (!config.data.branch_id) {
            config.data = { ...config.data, branch_id: branchId };
          }
        } else if (config.data && typeof config.data === 'string') {
          // If data is a string (JSON), parse it and add branch_id
          try {
            const parsed = JSON.parse(config.data);
            if (!parsed.branch_id) {
              parsed.branch_id = branchId;
              config.data = JSON.stringify(parsed);
            }
          } catch {
            // If parsing fails, create new object
            config.data = JSON.stringify({ branch_id: branchId });
          }
        } else {
          // If no data, create new object with branch_id
          config.data = { branch_id: branchId };
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors globally and transforms responses
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return data directly if response has success: true structure
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    // Handle axios errors
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        // Only redirect if it's not a login/register request (to avoid refresh on login failure)
        const isAuthRequest = error.config?.url?.includes('/auth/login') || 
                             error.config?.url?.includes('/auth/register') ||
                             error.config?.url?.includes('/auth/google');
        
        if (!isAuthRequest && typeof window !== 'undefined') {
          // Clear auth storage
          localStorage.removeItem('auth-storage');
          // Redirect to login page only for authenticated requests
          window.location.href = '/login';
        }
        
        return Promise.reject({
          message: 'Unauthorized - Please login again',
          status: 401,
          data: data,
        });
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        return Promise.reject({
          message: data?.error || data?.message || 'Access forbidden',
          status: 403,
          data: data,
        });
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        return Promise.reject({
          message: data?.error || data?.message || 'Resource not found',
          status: 404,
          data: data,
        });
      }
      
      // Handle 400 Bad Request
      if (status === 400) {
        // Extract error message from different possible locations
        let errorMessage = 'Bad Request';
        if (data?.errors?.error) {
          errorMessage = data.errors.error;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.errors) {
          // If errors is an object, try to extract values
          const errorValues = Object.values(data.errors).flat();
          if (errorValues.length > 0) {
            errorMessage = errorValues.join(', ');
          }
        }
        
        return Promise.reject({
          message: errorMessage,
          status: 400,
          data: data,
          response: error.response,
        });
      }
      
      // Handle 422 Validation Error
      if (status === 422) {
        const errorMessage = data?.errors 
          ? Object.values(data.errors).flat().join(', ')
          : data?.error || data?.message || 'Validation failed';
        
        return Promise.reject({
          message: errorMessage,
          status: 422,
          data: data,
        });
      }
      
      // Handle 500+ Server Errors
      if (status >= 500) {
        return Promise.reject({
          message: data?.error || data?.message || 'Server error. Please try again later.',
          status: status,
          data: data,
        });
      }
      
      // Generic error handling
      const errorMessage = data?.error || data?.message || data?.errors?.error || `API Error: ${error.message}`;
      return Promise.reject({
        message: errorMessage,
        status: status,
        data: data,
        response: error.response,
      });
    }
    
    // Handle network errors
    if (error.request) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: null,
        data: null,
      });
    }
    
    // Handle other errors
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      status: null,
      data: null,
    });
  }
);

export default axiosInstance;

