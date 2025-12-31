import axiosInstance from './config/axios';

export const getTermsConditions = async (locale = 'bg') => {
  const response = await axiosInstance.get('/legal/terms-conditions', {
    params: { locale },
  });
  return response;
};

export const getPrivacyPolicy = async (locale = 'bg') => {
  const response = await axiosInstance.get('/legal/privacy-policy', {
    params: { locale },
  });
  return response;
};

const legalAPI = {
  getTermsConditions,
  getPrivacyPolicy,
};

export default legalAPI;
