import axiosInstance from './config/axios';

export const getAllBranches = async (params = {}) => {
  const response = await axiosInstance.get('/branches', { params });
  return response;
};

export const getBranchById = async (branchId) => {
  const response = await axiosInstance.get(`/branches/${branchId}`);
  return response;
};

export const getUpsellItems = async (branchId, params = {}) => {
  const response = await axiosInstance.get(`/branches/${branchId}/upsell-items`, { params });
  return response;
};

export const getChefs = async (branchId) => {
  const response = await axiosInstance.get('/chefs', { 
    params: { branch_id: branchId } 
  });
  return response;
};

export const getDefaultBranch = async () => {
  const response = await axiosInstance.get('/branches/default');
  return response;
};

const branchesAPI = {
  getAllBranches,
  getBranchById,
  getUpsellItems,
  getChefs,
  getDefaultBranch,
};

export default branchesAPI;

