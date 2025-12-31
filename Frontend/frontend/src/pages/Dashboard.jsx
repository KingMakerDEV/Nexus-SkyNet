import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  Globe,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Layers,
  Activity,
} from 'lucide-react';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import SkyMap from '../components/visualization/SkyMap';

// Stat card component
const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => (
  <div className="glass-hover rounded-xl p-5 hover-lift">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {change && (
        <span className={`flex items-center gap-1 text-xs font-medium ${
          changeType === 'increase' ? 'text-green-500' : 'text-red-500'
        }`}>
          <TrendingUp className={`w-3 h-3 ${changeType === 'decrease' ? 'rotate-180' : ''}`} />
          {change}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  </div>
);

// Activity item component
const ActivityItem = ({ status, title, time, source }) => {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    processing: { icon: RefreshCw, color: 'text-primary', bg: 'bg-primary/10', animate: true },
    failed: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  };

  const config = statusConfig[status] || statusConfig.completed;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
      <div className={`p-2 rounded-lg ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color} ${config.animate ? 'animate-spin' : ''}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{source}</p>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const ingestionData = [
    { name: 'Mon', datasets: 45, objects: 12400 },
    { name: 'Tue', datasets: 52, objects: 15600 },
    { name: 'Wed', datasets: 38, objects: 9800 },
    { name: 'Thu', datasets: 65, objects: 21000 },
    { name: 'Fri', datasets: 58, objects: 18500 },
    { name: 'Sat', datasets: 42, objects: 13200 },
    { name: 'Sun', datasets: 47, objects: 14800 },
  ];

  const sourceData = [
    { name: 'NASA', count: 4521 },
    { name: 'ESA', count: 3842 },
    { name: 'Hubble', count: 2156 },
    { name: 'JWST', count: 1823 },
    { name: 'Gaia', count: 1547 },
    { name: 'Other', count: 982 },
  ];

  const recentActivity = [
    { status: 'completed', title: 'Andromeda Galaxy Dataset', source: 'NASA Exoplanet Archive', time: '2m ago' },
    { status: 'processing', title: 'Gaia DR3 Star Catalog', source: 'ESA Gaia Mission', time: '5m ago' },
    { status: 'completed', title: 'JWST Deep Field Observation', source: 'James Webb Space Telescope', time: '12m ago' },
    { status: 'failed', title: 'Chandra X-ray Data', source: 'NASA Chandra Observatory', time: '25m ago' },
    { status: 'completed', title: 'Hubble Legacy Field', source: 'Hubble Space Telescope', time: '1h ago' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mission Control</h1>
          <p className="text-muted-foreground mt-1">
            Unified astronomical data processing overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Last 7 days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors glow-primary">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Database}
          title="Total Datasets"
          value="14,871"
          change="+12.5%"
          changeType="increase"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={CheckCircle2}
          title="Normalized"
          value="13,642"
          change="+8.2%"
          changeType="increase"
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={Globe}
          title="Connected Sources"
          value="12"
          change="+2"
          changeType="increase"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={Zap}
          title="Objects Processed"
          value="5.2M"
          change="+15.3%"
          changeType="increase"
          color="from-amber-500 to-orange-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingestion Trends */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Ingestion Trends</h3>
              <p className="text-sm text-muted-foreground">Daily data processing activity</p>
            </div>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <LineChart
            data={ingestionData}
            xKey="name"
            lines={[
              { dataKey: 'datasets', name: 'Datasets', color: 'hsl(200, 100%, 60%)' },
            ]}
            height={250}
          />
        </div>

        {/* Source Distribution */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Data Sources</h3>
              <p className="text-sm text-muted-foreground">Distribution by origin</p>
            </div>
            <Layers className="w-5 h-5 text-secondary" />
          </div>
          <BarChart
            data={sourceData}
            xKey="name"
            bars={[{ dataKey: 'count', name: 'Datasets' }]}
            height={250}
            colorByValue
          />
        </div>
      </div>

      {/* Sky Map and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Sky Map */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Sky Fusion Map</h3>
              <p className="text-sm text-muted-foreground">
                Multi-source astronomical objects visualization
              </p>
            </div>
            <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
              <span>Full View</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <SkyMap height={350} />
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Processing Pipeline Status */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Processing Pipeline</h3>
            <p className="text-sm text-muted-foreground">Real-time data normalization status</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { stage: 'Ingestion', count: 23, status: 'active' },
            { stage: 'Validation', count: 18, status: 'active' },
            { stage: 'Normalization', count: 45, status: 'active' },
            { stage: 'Storage', count: 12, status: 'active' },
          ].map((stage, index) => (
            <div key={index} className="relative p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-2xl font-bold text-primary">{stage.count}</div>
              <p className="text-xs text-muted-foreground mt-1">datasets in queue</p>
              {index < 3 && (
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
