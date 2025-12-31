import axiosInstance from './config/axios';

export const getWebsiteSlides = async (params = {}) => {
  const response = await axiosInstance.get('/website-slides', { params });
  return response;
};

const slidesAPI = {
  getWebsiteSlides,
};

export default slidesAPI;

