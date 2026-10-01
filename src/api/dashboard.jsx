import apiClient from './client';

export const getDashboard = async () => {
  const response = await apiClient.get('/Dashboard');
  return response.data;
};