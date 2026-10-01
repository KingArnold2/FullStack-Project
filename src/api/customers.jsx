import apiClient from "./client";

export const getCustomers = async () => {
  const response = await apiClient.get("/Customer");
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await apiClient.post("/Customer", customerData);
  return response.data;
};

export const updateCustomer = async (id, customerData) => {
  const response = await apiClient.put(`/Customer/${id}`, customerData);
  return response.data;
};

export const deleteCustomer = async (id) => {
  await apiClient.delete(`/Customer/${id}`);
};