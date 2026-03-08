import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle, // ✅ Add this import
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom'; // ✅ Add this
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  getIngestionMetrics,
  getSourceDistribution,
  getNormalizationMetrics,
  getAnalyticsSummary,
} from '../api/analyticsApi';

const Analytics = () => {
  const [searchParams] = useSearchParams(); // ✅ Get dataset ID from URL
  const datasetId = searchParams.get('dataset');

  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null); // ✅ For dataset-specific visualization

  // State for fetched data
  const [ingestionTrend, setIngestionTrend] = useState([]);
  const [sourceDistribution, setSourceDistribution] = useState([]);
  const [objectTypeDistribution, setObjectTypeDistribution] = useState([]);
  const [normalizationStats, setNormalizationStats] = useState([]);
  const [processingMetrics, setProcessingMetrics] = useState({});
  const [dataQuality, setDataQuality] = useState({});
  const [storageUsage, setStorageUsage] = useState({});

  const timeRanges = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ];

  // Fetch dataset-specific visualization if datasetId is provided
  useEffect(() => {
    if (datasetId) {
      fetchVisualizationData();
    }
  }, [datasetId]);

  const fetchVisualizationData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/visualize/${datasetId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch visualization');
      const data = await response.json();
      setVisualizationData(data);
    } catch (err) {
      console.error('Error fetching visualization:', err);
      setError('Could not load dataset visualization.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch overall analytics (if endpoints exist)
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        metricsRes,
        sourcesRes,
        normRes,
        summaryRes,
      ] = await Promise.allSettled([ // Use allSettled to avoid failing all if one endpoint is missing
        getIngestionMetrics({ range: timeRange }),
        getSourceDistribution(),
        getNormalizationMetrics(),
        getAnalyticsSummary(),
      ]);

      // Process each response if fulfilled
      if (metricsRes.status === 'fulfilled') {
        const metrics = metricsRes.value.data;
        setIngestionTrend(metrics.ingestionTrends?.map(item => ({
          date: item.date,
          datasets: item.datasets,
          objects: item.objects,
        })) || []);
      } else {
        console.warn('Ingestion metrics endpoint failed, using fallback');
      }

      if (sourcesRes.status === 'fulfilled') {
        const sources = sourcesRes.value.data;
        setSourceDistribution(sources.map(s => ({
          name: s.name,
          value: s.count,
          color: getSourceColor(s.name),
        })) || []);
      } else {
        console.warn('Source distribution endpoint failed');
      }

      if (normRes.status === 'fulfilled') {
        const norm = normRes.value.data;
        setNormalizationStats([
          {
            metric: 'Coordinate Conversions',
            value: norm.coordinateConversions?.toLocaleString() || '0',
            change: norm.coordinateChange || '+0%',
            trend: 'up',
          },
          // ... other stats
        ]);
      } else {
        console.warn('Normalization metrics endpoint failed');
      }

      if (summaryRes.status === 'fulfilled') {
        const summary = summaryRes.value.data;
        setObjectTypeDistribution(summary.objectTypes?.map(item => ({
          type: item.type,
          count: item.count,
        })) || []);
        setProcessingMetrics({
          ingestionRate: summary.ingestionRate || '0/hr',
          normalizationTime: summary.normalizationTime || '0s',
          storageWrite: summary.storageWrite || '0 MB/s',
          ingestionPercent: summary.ingestionPercent || 0,
          normPercent: summary.normPercent || 0,
          storagePercent: summary.storagePercent || 0,
        });
        setDataQuality({
          valid: summary.validPercentage || 0,
          warnings: summary.warningsPercentage || 0,
          errors: summary.errorsPercentage || 0,
          duplicates: summary.duplicatesPercentage || 0,
        });
        setStorageUsage({
          used: summary.usedStorage || 0,
          available: summary.availableStorage || 0,
          total: summary.totalStorage || 0,
          usedPercent: summary.usedPercent || 0,
        });
      } else {
        console.warn('Analytics summary endpoint failed');
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSourceColor = (name) => {
    const colors = {
      'NASA': '#3B82F6',
      'ESA': '#8B5CF6',
      'Hubble': '#F59E0B',
      'JWST': '#EF4444',
      'Gaia': '#EC4899',
      'Other': '#6B7280',
    };
    return colors[name] || '#6B7280';
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  const StatCard = ({ icon: Icon, label, value, change, trend, color }) => (
    <div className="glass rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground mt-4">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );

  if (loading && !visualizationData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !visualizationData) {
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {datasetId ? `Visualizing dataset ${datasetId}` : 'Statistical insights and processing metrics'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time range selector (only show if not viewing a single dataset) */}
          {!datasetId && (
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dataset-specific visualization */}
      {visualizationData && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">{visualizationData.title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Render chart based on visualization_type */}
            {visualizationData.visualization_type === 'scatter_plot' && (
              <div className="col-span-2">
                <LineChart
                  data={visualizationData.data.points.map(p => ({ x: p.x, y: p.y }))}
                  xKey="x"
                  lines={[{ dataKey: 'y', name: visualizationData.axes.y, color: 'hsl(200, 100%, 60%)' }]}
                  height={400}
                />
              </div>
            )}
            {visualizationData.visualization_type === 'line_chart' && (
              <div className="col-span-2">
                <LineChart
                  data={visualizationData.data.labels.map((label, i) => ({ label, value: visualizationData.data.values[i] }))}
                  xKey="label"
                  lines={[{ dataKey: 'value', name: visualizationData.axes.y || 'Value', color: 'hsl(200, 100%, 60%)' }]}
                  height={400}
                />
              </div>
            )}
            {visualizationData.visualization_type === 'bar_chart' && (
              <div className="col-span-2">
                <BarChart
                  data={visualizationData.data.labels.map((label, i) => ({ name: label, value: visualizationData.data.values[i] }))}
                  xKey="name"
                  bars={[{ dataKey: 'value', name: visualizationData.axes.y || 'Count' }]}
                  height={400}
                />
              </div>
            )}
            {/* Add more chart types as needed */}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            X: {visualizationData.axes.x || visualizationData.axes.category || 'N/A'} | Y: {visualizationData.axes.y || visualizationData.axes.value || 'N/A'}
          </p>
        </div>
      )}

      {/* Overall analytics (only if not viewing a single dataset, or as additional context) */}
      {!datasetId && (
        <>
          {/* Normalization stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {normalizationStats.map((stat, index) => (
              <StatCard
                key={index}
                icon={Activity}
                label={stat.metric}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                color="bg-primary/10 text-primary"
              />
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingestion trend */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Ingestion Trends</h3>
                  <p className="text-sm text-muted-foreground">Datasets processed over time</p>
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              {ingestionTrend.length > 0 ? (
                <LineChart
                  data={ingestionTrend}
                  xKey="date"
                  lines={[
                    { dataKey: 'datasets', name: 'Datasets', color: 'hsl(200, 100%, 60%)' },
                  ]}
                  height={280}
                />
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  No ingestion data available
                </div>
              )}
            </div>

            {/* Source distribution pie */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Source Distribution</h3>
                  <p className="text-sm text-muted-foreground">Datasets by origin</p>
                </div>
                <PieChart className="w-5 h-5 text-secondary" />
              </div>
              {sourceDistribution.length > 0 ? (
                <div className="flex items-center gap-8">
                  <div className="w-[200px] h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={sourceDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sourceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3">
                                  <p className="text-sm font-medium text-foreground">
                                    {payload[0].name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {payload[0].value.toLocaleString()} datasets
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {sourceDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm font-mono text-muted-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No source data available
                </div>
              )}
            </div>
          </div>

          {/* Object type distribution */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Object Type Distribution</h3>
                <p className="text-sm text-muted-foreground">Breakdown by astronomical object type</p>
              </div>
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            {objectTypeDistribution.length > 0 ? (
              <BarChart
                data={objectTypeDistribution}
                xKey="type"
                bars={[{ dataKey: 'count', name: 'Objects' }]}
                height={300}
                colorByValue
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No object type data available
              </div>
            )}
          </div>

          {/* Processing metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Processing speed */}
            <div className="glass rounded-xl p-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Processing Speed</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">Ingestion Rate</span>
                    <span className="text-primary font-mono">{processingMetrics.ingestionRate}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      style={{ width: `${processingMetrics.ingestionPercent || 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">Normalization</span>
                    <span className="text-primary font-mono">{processingMetrics.normalizationTime}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      style={{ width: `${processingMetrics.normPercent || 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">Storage Write</span>
                    <span className="text-primary font-mono">{processingMetrics.storageWrite}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      style={{ width: `${processingMetrics.storagePercent || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Data quality */}
            <div className="glass rounded-xl p-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Data Quality</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-2xl font-bold text-green-500">{dataQuality.valid}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Valid Records</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-2xl font-bold text-amber-500">{dataQuality.warnings}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Warnings</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-2xl font-bold text-red-500">{dataQuality.errors}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Errors</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-2xl font-bold text-primary">{dataQuality.duplicates}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Duplicates</p>
                </div>
              </div>
            </div>

            {/* Storage usage */}
            <div className="glass rounded-xl p-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Storage Usage</h4>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="352"
                      strokeDashoffset={352 * (1 - storageUsage.usedPercent / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{storageUsage.usedPercent}%</span>
                    <span className="text-xs text-muted-foreground">Used</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-mono text-foreground">{storageUsage.used} TB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-mono text-foreground">{storageUsage.available} TB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-mono text-foreground">{storageUsage.total} TB</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;