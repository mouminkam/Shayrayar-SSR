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

import authAPI from './auth';
import branchesAPI from './branches';
import menuAPI from './menu';
import ordersAPI from './orders';
import customerAPI from './customer';
import couponsAPI from './coupons';
import paymentsAPI from './payments';
import homeAPI from './home';
import notificationsAPI from './notifications';
import deliveryBoyAPI from './deliveryBoy';
import contactAPI from './contact';
import axiosInstance from './config/axios';

// Export all API modules
export {
  authAPI,
  branchesAPI,
  menuAPI,
  ordersAPI,
  customerAPI,
  couponsAPI,
  paymentsAPI,
  homeAPI,
  notificationsAPI,
  deliveryBoyAPI,
  contactAPI,
};

// Export axios instance for direct use if needed
export { default as axiosInstance } from './config/axios';

// Default export with all APIs organized
const api = {
  auth: authAPI,
  branches: branchesAPI,
  menu: menuAPI,
  orders: ordersAPI,
  customer: customerAPI,
  coupons: couponsAPI,
  payments: paymentsAPI,
  home: homeAPI,
  notifications: notificationsAPI,
  deliveryBoy: deliveryBoyAPI,
  contact: contactAPI,
};

export default api;

