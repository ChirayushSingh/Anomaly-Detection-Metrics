import React from 'react';
import { BarChart, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface CellMetric {
  cellName: string;
  totalAnomalies: number;
  totalMeasurements: number;
  anomalyRate: number;
  topAnomalousKPI: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface CellMetricsOverviewProps {
  cellMetrics: CellMetric[];
  onCellSelect: (cellName: string) => void;
  selectedCell?: string;
}

export const CellMetricsOverview: React.FC<CellMetricsOverviewProps> = ({
  cellMetrics,
  onCellSelect,
  selectedCell
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium': return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      case 'low': return <TrendingDown className="w-5 h-5 text-green-600" />;
      default: return <BarChart className="w-5 h-5 text-gray-600" />;
    }
  };

  const sortedCells = cellMetrics.sort((a, b) => b.anomalyRate - a.anomalyRate);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Cell Performance Overview</h3>
        <div className="text-sm text-gray-600">
          {cellMetrics.length} cells analyzed
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedCells.map((cell, index) => (
          <div
            key={cell.cellName}
            onClick={() => onCellSelect(cell.cellName)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedCell === cell.cellName 
                ? 'border-blue-500 bg-blue-50' 
                : `border-gray-200 hover:border-gray-300 ${getRiskColor(cell.riskLevel)}`
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  {getRiskIcon(cell.riskLevel)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{cell.cellName}</h4>
                  <p className="text-sm text-gray-600">
                    Top Issue: {cell.topAnomalousKPI}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {cell.anomalyRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  {cell.totalAnomalies}/{cell.totalMeasurements}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    cell.riskLevel === 'high' ? 'bg-red-500' :
                    cell.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(cell.anomalyRate, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">
              {cellMetrics.filter(c => c.riskLevel === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Risk</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {cellMetrics.filter(c => c.riskLevel === 'medium').length}
            </div>
            <div className="text-sm text-gray-600">Medium Risk</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {cellMetrics.filter(c => c.riskLevel === 'low').length}
            </div>
            <div className="text-sm text-gray-600">Low Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};