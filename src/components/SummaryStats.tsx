import React from 'react';
import { BarChart3, Target, Zap, Award } from 'lucide-react';

interface SummaryStatsProps {
  totalKPIs: number;
  avgPrecision: number;
  avgRecall: number;
  avgF1Score: number;
  bestPerformer: string;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  totalKPIs,
  avgPrecision,
  avgRecall,
  avgF1Score,
  bestPerformer
}) => {
  const formatPercentage = (value: number) => (value * 100).toFixed(1);

  const stats = [
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      label: 'Total KPIs',
      value: totalKPIs.toString(),
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: <Target className="w-6 h-6 text-green-600" />,
      label: 'Avg Precision',
      value: `${formatPercentage(avgPrecision)}%`,
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      label: 'Avg Recall',
      value: `${formatPercentage(avgRecall)}%`,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      label: 'Avg F1-Score',
      value: `${formatPercentage(avgF1Score)}%`,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.color} border rounded-xl p-6 transition-all duration-300 hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className="flex-shrink-0">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
      
      <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Award className="w-8 h-8 text-indigo-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Best Performing KPI</p>
            <p className="text-xl font-bold text-indigo-900">{bestPerformer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};