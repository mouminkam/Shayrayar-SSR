import axiosInstance from './config/axios';

export const validateCoupon = async (params) => {
  const response = await axiosInstance.get('/coupons/validate', { params });
  return response;
};

const couponsAPI = {
  validateCoupon,
};

export default couponsAPI;

