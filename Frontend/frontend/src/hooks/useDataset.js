import { useState, useCallback } from 'react';
import {
  getDatasets,
  getDatasetById,
  getDatasetMetadata,
  getDatasetPreview,
  downloadDataset,
  compareDatasets,
} from '../api/datasetApi';

/**
 * Custom hook for dataset operations
 * @returns {Object} - Dataset state and methods
 */
export const useDataset = () => {
  const [datasets, setDatasets] = useState([]);
  const [currentDataset, setCurrentDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    source: '',
    objectType: '',
    coordinateSystem: '',
    dateFrom: '',
    dateTo: '',
  });

  // Fetch all datasets with filters
  const fetchDatasets = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDatasets({ ...filters, ...customFilters });
      setDatasets(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch single dataset
  const fetchDataset = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDatasetById(id);
      setCurrentDataset(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get metadata for a dataset
  const fetchMetadata = useCallback(async (id) => {
    try {
      const response = await getDatasetMetadata(id);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Get preview data
  const fetchPreview = useCallback(async (id, limit = 100) => {
    try {
      const response = await getDatasetPreview(id, limit);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Download dataset
  const download = useCallback(async (id, format = 'csv') => {
    try {
      const response = await downloadDataset(id, format);
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dataset_${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Compare two datasets
  const compare = useCallback(async (idA, idB) => {
    setLoading(true);
    setError(null);
    try {
      const response = await compareDatasets(idA, idB);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      source: '',
      objectType: '',
      coordinateSystem: '',
      dateFrom: '',
      dateTo: '',
    });
  }, []);

  return {
    datasets,
    currentDataset,
    loading,
    error,
    filters,
    fetchDatasets,
    fetchDataset,
    fetchMetadata,
    fetchPreview,
    download,
    compare,
    updateFilters,
    clearFilters,
    setCurrentDataset,
  };
};

export default useDataset;
