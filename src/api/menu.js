import axiosInstance from './config/axios';

export const getMenuCategories = async (params = {}) => {
  const response = await axiosInstance.get('/menu-categories', { params });
  return response;
};

export const getMenuItems = async (params = {}) => {
  const response = await axiosInstance.get('/menu-items', { params });
  return response;
};

export const getMenuItemById = async (itemId) => {
  const response = await axiosInstance.get(`/menu-items/${itemId}`);
  return response;
};

export const getHighlights = async (params) => {
  const response = await axiosInstance.get('/menu-items/highlights', { params });
  return response;
};

const menuAPI = {
  getMenuCategories,
  getMenuItems,
  getMenuItemById,
  getHighlights,
};

export default menuAPI;

