import axiosInstance from './axiosInstance';

// Run AI analysis on datasets
export const runAIAnalysis = async (datasetIds = [], analysisType = 'full') => {
  return axiosInstance.post('/ai/analyze', {
    dataset_ids: datasetIds,
    analysis_type: analysisType,
  });
};

// Get AI analysis status
export const getAnalysisStatus = async (jobId) => {
  return axiosInstance.get(`/ai/status/${jobId}`);
};

// Get AI analysis results
export const getAnalysisResults = async (jobId) => {
  return axiosInstance.get(`/ai/results/${jobId}`);
};

// Detect anomalies in dataset
export const detectAnomalies = async (datasetId, params = {}) => {
  return axiosInstance.post(`/ai/anomalies/${datasetId}`, params);
};

// Find outliers in dataset
export const findOutliers = async (datasetId, columns = []) => {
  return axiosInstance.post(`/ai/outliers/${datasetId}`, { columns });
};

// Discover patterns in data
export const discoverPatterns = async (datasetIds = []) => {
  return axiosInstance.post('/ai/patterns', { dataset_ids: datasetIds });
};

// Get AI-generated insights
export const getAIInsights = async (datasetId) => {
  return axiosInstance.get(`/ai/insights/${datasetId}`);
};

// Get AI recommendations
export const getRecommendations = async () => {
  return axiosInstance.get('/ai/recommendations');
};

// Ask AI a question about the data
export const askAI = async (question, context = {}) => {
  return axiosInstance.post('/ai/ask', { question, context });
};

// Get discovery history
export const getDiscoveryHistory = async (limit = 10) => {
  return axiosInstance.get('/ai/history', { params: { limit } });
};

