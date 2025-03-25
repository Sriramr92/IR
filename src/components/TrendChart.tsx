import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendData } from '../types';

interface TrendChartProps {
  data: TrendData[];
  metrics: Array<{
    key: keyof TrendData;
    color: string;
    name: string;
  }>;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, metrics }) => {
  // Determine if this is a positivity or negativity chart based on the first metric
  const isPositivityChart = metrics[0].key.toLowerCase().includes('positivity');

  // Separate line metrics (net positivity/negativity) from bar metrics
  const lineMetric = metrics[0];
  const barMetrics = metrics.slice(1);

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 30, bottom: 20, left: 0 }}>
          <XAxis 
            dataKey="quarter" 
            tick={{ fontSize: 11 }}
            interval={0}
            height={20}
            angle={-45}
            textAnchor="end"
          />
          {/* Left Y-axis for bars */}
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 11 }}
            width={30}
          />
          {/* Right Y-axis for line */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11 }}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.75rem'
            }}
          />
          <Legend 
            wrapperStyle={{
              fontSize: '0.75rem',
              marginTop: '-5px'
            }}
          />
          
          {/* Render clustered bars for emotions */}
          {barMetrics.map(({ key, color, name }, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={color}
              name={name}
              yAxisId="left"
              barSize={20}
            />
          ))}

          {/* Render line for net positivity/negativity */}
          <Line
            type="monotone"
            dataKey={lineMetric.key}
            stroke={lineMetric.color}
            name={lineMetric.name}
            yAxisId="right"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};