import React, { useState } from 'react';
import { Activity, Github, ExternalLink, BarChart3, Radar } from 'lucide-react';
import { MetricsCard } from './components/MetricsCard';
import { SummaryStats } from './components/SummaryStats';
import { MetricsChart } from './components/MetricsChart';
import { SearchFilter } from './components/SearchFilter';
import { CellAnalysisTab } from './components/CellAnalysisTab';
import { useMetricsData } from './hooks/useMetricsData';
import { calculateSummaryStats, filterAndSortData } from './utils/metricsCalculations';

function App() {
  const { data, loading, error } = useMetricsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('f1Score');
  const [activeTab, setActiveTab] = useState<'overview' | 'cells'>('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading anomaly detection metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-500 mb-4">
            <Activity className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const summaryStats = calculateSummaryStats(data);
  const filteredData = filterAndSortData(data, searchTerm, sortBy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Anomaly Detection Metrics
                </h1>
                <p className="text-gray-600">
                  Performance analysis of KPI anomaly detection models
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>KPI Overview</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('cells')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'cells'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Radar className="w-4 h-4" />
                  <span>Cell Analysis</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <>
            {/* Summary Statistics */}
            <SummaryStats {...summaryStats} />

            {/* Search and Filter */}
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Metrics Cards */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredData.map((metric, index) => (
                    <MetricsCard
                      key={metric.kpi}
                      title={metric.kpi}
                      precision={metric.precision}
                      recall={metric.recall}
                      f1Score={metric.f1Score}
                      rank={index + 1}
                    />
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-1">
                <MetricsChart data={filteredData} />
              </div>
            </div>
          </>
        ) : (
          <CellAnalysisTab />
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Anomaly Detection Dashboard - Built with React & TypeScript
            </p>
            <p className="text-sm">
              Analyzing {data.length} KPIs across multiple cells with machine learning metrics
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;