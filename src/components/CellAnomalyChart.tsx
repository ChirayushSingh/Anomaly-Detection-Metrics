import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CellAnomalyData {
  cellName: string;
  kpi: string;
  value: number;
  isAnomaly: boolean;
  date: string;
  severity: 'low' | 'medium' | 'high';
}

interface CellAnomalyChartProps {
  data: CellAnomalyData[];
  selectedKPI: string;
}

export const CellAnomalyChart: React.FC<CellAnomalyChartProps> = ({ data, selectedKPI }) => {
  const filteredData = data.filter(d => d.kpi === selectedKPI);
  const cellNames = [...new Set(filteredData.map(d => d.cellName))];
  
  const getSeverityColor = (severity: string, isAnomaly: boolean) => {
    if (!isAnomaly) return 'bg-green-100 border-green-300';
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-400';
      case 'medium': return 'bg-yellow-100 border-yellow-400';
      case 'low': return 'bg-orange-100 border-orange-400';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string, isAnomaly: boolean) => {
    if (!isAnomaly) return <CheckCircle className="w-4 h-4 text-green-600" />;
    switch (severity) {
      case 'high': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAnomalyStats = () => {
    const total = filteredData.length;
    const anomalies = filteredData.filter(d => d.isAnomaly).length;
    const anomalyRate = total > 0 ? (anomalies / total) * 100 : 0;
    return { total, anomalies, anomalyRate };
  };

  const stats = getAnomalyStats();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Cell Anomaly Analysis - {selectedKPI}
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-600">
            Anomaly Rate: <span className="font-semibold text-red-600">{stats.anomalyRate.toFixed(1)}%</span>
          </span>
          <span className="text-gray-600">
            Total Cells: <span className="font-semibold">{cellNames.length}</span>
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Cell Anomaly Heatmap</h4>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {cellNames.slice(0, 32).map((cellName) => {
            const cellData = filteredData.filter(d => d.cellName === cellName);
            const anomalyCount = cellData.filter(d => d.isAnomaly).length;
            const totalCount = cellData.length;
            const anomalyRate = totalCount > 0 ? (anomalyCount / totalCount) : 0;
            
            const getHeatmapColor = (rate: number) => {
              if (rate === 0) return 'bg-green-200';
              if (rate < 0.3) return 'bg-yellow-200';
              if (rate < 0.6) return 'bg-orange-300';
              return 'bg-red-400';
            };

            return (
              <div
                key={cellName}
                className={`${getHeatmapColor(anomalyRate)} p-2 rounded text-xs text-center font-medium hover:scale-105 transition-transform cursor-pointer`}
                title={`${cellName}: ${(anomalyRate * 100).toFixed(1)}% anomalies`}
              >
                <div className="truncate">{cellName.split('_')[0]}</div>
                <div className="text-xs opacity-75">{(anomalyRate * 100).toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline View */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Anomalies Timeline</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredData
            .filter(d => d.isAnomaly)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${getSeverityColor(item.severity, item.isAnomaly)}`}
              >
                <div className="flex items-center space-x-3">
                  {getSeverityIcon(item.severity, item.isAnomaly)}
                  <div>
                    <span className="font-medium text-gray-900">{item.cellName}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      Value: {item.value.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs border-t pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <span>Normal (0%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
          <span>Low (1-30%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-300 rounded"></div>
          <span>Medium (31-60%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span>High (60%+)</span>
        </div>
      </div>
    </div>
  );
};