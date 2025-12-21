/**
 * API Index - Central export for all API modules
 * Import from this file to access all API endpoints
 *
 * Usage:
 * import api from '@/api';
 * const response = await api.auth.login(email, password);
 *
 * Or import specific modules:
 * import { authAPI, menuAPI } from '@/api';
 */

import authAPI from "./auth";
import branchesAPI from "./branches";
import menuAPI from "./menu";
import ordersAPI from "./orders";
import couponsAPI from "./coupons";
import paymentsAPI from "./payments";
import deliveryAPI from "./delivery";
import slidesAPI from "./slides";
import legalAPI from "./legal";
import axiosInstance from "./config/axios";

// Export all API modules
export {
  authAPI,
  branchesAPI,
  menuAPI,
  ordersAPI,
  couponsAPI,
  paymentsAPI,
  deliveryAPI,
  slidesAPI,
  legalAPI,
};

// Export axios instance for direct use if needed
export { default as axiosInstance } from "./config/axios";

// Default export with all APIs organized
const api = {
  auth: authAPI,
  branches: branchesAPI,
  menu: menuAPI,
  orders: ordersAPI,
  coupons: couponsAPI,
  payments: paymentsAPI,
  delivery: deliveryAPI,
  slides: slidesAPI,
  legal: legalAPI,
};

export default api;
