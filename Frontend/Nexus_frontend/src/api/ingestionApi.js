import axiosInstance from './axiosInstance';

// Upload and ingest astronomical data files
export const uploadDataFile = async (file, source, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('source', source);

  return axiosInstance.post('/ingestion/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Get ingestion status for a specific job
export const getIngestionStatus = async (jobId) => {
  return axiosInstance.get(`/ingestion/status/${jobId}`);
};

// Get list of all ingestion jobs
export const getIngestionHistory = async (params = {}) => {
  return axiosInstance.get('/ingestion/history', { params });
};

// Preview normalization before confirming
export const previewNormalization = async (fileId) => {
  return axiosInstance.get(`/ingestion/preview/${fileId}`);
};

// Confirm and finalize ingestion
export const confirmIngestion = async (jobId) => {
  return axiosInstance.post(`/ingestion/confirm/${jobId}`);
};

// Cancel an ongoing ingestion
export const cancelIngestion = async (jobId) => {
  return axiosInstance.delete(`/ingestion/cancel/${jobId}`);
};

// Get supported file formats
export const getSupportedFormats = async () => {
  return axiosInstance.get('/ingestion/formats');
};

// Get list of data sources (NASA, ESA, observatories)
export const getDataSources = async () => {
  return axiosInstance.get('/ingestion/sources');
};
