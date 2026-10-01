import apiClient from './client';

export const getCategories = async () => {
  const response = await apiClient.get('/Categories');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await apiClient.post('/Categories', categoryData);
  return response.data;
};
export const updateCategory = async (id, categoryData) => {
  const response = await apiClient.put(`/Categories/${id}`, categoryData);
  return response.data;
};
export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/Categories/${id}`);

};