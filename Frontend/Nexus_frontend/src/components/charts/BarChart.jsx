import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

const BarChart = ({
  data,
  xKey = 'name',
  bars = [],
  height = 300,
  showGrid = true,
  showLegend = false,
  layout = 'horizontal',
  colorByValue = false,
  className = '',
}) => {
  const defaultColors = [
    'hsl(200, 100%, 60%)',
    'hsl(270, 80%, 60%)',
    'hsl(180, 100%, 50%)',
    'hsl(45, 100%, 60%)',
    'hsl(15, 100%, 55%)',
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded"
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

  const isHorizontal = layout === 'horizontal';

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 30, left: isHorizontal ? 0 : 80, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(230, 30%, 18%)"
              horizontal={isHorizontal}
              vertical={!isHorizontal}
            />
          )}
          {isHorizontal ? (
            <>
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
            </>
          ) : (
            <>
              <XAxis
                type="number"
                stroke="hsl(215, 20%, 60%)"
                tick={{ fill: 'hsl(215, 20%, 60%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(230, 30%, 18%)' }}
                tickLine={{ stroke: 'hsl(230, 30%, 18%)' }}
              />
              <YAxis
                dataKey={xKey}
                type="category"
                stroke="hsl(215, 20%, 60%)"
                tick={{ fill: 'hsl(215, 20%, 60%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(230, 30%, 18%)' }}
                tickLine={{ stroke: 'hsl(230, 30%, 18%)' }}
                width={70}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          )}
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.color || defaultColors[index % defaultColors.length]}
              radius={[4, 4, 0, 0]}
            >
              {colorByValue &&
                data.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={defaultColors[i % defaultColors.length]}
                  />
                ))}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
