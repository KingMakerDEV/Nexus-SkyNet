import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const LineChart = ({
  data,
  xKey = 'name',
  lines = [],
  height = 300,
  showGrid = true,
  showLegend = true,
  className = '',
}) => {
  // Default line colors using CSS variables
  const defaultColors = [
    'hsl(200, 100%, 60%)', // Primary cosmic blue
    'hsl(270, 80%, 60%)',  // Nebula purple
    'hsl(180, 100%, 50%)', // Stellar cyan
    'hsl(45, 100%, 60%)',  // Solar gold
    'hsl(15, 100%, 55%)',  // Mars red
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-mono text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(230, 30%, 18%)"
              vertical={false}
            />
          )}
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
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          )}
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color || defaultColors[index % defaultColors.length]}
              strokeWidth={2}
              dot={{ fill: line.color || defaultColors[index % defaultColors.length], strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(230, 25%, 5%)', strokeWidth: 2 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
