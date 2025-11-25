/**
 * Google OAuth Popup Utility Functions
 * Handles popup window management and postMessage communication
 * 
 * @deprecated This file is deprecated. The new Google OAuth flow uses direct redirect
 * instead of popup windows. See buildGoogleOAuthUrl in authStore.js for the new approach.
 * This file is kept for backward compatibility or potential mobile app usage.
 */

/**
 * Open Google OAuth popup window
 * @param {string} redirectUrl - Google OAuth redirect URL
 * @param {number} width - Popup width (default: 500)
 * @param {number} height - Popup height (default: 600)
 * @returns {Window|null} Popup window reference or null if blocked
 */
export const openGoogleOAuthPopup = (redirectUrl, width = 500, height = 600) => {
  if (typeof window === 'undefined') return null;

  // Calculate center position
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  const popup = window.open(
    redirectUrl,
    'google-oauth',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  // Check if popup was blocked
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    return null;
  }

  return popup;
};

/**
 * Listen for Google OAuth callback message from popup
 * @param {Window} popup - Popup window reference
 * @param {number} timeout - Timeout in milliseconds (default: 5 minutes)
 * @returns {Promise<Object>} Promise that resolves with callback data or rejects on error/timeout
 */
export const listenForGoogleCallback = (popup, timeout = 5 * 60 * 1000) => {
  return new Promise((resolve, reject) => {
    if (!popup) {
      reject(new Error('Popup window is not available'));
      return;
    }

    let timeoutId;
    let intervalId;

    // Check if popup is closed manually
    intervalId = setInterval(() => {
      if (popup.closed) {
        clearInterval(intervalId);
        if (timeoutId) clearTimeout(timeoutId);
        window.removeEventListener('message', messageHandler);
        reject(new Error('Popup was closed by user'));
      }
    }, 1000);

    // Set timeout
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      window.removeEventListener('message', messageHandler);
      if (popup && !popup.closed) {
        popup.close();
      }
      reject(new Error('OAuth timeout - please try again'));
    }, timeout);

    // Listen for postMessage from popup
    const messageHandler = (event) => {
      // Security: Verify origin
      // Note: In development, allow localhost. In production, use your domain
      const allowedOrigins = [
        window.location.origin,
        'http://localhost:3000',
        'https://shahrayar.peaklink.pro',
      ];

      if (!allowedOrigins.includes(event.origin)) {
          // Ignore messages from unauthorized origins
        return;
      }

      // Only handle our specific message types
      if (!event.data || typeof event.data !== 'object') {
        return;
      }

      if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        window.removeEventListener('message', messageHandler);
        
        try {
          if (popup && !popup.closed) {
            popup.close();
          }
        } catch {
          // Ignore close errors
        }

        resolve(event.data.data);
      } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        window.removeEventListener('message', messageHandler);
        
        try {
          if (popup && !popup.closed) {
            popup.close();
          }
        } catch {
          // Ignore close errors
        }

        reject(new Error(event.data.error || 'Google authentication failed'));
      }
      // Don't return true - this causes the error
    };

    window.addEventListener('message', messageHandler, false);
  });
};

/**
 * Wait for popup to complete OAuth flow
 * Since we can't read URL from different domain (CORS/Cross-Origin-Opener-Policy),
 * we listen for postMessage from popup or use timeout as fallback
 * @param {Window} popup - Popup window reference
 * @param {number} timeout - Timeout in milliseconds (default: 30 seconds)
 * @returns {Promise<{code: string, state: string}>} Promise that resolves with code and state or rejects on error/timeout
 */
export const pollPopupUrl = (popup, timeout = 30 * 1000) => {
  return new Promise((resolve, reject) => {
    if (!popup) {
      reject(new Error('Popup window is not available'));
      return;
    }

    let timeoutId;
    let messageHandler;
    let resolved = false;

    // Cleanup function
    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (messageHandler) {
        window.removeEventListener('message', messageHandler);
      }
    };

    // Set timeout - if no message received, reject
    timeoutId = setTimeout(() => {
      if (!resolved) {
        cleanup();
        try {
          if (popup && !popup.closed) {
            popup.close();
          }
        } catch {
          // Ignore close errors
        }
        reject(new Error('OAuth timeout - please try again'));
      }
    }, timeout);

    // Listen for postMessage from popup (if Backend sends it)
    messageHandler = (event) => {
      // Security: Verify origin
      const allowedOrigins = [
        window.location.origin,
        'http://localhost:3000',
        'https://shahrayar.peaklink.pro',
      ];

      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      // Only handle our specific message types
      if (!event.data || typeof event.data !== 'object') {
        return;
      }

      if (event.data.type === 'GOOGLE_OAUTH_CALLBACK_URL') {
        // Backend sent callback URL with code and state
        const url = new URL(event.data.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');

        if (error) {
          resolved = true;
          cleanup();
          reject(new Error(`Google authentication failed: ${error}`));
          return;
        }

        if (code && state) {
          resolved = true;
          cleanup();
          resolve({ code, state });
          return;
        }
      } else if (event.data.type === 'GOOGLE_OAUTH_DATA') {
        // Backend sent user data directly (better approach)
        if (event.data.error) {
          resolved = true;
          cleanup();
          reject(new Error(event.data.error));
          return;
        }

        if (event.data.code && event.data.state) {
          resolved = true;
          cleanup();
          resolve({ code: event.data.code, state: event.data.state });
          return;
        }
      }
    };

    window.addEventListener('message', messageHandler, false);

    // Note: We can't check popup.closed or read popup.location.href due to CORS
    // We rely on postMessage from Backend or timeout
  });
};

/**
 * Close popup window
 * @param {Window|null} popup - Popup window reference
 */
export const closePopup = (popup) => {
  if (popup && !popup.closed) {
    popup.close();
  }
};

