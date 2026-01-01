import axiosInstance from './axiosInstance';

// Get analytics summary
export const getAnalyticsSummary = async () => {
  return axiosInstance.get('/analytics/summary');
};

// Get statistical analysis for a dataset
export const getDatasetStatistics = async (datasetId) => {
  return axiosInstance.get(`/analytics/statistics/${datasetId}`);
};

// Get distribution analysis
export const getDistributionAnalysis = async (datasetId, column) => {
  return axiosInstance.get(`/analytics/distribution/${datasetId}`, {
    params: { column },
  });
};

// Get trend analysis over time
export const getTrendAnalysis = async (params = {}) => {
  return axiosInstance.get('/analytics/trends', { params });
};

// Get correlation analysis between columns
export const getCorrelationAnalysis = async (datasetId, columns) => {
  return axiosInstance.post(`/analytics/correlation/${datasetId}`, { columns });
};

// Get heatmap data
export const getHeatmapData = async (params = {}) => {
  return axiosInstance.get('/analytics/heatmap', { params });
};

// Get ingestion metrics
export const getIngestionMetrics = async (timeRange = '7d') => {
  return axiosInstance.get('/analytics/ingestion-metrics', {
    params: { range: timeRange },
  });
};

// Get source distribution
export const getSourceDistribution = async () => {
  return axiosInstance.get('/analytics/source-distribution');
};

// Get normalization metrics
export const getNormalizationMetrics = async () => {
  return axiosInstance.get('/analytics/normalization-metrics');
};

// Export analytics report
export const exportAnalyticsReport = async (format = 'pdf') => {
  return axiosInstance.get('/analytics/export', {
    params: { format },
    responseType: 'blob',
  });
};
