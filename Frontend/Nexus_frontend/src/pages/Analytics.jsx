import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
  Database,
  Globe,
  Zap,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Analytics = () => {
  const [searchParams] = useSearchParams();
  const datasetId = searchParams.get('dataset');

  const [loading, setLoading] = useState(!!datasetId);
  const [error, setError] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);
  const [datasetStats, setDatasetStats] = useState(null);

  // Fetch dataset-specific visualization
  useEffect(() => {
    if (datasetId) {
      fetchVisualizationData();
    }
  }, [datasetId]);

 const fetchVisualizationData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    // First try to get dataset-specific visualization token
    let token = localStorage.getItem(`viz_token_${datasetId}`);
    let tokenType = 'visualization';
    
    // Fallback to user auth token if no viz token
    if (!token) {
      token = localStorage.getItem('auth_token');
      tokenType = 'user';
    }
    
    console.log('Fetching visualization for dataset:', datasetId);
    console.log('Using token type:', tokenType);
    console.log('Token exists:', !!token);
    
    if (!token) {
      throw new Error('No authentication token available. Please log in again.');
    }
    
    const url = `http://localhost:5000/visualize/${datasetId}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        // If visualization token expired, remove it and try with user token
        if (tokenType === 'visualization') {
          localStorage.removeItem(`viz_token_${datasetId}`);
          // Retry with user token
          return fetchVisualizationData();
        }
        throw new Error('Unauthorized - Please log in again');
      }
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch visualization: ${response.status}`);
    }

    const data = await response.json();
    console.log('Visualization data received:', data);
    
    setVisualizationData(data);
    
    // Extract basic stats from the data
    if (data.data) {
      let recordCount = 0;
      if (data.data.points) recordCount = data.data.points.length;
      else if (data.data.values) recordCount = data.data.values.length;
      else if (data.data.labels) recordCount = data.data.labels.length;
      
      setDatasetStats({
        recordCount,
        chartType: data.visualization_type,
        xAxis: data.axes?.x || data.axes?.category || 'N/A',
        yAxis: data.axes?.y || data.axes?.value || 'N/A'
      });
    }
    
  } catch (err) {
    console.error('Error fetching visualization:', err);
    setError(err.message || 'Failed to load dataset visualization');
  } finally {
    setLoading(false);
  }
};

  const handleRefresh = () => {
    if (datasetId) {
      fetchVisualizationData();
    }
  };

  // Render chart based on visualization type
  const renderChart = () => {
    if (!visualizationData) return null;

    const { visualization_type, data, axes } = visualizationData;

    switch (visualization_type) {
      case 'scatter_plot':
        return (
          <div className="h-[500px] w-full">
            <LineChart
              data={data.points || []}
              xKey="x"
              lines={[{ dataKey: 'y', name: axes?.y || 'Value', color: 'hsl(200, 100%, 60%)' }]}
              height={500}
            />
          </div>
        );

      case 'line_chart':
        return (
          <div className="h-[500px] w-full">
            <LineChart
              data={data.labels?.map((label, i) => ({ 
                label, 
                value: data.values?.[i] || 0 
              })) || []}
              xKey="label"
              lines={[{ dataKey: 'value', name: axes?.y || 'Value', color: 'hsl(200, 100%, 60%)' }]}
              height={500}
            />
          </div>
        );

      case 'bar_chart':
        return (
          <div className="h-[500px] w-full">
            <BarChart
              data={data.labels?.map((label, i) => ({ 
                name: label, 
                value: data.values?.[i] || 0 
              })) || []}
              xKey="name"
              bars={[{ dataKey: 'value', name: axes?.y || 'Count' }]}
              height={500}
              colorByValue
            />
          </div>
        );

      case 'histogram':
        return (
          <div className="h-[500px] w-full">
            <BarChart
              data={data.labels?.map((label, i) => ({ 
                name: label, 
                value: data.values?.[i] || 0 
              })) || []}
              xKey="name"
              bars={[{ dataKey: 'value', name: 'Frequency' }]}
              height={500}
              colorByValue
            />
          </div>
        );

      case 'pie_chart':
        return (
          <div className="flex items-center justify-center h-[500px]">
            <div className="w-[400px] h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={data.labels?.map((label, i) => ({
                      name: label,
                      value: data.values?.[i] || 0
                    })) || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    dataKey="value"
                    label
                  >
                    {(data.labels || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12 text-muted-foreground">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No visualization available for this dataset</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-destructive font-medium">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!datasetId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Database className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No Dataset Selected</h2>
        <p className="text-muted-foreground max-w-md">
          Please upload a dataset first and then click "View Dataset Analytics" to see its visualization.
        </p>
      </div>
    );
  }

  if (!visualizationData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-destructive font-medium">No visualization data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dataset Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Visualizing dataset {datasetId.substring(0, 8)}...
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dataset Stats Cards */}
      {datasetStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-4">
              {datasetStats.recordCount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Records</p>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-4 capitalize">
              {datasetStats.chartType?.replace('_', ' ')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Chart Type</p>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-4">
              {datasetStats.xAxis}
            </p>
            <p className="text-sm text-muted-foreground mt-1">X-Axis / Category</p>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-4">
              {datasetStats.yAxis}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Y-Axis / Value</p>
          </div>
        </div>
      )}

      {/* Main Visualization */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {visualizationData.title || 'Dataset Visualization'}
        </h2>
        {renderChart()}
        
        {/* Axis Information */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">X-Axis: </span>
              <span className="text-foreground font-mono">
                {visualizationData.axes?.x || visualizationData.axes?.category || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Y-Axis: </span>
              <span className="text-foreground font-mono">
                {visualizationData.axes?.y || visualizationData.axes?.value || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;