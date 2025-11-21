/**
 * Contact API endpoints
 * Handles contact form submissions and contact information
 */

import axiosInstance from './config/axios';

/**
 * Submit contact form
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - Full name
 * @param {string} formData.email - Email address
 * @param {string} formData.phone - Phone number
 * @param {string} formData.subject - Subject/Inquiry type
 * @param {string} formData.message - Message content
 * @returns {Promise<Object>} Response with success status
 */
export const submitContactForm = async (formData) => {
  const response = await axiosInstance.post('/contact', formData);
  return response;
};

// Default export with all contact functions
const contactAPI = {
  submitContactForm,
};

export default contactAPI;

