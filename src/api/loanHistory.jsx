import apiClient from './client';

export const getLoanHistory = async (action) => {
  const params = action ? { action } : {};
  const response = await apiClient.get('/LoanHistory', { params });
  return response.data;
};