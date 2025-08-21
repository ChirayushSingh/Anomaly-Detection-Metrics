import { useState, useEffect } from 'react';

export interface CellAnomalyData {
  cellName: string;
  kpi: string;
  value: number;
  isAnomaly: boolean;
  date: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CellMetric {
  cellName: string;
  totalAnomalies: number;
  totalMeasurements: number;
  anomalyRate: number;
  topAnomalousKPI: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface TrendData {
  date: string;
  anomalyCount: number;
  totalMeasurements: number;
  anomalyRate: number;
}

export const useCellAnomalyData = () => {
  const [cellAnomalyData, setCellAnomalyData] = useState<CellAnomalyData[]>([]);
  const [cellMetrics, setCellMetrics] = useState<CellMetric[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateMockData = () => {
      try {
        // Generate mock cell anomaly data
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

        const cellNames = [
          'CELL_001_SECTOR_A', 'CELL_002_SECTOR_B', 'CELL_003_SECTOR_C',
          'CELL_004_SECTOR_A', 'CELL_005_SECTOR_B', 'CELL_006_SECTOR_C',
          'CELL_007_SECTOR_A', 'CELL_008_SECTOR_B', 'CELL_009_SECTOR_C',
          'CELL_010_SECTOR_A', 'CELL_011_SECTOR_B', 'CELL_012_SECTOR_C',
          'CELL_013_SECTOR_A', 'CELL_014_SECTOR_B', 'CELL_015_SECTOR_C',
          'CELL_016_SECTOR_A', 'CELL_017_SECTOR_B', 'CELL_018_SECTOR_C',
          'CELL_019_SECTOR_A', 'CELL_020_SECTOR_B'
        ];

        const mockCellData: CellAnomalyData[] = [];
        const dates = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return date.toISOString().split('T')[0];
        });

        // Generate data for each cell, KPI, and date combination
        cellNames.forEach(cellName => {
          kpis.forEach(kpi => {
            dates.forEach(date => {
              const isAnomaly = Math.random() < 0.15; // 15% anomaly rate
              const baseValue = Math.random() * 100;
              const value = isAnomaly ? baseValue * (0.3 + Math.random() * 0.4) : baseValue;
              
              let severity: 'low' | 'medium' | 'high' = 'low';
              if (isAnomaly) {
                const severityRand = Math.random();
                if (severityRand < 0.2) severity = 'high';
                else if (severityRand < 0.5) severity = 'medium';
              }

              mockCellData.push({
                cellName,
                kpi,
                value,
                isAnomaly,
                date,
                severity
              });
            });
          });
        });

        setCellAnomalyData(mockCellData);

        // Calculate cell metrics
        const cellMetricsMap = new Map<string, {
          totalAnomalies: number;
          totalMeasurements: number;
          kpiAnomalyCounts: Map<string, number>;
        }>();

        mockCellData.forEach(data => {
          if (!cellMetricsMap.has(data.cellName)) {
            cellMetricsMap.set(data.cellName, {
              totalAnomalies: 0,
              totalMeasurements: 0,
              kpiAnomalyCounts: new Map()
            });
          }

          const cellMetric = cellMetricsMap.get(data.cellName)!;
          cellMetric.totalMeasurements++;
          
          if (data.isAnomaly) {
            cellMetric.totalAnomalies++;
            const currentCount = cellMetric.kpiAnomalyCounts.get(data.kpi) || 0;
            cellMetric.kpiAnomalyCounts.set(data.kpi, currentCount + 1);
          }
        });

        const calculatedCellMetrics: CellMetric[] = Array.from(cellMetricsMap.entries()).map(([cellName, metrics]) => {
          const anomalyRate = (metrics.totalAnomalies / metrics.totalMeasurements) * 100;
          
          // Find top anomalous KPI
          let topAnomalousKPI = 'None';
          let maxAnomalies = 0;
          metrics.kpiAnomalyCounts.forEach((count, kpi) => {
            if (count > maxAnomalies) {
              maxAnomalies = count;
              topAnomalousKPI = kpi;
            }
          });

          // Determine risk level
          let riskLevel: 'low' | 'medium' | 'high' = 'low';
          if (anomalyRate > 20) riskLevel = 'high';
          else if (anomalyRate > 10) riskLevel = 'medium';

          return {
            cellName,
            totalAnomalies: metrics.totalAnomalies,
            totalMeasurements: metrics.totalMeasurements,
            anomalyRate,
            topAnomalousKPI,
            riskLevel
          };
        });

        setCellMetrics(calculatedCellMetrics);

        // Calculate trend data
        const trendMap = new Map<string, { anomalyCount: number; totalMeasurements: number }>();
        
        mockCellData.forEach(data => {
          if (!trendMap.has(data.date)) {
            trendMap.set(data.date, { anomalyCount: 0, totalMeasurements: 0 });
          }
          
          const trend = trendMap.get(data.date)!;
          trend.totalMeasurements++;
          if (data.isAnomaly) {
            trend.anomalyCount++;
          }
        });

        const calculatedTrendData: TrendData[] = Array.from(trendMap.entries())
          .map(([date, data]) => ({
            date,
            anomalyCount: data.anomalyCount,
            totalMeasurements: data.totalMeasurements,
            anomalyRate: (data.anomalyCount / data.totalMeasurements) * 100
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setTrendData(calculatedTrendData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    generateMockData();
  }, []);

  const getCellData = (cellName: string) => {
    return cellAnomalyData.filter(data => data.cellName === cellName);
  };

  const getTrendDataForCell = (cellName?: string): TrendData[] => {
    if (!cellName) return trendData;
    
    const cellData = cellAnomalyData.filter(data => data.cellName === cellName);
    const trendMap = new Map<string, { anomalyCount: number; totalMeasurements: number }>();
    
    cellData.forEach(data => {
      if (!trendMap.has(data.date)) {
        trendMap.set(data.date, { anomalyCount: 0, totalMeasurements: 0 });
      }
      
      const trend = trendMap.get(data.date)!;
      trend.totalMeasurements++;
      if (data.isAnomaly) {
        trend.anomalyCount++;
      }
    });

    return Array.from(trendMap.entries())
      .map(([date, data]) => ({
        date,
        anomalyCount: data.anomalyCount,
        totalMeasurements: data.totalMeasurements,
        anomalyRate: (data.anomalyCount / data.totalMeasurements) * 100
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return {
    cellAnomalyData,
    cellMetrics,
    trendData,
    loading,
    error,
    getCellData,
    getTrendDataForCell
  };
};