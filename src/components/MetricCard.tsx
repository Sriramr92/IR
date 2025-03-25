import React from 'react';
import { SentimentMetric } from '../types';

interface MetricCardProps {
  title: string;
  metric: SentimentMetric;
  isNegative?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, metric, isNegative = false }) => {
  const getValueColor = () => {
    if (title.toLowerCase().includes('net negativity')) {
      return 'text-red-600';
    }
    if (title.toLowerCase().includes('net')) {
      return metric.value >= 0 ? 'text-green-600' : 'text-red-600';
    }
    return isNegative ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100">
      <div className="text-xs text-gray-500 mb-1 truncate">{title}</div>
      <div className={`text-sm font-semibold ${getValueColor()}`}>
        {metric.value.toFixed(1)}K
      </div>
    </div>
  );
};