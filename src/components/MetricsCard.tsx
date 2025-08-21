import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  precision: number;
  recall: number;
  f1Score: number;
  rank?: number;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  precision,
  recall,
  f1Score,
  rank
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.7) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (score >= 0.5) return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const formatScore = (score: number) => (score * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
            {title}
          </h3>
          {rank && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Rank #{rank}
            </div>
          )}
        </div>
        {getScoreIcon(f1Score)}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Precision</span>
          <span className={`font-semibold ${getScoreColor(precision)}`}>
            {formatScore(precision)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Recall</span>
          <span className={`font-semibold ${getScoreColor(recall)}`}>
            {formatScore(recall)}%
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-700">F1-Score</span>
          <span className={`font-bold text-lg ${getScoreColor(f1Score)}`}>
            {formatScore(f1Score)}%
          </span>
        </div>
      </div>
      
      {/* Progress bars */}
      <div className="mt-4 space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${precision * 100}%` }}
          />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${recall * 100}%` }}
          />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${f1Score * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};