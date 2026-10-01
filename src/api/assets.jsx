import apiClient from './client';

export const getAssets = async () => {
  const response = await apiClient.get('/Assets');
  return response.data;
};

export const createAsset = async (assetData) => {
  const response = await apiClient.post('/Assets', assetData);
  return response.data;
};

export const updateAsset = async (id, assetData) => {
  const response = await apiClient.put(`/Assets/${id}`, assetData);
  return response.data;
};

export const deleteAsset = async (id) => {
  await apiClient.delete(`/Assets/${id}`);
};
export const markInRepair = async (id) => {
  const response = await apiClient.patch(`/Assets/${id}/mark-in-repair`);
  return response.data;
};

export const markRetired = async (id) => {
  const response = await apiClient.patch(`/Assets/${id}/mark-retired`);
  return response.data;
};

export const markAvailable = async (id) => {
  const response = await apiClient.patch(`/Assets/${id}/mark-available`);
  return response.data;
};