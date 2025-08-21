import React from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface TrendData {
  date: string;
  anomalyCount: number;
  totalMeasurements: number;
  anomalyRate: number;
}

interface AnomalyTrendChartProps {
  trendData: TrendData[];
  selectedCell?: string;
}

export const AnomalyTrendChart: React.FC<AnomalyTrendChartProps> = ({ 
  trendData, 
  selectedCell 
}) => {
  const maxAnomalyRate = Math.max(...trendData.map(d => d.anomalyRate));
  const avgAnomalyRate = trendData.reduce((sum, d) => sum + d.anomalyRate, 0) / trendData.length;
  
  const getTrendDirection = () => {
    if (trendData.length < 2) return 'stable';
    const recent = trendData.slice(-3).reduce((sum, d) => sum + d.anomalyRate, 0) / 3;
    const earlier = trendData.slice(0, 3).reduce((sum, d) => sum + d.anomalyRate, 0) / 3;
    
    if (recent > earlier * 1.1) return 'increasing';
    if (recent < earlier * 0.9) return 'decreasing';
    return 'stable';
  };

  const trend = getTrendDirection();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Anomaly Trend Analysis</h3>
            {selectedCell && (
              <p className="text-sm text-gray-600">Cell: {selectedCell}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {trend === 'increasing' && <TrendingUp className="w-5 h-5 text-red-500" />}
          {trend === 'decreasing' && <TrendingDown className="w-5 h-5 text-green-500" />}
          <span className={`text-sm font-medium ${
            trend === 'increasing' ? 'text-red-600' : 
            trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
          }`}>
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-64 mb-6">
        <div className="absolute inset-0 flex items-end justify-between space-x-1">
          {trendData.map((data, index) => {
            const height = maxAnomalyRate > 0 ? (data.anomalyRate / maxAnomalyRate) * 100 : 0;
            const isAboveAverage = data.anomalyRate > avgAnomalyRate;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t transition-all duration-500 hover:opacity-80 ${
                    isAboveAverage ? 'bg-red-400' : 'bg-blue-400'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${data.date}: ${data.anomalyRate.toFixed(1)}% anomaly rate`}
                />
                <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                  {new Date(data.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Average line */}
        <div 
          className="absolute left-0 right-0 border-t-2 border-dashed border-gray-400"
          style={{ bottom: `${maxAnomalyRate > 0 ? (avgAnomalyRate / maxAnomalyRate) * 100 : 0}%` }}
        >
          <span className="absolute -top-6 right-0 text-xs text-gray-600 bg-white px-2">
            Avg: {avgAnomalyRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {avgAnomalyRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Average Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {maxAnomalyRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Peak Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {trendData.reduce((sum, d) => sum + d.anomalyCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Anomalies</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <span>Below Average</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span>Above Average</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-1 bg-gray-400 border-dashed border-t-2"></div>
          <span>Average Line</span>
        </div>
      </div>
    </div>
  );
};