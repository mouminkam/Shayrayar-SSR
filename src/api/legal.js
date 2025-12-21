/**
 * Legal API endpoints
 * Handles Terms & Conditions and Privacy Policy content
 */

import axiosInstance from './config/axios';

/**
 * Get Terms & Conditions content
 * @param {string} locale - Language code (e.g., 'en', 'bg')
 * @returns {Promise<Object>} Response with terms and conditions data
 */
export const getTermsConditions = async (locale = 'en') => {
  const response = await axiosInstance.get('/legal/terms-conditions', {
    params: { locale },
  });
  return response;
};

/**
 * Get Privacy Policy content
 * @param {string} locale - Language code (e.g., 'en', 'bg')
 * @returns {Promise<Object>} Response with privacy policy data
 */
export const getPrivacyPolicy = async (locale = 'en') => {
  const response = await axiosInstance.get('/legal/privacy-policy', {
    params: { locale },
  });
  return response;
};

// Default export with all legal functions
const legalAPI = {
  getTermsConditions,
  getPrivacyPolicy,
};

export default legalAPI;
