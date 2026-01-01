import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading, error, and refetch capabilities
 * @param {Function} fetchFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useFetch = (fetchFunction, options = {}) => {
  const {
    immediate = true,
    initialData = null,
    onSuccess,
    onError,
    dependencies = [],
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchFunction(...args);
        const result = response.data;
        setData(result);
        if (onSuccess) {
          onSuccess(result);
        }
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        if (onError) {
          onError(err);
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, onSuccess, onError]
  );

  const refetch = useCallback((...args) => execute(...args), [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [...dependencies, immediate]);

  return {
    data,
    loading,
    error,
    refetch,
    setData,
  };
};

export default useFetch;
