/**
 * Delivery API endpoints
 * Handles delivery quote requests
 */

import axiosInstance from './config/axios';

/**
 * Get delivery quote for a dropoff location
 * @param {Object} dropoff - Dropoff location data
 * @param {number} dropoff.lat - Latitude
 * @param {number} dropoff.lng - Longitude
 * @param {string} dropoff.address - Full address string
 * @returns {Promise<Object>} Response with quote_id, fee_bgn, and other quote details
 */
export const getDeliveryQuote = async (dropoff) => {
  const response = await axiosInstance.post('/delivery/quote', {
    dropoff: {
      lat: dropoff.lat,
      lng: dropoff.lng,
      address: dropoff.address,
    },
  });
  return response;
};

// Default export with all delivery functions
const deliveryAPI = {
  getDeliveryQuote,
};

export default deliveryAPI;

