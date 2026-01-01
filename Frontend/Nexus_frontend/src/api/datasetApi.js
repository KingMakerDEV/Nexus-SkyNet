import axiosInstance from './axiosInstance';

// Get all datasets with optional filters
export const getDatasets = async (filters = {}) => {
  return axiosInstance.get('/datasets', { params: filters });
};

// Get a single dataset by ID
export const getDatasetById = async (id) => {
  return axiosInstance.get(`/datasets/${id}`);
};

// Get dataset metadata
export const getDatasetMetadata = async (id) => {
  return axiosInstance.get(`/datasets/${id}/metadata`);
};

// Get dataset preview (first N rows)
export const getDatasetPreview = async (id, limit = 100) => {
  return axiosInstance.get(`/datasets/${id}/preview`, { params: { limit } });
};

// Download dataset in specified format
export const downloadDataset = async (id, format = 'csv') => {
  return axiosInstance.get(`/datasets/${id}/download`, {
    params: { format },
    responseType: 'blob',
  });
};

// Delete a dataset
export const deleteDataset = async (id) => {
  return axiosInstance.delete(`/datasets/${id}`);
};

// Get dataset statistics
export const getDatasetStats = async (id) => {
  return axiosInstance.get(`/datasets/${id}/stats`);
};

// Search datasets by query
export const searchDatasets = async (query, filters = {}) => {
  return axiosInstance.get('/datasets/search', {
    params: { q: query, ...filters },
  });
};

// Get available object types
export const getObjectTypes = async () => {
  return axiosInstance.get('/datasets/object-types');
};

// Get coordinate systems
export const getCoordinateSystems = async () => {
  return axiosInstance.get('/datasets/coordinate-systems');
};

// Compare two datasets
export const compareDatasets = async (datasetIdA, datasetIdB) => {
  return axiosInstance.post('/datasets/compare', {
    dataset_a: datasetIdA,
    dataset_b: datasetIdB,
  });
};

// Get objects for sky map visualization
export const getSkyMapObjects = async (filters = {}) => {
  return axiosInstance.get('/datasets/sky-objects', { params: filters });
};
