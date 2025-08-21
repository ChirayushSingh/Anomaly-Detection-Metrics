import { MetricData } from '../hooks/useMetricsData';

export const calculateSummaryStats = (data: MetricData[]) => {
  if (data.length === 0) {
    return {
      totalKPIs: 0,
      avgPrecision: 0,
      avgRecall: 0,
      avgF1Score: 0,
      bestPerformer: 'N/A'
    };
  }

  const totalKPIs = data.length;
  const avgPrecision = data.reduce((sum, item) => sum + item.precision, 0) / totalKPIs;
  const avgRecall = data.reduce((sum, item) => sum + item.recall, 0) / totalKPIs;
  const avgF1Score = data.reduce((sum, item) => sum + item.f1Score, 0) / totalKPIs;
  
  const bestPerformer = data.reduce((best, current) => 
    current.f1Score > best.f1Score ? current : best
  ).kpi;

  return {
    totalKPIs,
    avgPrecision,
    avgRecall,
    avgF1Score,
    bestPerformer
  };
};

export const filterAndSortData = (
  data: MetricData[],
  searchTerm: string,
  sortBy: string
): MetricData[] => {
  let filtered = data.filter(item =>
    item.kpi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return filtered.sort((a, b) => {
    switch (sortBy) {
      case 'precision':
        return b.precision - a.precision;
      case 'recall':
        return b.recall - a.recall;
      case 'f1Score':
        return b.f1Score - a.f1Score;
      case 'name':
        return a.kpi.localeCompare(b.kpi);
      default:
        return b.f1Score - a.f1Score;
    }
  });
};