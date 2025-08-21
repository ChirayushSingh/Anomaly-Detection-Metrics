import React from 'react';

interface MetricsChartProps {
  data: Array<{
    kpi: string;
    precision: number;
    recall: number;
    f1Score: number;
  }>;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ data }) => {
  const maxValue = Math.max(
    ...data.flatMap(d => [d.precision, d.recall, d.f1Score])
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Comparison</h3>
      
      <div className="space-y-6">
        {data.slice(0, 8).map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {item.kpi}
              </span>
              <span className="text-sm text-gray-500">
                F1: {(item.f1Score * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="space-y-1">
              {/* Precision Bar */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 w-12">Prec</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(item.precision / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-12 text-right">
                  {(item.precision * 100).toFixed(0)}%
                </span>
              </div>
              
              {/* Recall Bar */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 w-12">Rec</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(item.recall / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-12 text-right">
                  {(item.recall * 100).toFixed(0)}%
                </span>
              </div>
              
              {/* F1-Score Bar */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 w-12">F1</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${(item.f1Score / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-12 text-right">
                  {(item.f1Score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Precision</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Recall</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">F1-Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};