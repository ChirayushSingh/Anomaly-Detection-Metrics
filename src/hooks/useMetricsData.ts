import { useState, useEffect } from 'react';

export interface MetricData {
  kpi: string;
  precision: number;
  recall: number;
  f1Score: number;
}

export const useMetricsData = () => {
  const [data, setData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/Anomaly_Detection_Metrics.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        const parsedData: MetricData[] = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            kpi: values[0],
            precision: parseFloat(values[1]),
            recall: parseFloat(values[2]),
            f1Score: parseFloat(values[3])
          };
        });
        
        setData(parsedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};