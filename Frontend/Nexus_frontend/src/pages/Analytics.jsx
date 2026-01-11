import React, { useState } from 'react';
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
} from 'lucide-react';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const timeRanges = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ];

  // Sample data
  const ingestionTrend = [
    { date: 'Jan 1', datasets: 45, objects: 125000 },
    { date: 'Jan 2', datasets: 52, objects: 156000 },
    { date: 'Jan 3', datasets: 38, objects: 98000 },
    { date: 'Jan 4', datasets: 65, objects: 210000 },
    { date: 'Jan 5', datasets: 58, objects: 185000 },
    { date: 'Jan 6', datasets: 72, objects: 245000 },
    { date: 'Jan 7', datasets: 47, objects: 148000 },
  ];

  const sourceDistribution = [
    { name: 'NASA', value: 4521, color: '#3B82F6' },
    { name: 'ESA', value: 3842, color: '#8B5CF6' },
    { name: 'Hubble', value: 2156, color: '#F59E0B' },
    { name: 'JWST', value: 1823, color: '#EF4444' },
    { name: 'Gaia', value: 1547, color: '#EC4899' },
    { name: 'Other', value: 982, color: '#6B7280' },
  ];

  const objectTypeDistribution = [
    { type: 'Stars', count: 8547892 },
    { type: 'Galaxies', count: 1245678 },
    { type: 'Nebulae', count: 45892 },
    { type: 'Planets', count: 8942 },
    { type: 'Asteroids', count: 125847 },
    { type: 'Other', count: 28456 },
  ];

  const normalizationStats = [
    { metric: 'Coordinate Conversions', value: '15.2M', change: '+12.5%', trend: 'up' },
    { metric: 'Unit Normalizations', value: '8.7M', change: '+8.3%', trend: 'up' },
    { metric: 'Epoch Corrections', value: '3.4M', change: '+15.1%', trend: 'up' },
    { metric: 'Failed Conversions', value: '0.02%', change: '-5.2%', trend: 'down' },
  ];

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Statistical insights and processing metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time range selector */}
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
          <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

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
            color={`bg-primary/10 text-primary`}
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
          <LineChart
            data={ingestionTrend}
            xKey="date"
            lines={[
              { dataKey: 'datasets', name: 'Datasets', color: 'hsl(200, 100%, 60%)' },
            ]}
            height={280}
          />
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
        <BarChart
          data={objectTypeDistribution}
          xKey="type"
          bars={[{ dataKey: 'count', name: 'Objects' }]}
          height={300}
          colorByValue
        />
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
                <span className="text-primary font-mono">1,245/hr</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Normalization</span>
                <span className="text-primary font-mono">2.3s/dataset</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Storage Write</span>
                <span className="text-primary font-mono">850 MB/s</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Data quality */}
        <div className="glass rounded-xl p-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Data Quality</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-2xl font-bold text-green-500">99.8%</p>
              <p className="text-xs text-muted-foreground mt-1">Valid Records</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-2xl font-bold text-amber-500">0.15%</p>
              <p className="text-xs text-muted-foreground mt-1">Warnings</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-2xl font-bold text-red-500">0.02%</p>
              <p className="text-xs text-muted-foreground mt-1">Errors</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-2xl font-bold text-primary">0.03%</p>
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
                  strokeDashoffset="105"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">70%</span>
                <span className="text-xs text-muted-foreground">Used</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Used</span>
              <span className="font-mono text-foreground">2.8 TB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available</span>
              <span className="font-mono text-foreground">1.2 TB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono text-foreground">4.0 TB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
