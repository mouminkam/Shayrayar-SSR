/**
 * Branches API endpoints
 * Handles branch information, nearest branches, and delivery availability
 */

import axiosInstance from './config/axios';

/**
 * Get all branches
 * @param {Object} params - Query parameters
 * @param {number} params.latitude - Latitude for location-based search (optional)
 * @param {number} params.longitude - Longitude for location-based search (optional)
 * @param {number} params.radius - Search radius in km (optional)
 * @param {string} params.city - Filter by city (optional)
 * @param {string} params.country - Filter by country (optional)
 * @returns {Promise<Object>} Response with branches list
 */
export const getAllBranches = async (params = {}) => {
  const response = await axiosInstance.get('/branches', { params });
  return response;
};

/**
 * Get specific branch by ID
 * @param {number} branchId - Branch ID
 * @returns {Promise<Object>} Response with branch details
 */
export const getBranchById = async (branchId) => {
  const response = await axiosInstance.get(`/branches/${branchId}`);
  return response;
};

/**
 * Get upsell items for a branch
 * @param {number} branchId - Branch ID
 * @param {Object} params - Query parameters
 * @param {string} params.type - Filter by item type (optional: drink, dessert, sauce, addon, etc.)
 * @returns {Promise<Object>} Response with upsell items list
 */
export const getUpsellItems = async (branchId, params = {}) => {
  const response = await axiosInstance.get(`/branches/${branchId}/upsell-items`, { params });
  return response;
};

/**
 * Get chefs for a branch
 * @param {number} branchId - Branch ID
 * @returns {Promise<Object>} Response with chefs list
 */
export const getChefs = async (branchId) => {
  const response = await axiosInstance.get('/chefs', { 
    params: { branch_id: branchId } 
  });
  return response;
};

/**
 * Get default branch (main branch)
 * @returns {Promise<Object>} Response with default branch data
 */
export const getDefaultBranch = async () => {
  const response = await axiosInstance.get('/branches/default');
  return response;
};

// Default export with all branch functions
const branchesAPI = {
  getAllBranches,
  getBranchById,
  getUpsellItems,
  getChefs,
  getDefaultBranch,
};

export default branchesAPI;

