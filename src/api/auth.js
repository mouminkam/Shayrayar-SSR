/**
 * Authentication API endpoints
 * Handles user registration, login, logout, profile management, and password reset
 */

import axiosInstance from './config/axios';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.phone - User's phone number
 * @param {string} userData.password - User's password
 * @param {string} userData.password_confirmation - Password confirmation
 * @param {number} userData.branch_id - Branch ID (optional)
 * @returns {Promise<Object>} Response with user data and token
 */
export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response;
};

/**
 * Login user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response with user data and token
 */
export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response;
};

/**
 * Logout user
 * @returns {Promise<Object>} Response confirming logout
 */
export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response;
};

/**
 * Get user profile
 * @returns {Promise<Object>} Response with user profile data
 */
export const getProfile = async () => {
  const response = await axiosInstance.get('/auth/profile');
  return response;
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @param {string} updates.name - Updated name (optional)
 * @param {string} updates.email - Updated email (optional)
 * @param {string} updates.phone - Updated phone (optional)
 * @returns {Promise<Object>} Response with updated user data
 */
export const updateProfile = async (updates) => {
  const response = await axiosInstance.put('/auth/profile', updates);
  return response;
};

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.current_password - Current password
 * @param {string} passwordData.password - New password
 * @param {string} passwordData.password_confirmation - New password confirmation
 * @returns {Promise<Object>} Response confirming password change
 */
export const changePassword = async (passwordData) => {
  const response = await axiosInstance.post('/auth/change-password', passwordData);
  return response;
};

/**
 * Request password reset (sends OTP to email)
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response confirming OTP sent
 */
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', { email });
  return response;
};

/**
 * Reset password with token
 * @param {Object} resetData - Password reset data
 * @param {string} resetData.token - Reset token from email
 * @param {string} resetData.email - User's email address
 * @param {string} resetData.password - New password
 * @param {string} resetData.password_confirmation - New password confirmation
 * @returns {Promise<Object>} Response confirming password reset
 */
export const resetPassword = async (resetData) => {
  const response = await axiosInstance.post('/auth/reset-password', resetData);
  return response;
};

/**
 * Register with phone number (Step 1 of multi-step registration)
 * @param {Object} phoneData - Phone registration data
 * @param {string} phoneData.phone - User's phone number
 * @param {string} phoneData.password - User's password
 * @param {string} phoneData.password_confirmation - Password confirmation
 * @returns {Promise<Object>} Response with verification code sent
 */
export const registerPhone = async (phoneData) => {
  const response = await axiosInstance.post('/auth/register-phone', phoneData);
  return response;
};

/**
 * Verify phone OTP (Step 2 of multi-step registration)
 * @param {Object} verifyData - Verification data
 * @param {string} verifyData.phone - User's phone number
 * @param {string} verifyData.code - OTP code received via SMS
 * @returns {Promise<Object>} Response with token for completing registration
 */
export const verifyPhone = async (verifyData) => {
  const response = await axiosInstance.post('/auth/verify-phone', verifyData);
  return response;
};

/**
 * Complete registration (Step 3 of multi-step registration)
 * @param {Object} userData - User completion data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {number} userData.branch_id - Branch ID
 * @returns {Promise<Object>} Response with user data and token
 */
export const completeRegistration = async (userData) => {
  const response = await axiosInstance.post('/auth/complete-registration', userData);
  return response;
};

/**
 * Get registration branches
 * @param {string} lang - Language code (default: 'ar')
 * @returns {Promise<Object>} Response with branches list for registration
 */
export const getRegistrationBranches = async (lang = 'ar') => {
  const response = await axiosInstance.get('/auth/rbranches', { params: { lang } });
  return response;
};

/**
 * Get Google authentication URL
 * @returns {Promise<Object>} Response with Google OAuth URL and state
 * Response format: { success: true, data: { redirect_url: "...", state: "..." } }
 */
export const getGoogleAuthUrl = async () => {
  const response = await axiosInstance.get('/auth/google');
  return response;
};

/**
 * Call Backend Google OAuth callback endpoint
 * Backend callback URL: https://shahrayar.peaklink.pro/api/v1/auth/google/callback
 * @param {string} code - Authorization code from Google
 * @param {string} state - State parameter for CSRF protection
 * @returns {Promise<Object>} Response with user data and token
 */
export const googleCallback = async (code, state) => {
  // Call Backend callback endpoint with code and state
  // Note: This endpoint is on Backend domain, so we need to use full URL or proxy
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shahrayar.peaklink.pro/api/v1';
  
  // Use axios directly to call Backend callback endpoint
  const response = await axiosInstance.get('/auth/google/callback', {
    params: {
      code,
      state,
    },
  });
  
  return response;
};

/**
 * Login with Google ID token
 * @param {string} idToken - Google ID token from mobile app
 * @returns {Promise<Object>} Response with user data and token
 */
export const googleLogin = async (idToken) => {
  const response = await axiosInstance.post('/auth/google/login', { id_token: idToken });
  return response;
};

// Default export with all auth functions
const authAPI = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  registerPhone,
  verifyPhone,
  completeRegistration,
  getRegistrationBranches,
  getGoogleAuthUrl,
  googleCallback,
  googleLogin,
};

export default authAPI;

