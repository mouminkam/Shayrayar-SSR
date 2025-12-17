/**
 * Slides API endpoints
 * Handles banner slides for home page
 */

import axiosInstance from './config/axios';

/**
 * Get website slides
 * @param {Object} params - Query parameters
 * @param {number} params.branch_id - Branch ID (optional, added automatically by interceptor)
 * @returns {Promise<Object>} Response with website slides list
 */
export const getWebsiteSlides = async (params = {}) => {
  const response = await axiosInstance.get('/website-slides', { params });
  return response;
};

// Default export with all slides functions
const slidesAPI = {
  getWebsiteSlides,
};

export default slidesAPI;

