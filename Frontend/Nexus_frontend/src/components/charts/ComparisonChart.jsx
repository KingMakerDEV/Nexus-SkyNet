import React, { useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';

const ComparisonChart = ({
  data,
  xKey = 'name',
  datasetA = { dataKey: 'valueA', name: 'Dataset A', color: 'hsl(200, 100%, 60%)' },
  datasetB = { dataKey: 'valueB', name: 'Dataset B', color: 'hsl(270, 80%, 60%)' },
  differenceKey = 'difference',
  showDifference = true,
  height = 400,
  className = '',
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const valueA = payload.find(p => p.dataKey === datasetA.dataKey)?.value;
      const valueB = payload.find(p => p.dataKey === datasetB.dataKey)?.value;
      const diff = valueA !== undefined && valueB !== undefined ? valueA - valueB : null;

      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg min-w-[200px]">
          <p className="text-sm font-medium text-foreground mb-3 pb-2 border-b border-border">
            {label}
          </p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-mono text-sm text-foreground">
                  {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                </span>
              </div>
            ))}
            {showDifference && diff !== null && (
              <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Difference</span>
                <span className={`font-mono text-sm font-medium ${diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-foreground'}`}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Legend header */}
      <div className="flex items-center justify-center gap-8 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded" style={{ backgroundColor: datasetA.color }} />
          <span className="text-sm text-muted-foreground">{datasetA.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded" style={{ backgroundColor: datasetB.color }} />
          <span className="text-sm text-muted-foreground">{datasetB.name}</span>
        </div>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={datasetA.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={datasetA.color} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={datasetB.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={datasetB.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(230, 30%, 18%)"
              vertical={false}
            />
            <XAxis
              dataKey={xKey}
              stroke="hsl(215, 20%, 60%)"
              tick={{ fill: 'hsl(215, 20%, 60%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(230, 30%, 18%)' }}
              tickLine={{ stroke: 'hsl(230, 30%, 18%)' }}
            />
            <YAxis
              stroke="hsl(215, 20%, 60%)"
              tick={{ fill: 'hsl(215, 20%, 60%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(230, 30%, 18%)' }}
              tickLine={{ stroke: 'hsl(230, 30%, 18%)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="hsl(230, 30%, 25%)" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey={datasetA.dataKey}
              name={datasetA.name}
              stroke={datasetA.color}
              fill="url(#gradientA)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey={datasetB.dataKey}
              name={datasetB.name}
              stroke={datasetB.color}
              fill="url(#gradientB)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey={datasetA.dataKey}
              stroke={datasetA.color}
              strokeWidth={2}
              dot={{ fill: datasetA.color, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(230, 25%, 5%)', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey={datasetB.dataKey}
              stroke={datasetB.color}
              strokeWidth={2}
              dot={{ fill: datasetB.color, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(230, 25%, 5%)', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Difference summary */}
      {showDifference && (
        <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Difference</span>
            <span className="font-mono text-foreground">
              {(() => {
                const diffs = data.map(d => d[datasetA.dataKey] - d[datasetB.dataKey]).filter(d => !isNaN(d));
                const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
                return avg.toFixed(4);
              })()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonChart;
