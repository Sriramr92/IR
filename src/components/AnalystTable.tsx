import React from 'react';
import { AnalystQuestion } from '../types';

interface AnalystTableProps {
  data: AnalystQuestion[];
}

export const AnalystTable: React.FC<AnalystTableProps> = ({ data }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Analyst
          </th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Question
          </th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Quarter
          </th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Net +/-
          </th>
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Stock Δ
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="px-3 py-2 whitespace-nowrap text-xs">{row.analyst}</td>
            <td className="px-3 py-2 text-xs">
              <div 
                className="truncate max-w-[300px]" 
                title={row.question}
              >
                {row.question}
              </div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap text-xs">
              {row.quarter} {row.year}
            </td>
            <td className="px-3 py-2 whitespace-nowrap text-xs">
              <span className={row.netPositivity >= row.netNegativity ? 'text-green-600' : 'text-red-600'}>
                {(row.netPositivity - row.netNegativity).toFixed(1)}
              </span>
            </td>
            <td className="px-3 py-2 whitespace-nowrap text-xs">
              <span className={row.stockChangeNextDay >= 0 ? 'text-green-600' : 'text-red-600'}>
                {row.stockChangeNextDay.toFixed(2)}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};