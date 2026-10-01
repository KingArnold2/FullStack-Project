import apiClient from './client';

export const getEmployees = async () => {
  const response = await apiClient.get('/Employee');
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await apiClient.post('/Employee', employeeData);
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await apiClient.put(`/Employee/${id}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (id) => {
  await apiClient.delete(`/Employee/${id}`);
};