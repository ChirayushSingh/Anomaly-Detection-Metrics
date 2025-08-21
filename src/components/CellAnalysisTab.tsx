import React, { useState } from 'react';
import { CellMetricsOverview } from './CellMetricsOverview';
import { CellAnomalyChart } from './CellAnomalyChart';
import { AnomalyTrendChart } from './AnomalyTrendChart';
import { useCellAnomalyData } from '../hooks/useCellAnomalyData';

export const CellAnalysisTab: React.FC = () => {
  const { 
    cellAnomalyData, 
    cellMetrics, 
    loading, 
    error, 
    getTrendDataForCell 
  } = useCellAnomalyData();
  
  const [selectedCell, setSelectedCell] = useState<string>('');
  const [selectedKPI, setSelectedKPI] = useState<string>('Cell Availability');

  const kpis = [
    'Cell Availability',
    'Average ENDC User DL Throughpu(Mbps)',
    'Total_Traffic_Vol_GB',
    'DL RBSym Utilization',
    'DL BLER (%)',
    'Active_Users',
    'Maximum number of RRC Connected Users',
    'Avg. Overall DL Latency (ms)',
    'Average CQI ( 256 QAM)',
    'PATHLOSS',
    'UL RSSI (dBm/PRB)',
    'NR_DL_256QAM',
    'NR_DL_64QAM',
    'NR_DL_16QAM',
    'NR_DL_QPSK',
    'MIMO Utilisation'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cell anomaly data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p className="text-xl font-semibold">Error Loading Cell Data</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const trendData = getTrendDataForCell(selectedCell);

  return (
    <div className="space-y-8">
      {/* KPI Selector */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select KPI for Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <button
              key={kpi}
              onClick={() => setSelectedKPI(kpi)}
              className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                selectedKPI === kpi
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {kpi}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cell Overview */}
        <div className="lg:col-span-1">
          <CellMetricsOverview
            cellMetrics={cellMetrics}
            onCellSelect={setSelectedCell}
            selectedCell={selectedCell}
          />
        </div>

        {/* Cell Anomaly Chart */}
        <div className="lg:col-span-2">
          <CellAnomalyChart
            data={cellAnomalyData}
            selectedKPI={selectedKPI}
          />
        </div>
      </div>

      {/* Trend Analysis */}
      <AnomalyTrendChart
        trendData={trendData}
        selectedCell={selectedCell}
      />
    </div>
  );
};