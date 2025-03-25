import React, { useState, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { MetricCard } from './components/MetricCard';
import { TrendChart } from './components/TrendChart';
import { AnalystCarousel } from './components/AnalystCarousel';
import { CalendarIcon, Filter, Maximize2, Minimize2, Search } from 'lucide-react';

// Mock data remains unchanged
const mockMetrics = {
  netPositivity: { value: 14.8, change: 0 },
  interest: { value: 8.6, change: 0 },
  enthusiasm: { value: 2.1, change: 0 },
  calmness: { value: 1.9, change: 0 },
  satisfaction: { value: 1.5, change: 0 },
  surprisePositive: { value: 725.7, change: 0 }
};

const mockNegativeMetrics = {
  netNegativity: { value: 8.5, change: 0 },
  confusion: { value: 2.8, change: 0 },
  annoyance: { value: 1.8, change: 0 },
  doubt: { value: 1.6, change: 0 },
  disapproval: { value: 1.5, change: 0 },
  surpriseNegative: { value: 763.8, change: 0 }
};

const mockAnalysts = [
  { id: 'all', name: 'All Analysts' },
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Sarah Johnson' },
  { id: '3', name: 'Michael Chen' },
  { id: '4', name: 'Emma Davis' },
  { id: '5', name: 'David Wilson' },
];

const datePresets = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
  { label: 'Year to Date', value: 'ytd' },
];

// Rest of the mock data remains unchanged...
const mockTrendData = Array.from({ length: 10 }, (_, i) => ({
  quarter: `Q${(i % 4) + 1} ${2022 + Math.floor(i / 4)}`,
  netPositivity: 60 + Math.random() * 20,
  interest: 55 + Math.random() * 25,
  enthusiasm: 50 + Math.random() * 30,
  calmness: 45 + Math.random() * 35,
  satisfaction: 40 + Math.random() * 40,
  surprisePositive: 35 + Math.random() * 45,
  netNegativity: 40 + Math.random() * 30,
  confusion: 35 + Math.random() * 25,
  annoyance: 30 + Math.random() * 20,
  doubt: 25 + Math.random() * 15,
  disapproval: 20 + Math.random() * 10,
  surpriseNegative: 15 + Math.random() * 5
}));

const mockAnalystQuestions = Array.from({ length: 10 }, (_, i) => ({
  analyst: `Analyst ${i + 1}`,
  question: `Question about HPE's strategy in cloud computing, edge solutions, and digital transformation initiatives for enterprise customers...`,
  quarter: `Q${(i % 4) + 1}`,
  year: 2023 + Math.floor(i / 4),
  netPositivity: Math.random() * 100,
  netNegativity: Math.random() * 100,
  stockChangeNextDay: (Math.random() * 10) - 5
}));

function App() {
  const [selectedAnalyst, setSelectedAnalyst] = useState('all');
  const [analystSearch, setAnalystSearch] = useState('');
  const [dateRange, setDateRange] = useState({ 
    start: '2023-01-01',
    end: '2024-01-01',
    preset: ''
  });
  const [maximizedPanel, setMaximizedPanel] = useState<string | null>(null);

  const filteredAnalysts = useMemo(() => {
    if (!analystSearch) return mockAnalysts;
    const search = analystSearch.toLowerCase();
    return mockAnalysts.filter(analyst => 
      analyst.name.toLowerCase().includes(search)
    );
  }, [analystSearch]);

  const handlePresetChange = (preset: string) => {
    const now = new Date();
    let start = new Date();
    const end = now.toISOString().split('T')[0];

    switch (preset) {
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      case '30d':
        start.setDate(now.getDate() - 30);
        break;
      case '90d':
        start.setDate(now.getDate() - 90);
        break;
      case '6m':
        start.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        start.setFullYear(now.getFullYear() - 1);
        break;
      case 'ytd':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return;
    }

    setDateRange({
      start: start.toISOString().split('T')[0],
      end,
      preset
    });
  };

  const handleMaximize = (panelId: string) => {
    setMaximizedPanel(maximizedPanel === panelId ? null : panelId);
  };

  return (
    <div className="h-screen bg-gray-50 p-4 flex flex-col">
      <div className="max-w-[1920px] mx-auto w-full flex-1 flex flex-col space-y-3">
        {/* Header with navigation */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">Sentiment Analysis Dashboard</h1>
          <nav>
            <ul className="flex space-x-6 text-sm">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Analyst Question Sentiment
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Prepared Statement Speaker Sentiment
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  SP Global Sentiment vs. Hume.ai Sentiment
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Sentiment Definitions
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100 h-full">
              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <Search size={12} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search analysts..."
                    value={analystSearch}
                    onChange={(e) => setAnalystSearch(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <select 
                  className="w-full text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 py-1"
                  value={selectedAnalyst}
                  onChange={(e) => setSelectedAnalyst(e.target.value)}
                >
                  {filteredAnalysts.map(analyst => (
                    <option key={analyst.id} value={analyst.id}>
                      {analyst.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <CalendarIcon size={14} className="text-gray-500 shrink-0" />
                  <select
                    value={dateRange.preset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 py-1 w-full"
                  >
                    <option value="">Custom Range</option>
                    {datePresets.map(preset => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col space-y-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value, preset: '' })}
                    className="w-full text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 py-1"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value, preset: '' })}
                    className="w-full text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 py-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100 h-full">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-medium text-gray-900">Analyst Questions</h3>
                <button
                  onClick={() => handleMaximize('questions')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {maximizedPanel === 'questions' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
              </div>
              <div className="h-[calc(100%-1.5rem)]">
                <AnalystCarousel data={mockAnalystQuestions} />
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the component remains unchanged */}
        {/* Metric Cards */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 grid grid-cols-6 gap-2">
            <MetricCard title="Net Positivity" metric={mockMetrics.netPositivity} />
            <MetricCard title="Interest" metric={mockMetrics.interest} />
            <MetricCard title="Enthusiasm" metric={mockMetrics.enthusiasm} />
            <MetricCard title="Calmness" metric={mockMetrics.calmness} />
            <MetricCard title="Satisfaction" metric={mockMetrics.satisfaction} />
            <MetricCard title="Surprise" metric={mockMetrics.surprisePositive} />
          </div>
          <div className="col-span-6 grid grid-cols-6 gap-2">
            <MetricCard title="Net Negativity" metric={mockNegativeMetrics.netNegativity} isNegative />
            <MetricCard title="Confusion" metric={mockNegativeMetrics.confusion} isNegative />
            <MetricCard title="Annoyance" metric={mockNegativeMetrics.annoyance} isNegative />
            <MetricCard title="Doubt" metric={mockNegativeMetrics.doubt} isNegative />
            <MetricCard title="Disapproval" metric={mockNegativeMetrics.disapproval} isNegative />
            <MetricCard title="Surprise" metric={mockNegativeMetrics.surpriseNegative} isNegative />
          </div>
        </div>

        {/* Charts section */}
        <div className="flex-1">
          <PanelGroup direction="vertical">
            {/* Net Positivity and Negativity Trends */}
            <Panel>
              <PanelGroup direction="horizontal">
                <Panel>
                  <div className="h-full bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-900">Net Positivity Trend</h3>
                      <button
                        onClick={() => handleMaximize('positivity')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {maximizedPanel === 'positivity' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      </button>
                    </div>
                    <TrendChart
                      data={mockTrendData}
                      metrics={[
                        { key: 'netPositivity', color: '#00B5E2', name: 'Net Positivity' },
                        { key: 'interest', color: '#425563', name: 'Interest' },
                        { key: 'enthusiasm', color: '#01A982', name: 'Enthusiasm' }
                      ]}
                    />
                  </div>
                </Panel>
                <PanelResizeHandle className="w-2 bg-gray-100 hover:bg-gray-200 transition-colors" />
                <Panel>
                  <div className="h-full bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-900">Net Negativity Trend</h3>
                      <button
                        onClick={() => handleMaximize('negativity')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {maximizedPanel === 'negativity' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      </button>
                    </div>
                    <TrendChart
                      data={mockTrendData}
                      metrics={[
                        { key: 'netNegativity', color: '#FF8D6D', name: 'Net Negativity' },
                        { key: 'confusion', color: '#F5C400', name: 'Confusion' },
                        { key: 'annoyance', color: '#614767', name: 'Annoyance' }
                      ]}
                    />
                  </div>
                </Panel>
              </PanelGroup>
            </Panel>
            <PanelResizeHandle className="h-2 bg-gray-100 hover:bg-gray-200 transition-colors" />
            {/* Interest vs Confusion */}
            <Panel>
              <div className="h-full bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Interest vs Confusion</h3>
                  <button
                    onClick={() => handleMaximize('interest-confusion')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {maximizedPanel === 'interest-confusion' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                </div>
                <TrendChart
                  data={mockTrendData}
                  metrics={[
                    { key: 'interest', color: '#00B5E2', name: 'Interest' },
                    { key: 'confusion', color: '#FF8D6D', name: 'Confusion' }
                  ]}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="h-2 bg-gray-100 hover:bg-gray-200 transition-colors" />
            <Panel>
              <PanelGroup direction="vertical">
                {/* First Row: Enthusiasm vs Annoyance and Calmness vs Doubt */}
                <Panel>
                  <PanelGroup direction="horizontal">
                    <Panel>
                      <div className="h-full bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-900">Enthusiasm vs Annoyance</h3>
                          <button
                            onClick={() => handleMaximize('enthusiasm-annoyance')}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {maximizedPanel === 'enthusiasm-annoyance' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                          </button>
                        </div>
                        <TrendChart
                          data={mockTrendData}
                          metrics={[
                            { key: 'enthusiasm', color: '#01A982', name: 'Enthusiasm' },
                            { key: 'annoyance', color: '#FF8D6D', name: 'Annoyance' }
                          ]}
                        />
                      </div>
                    </Panel>
                    <PanelResizeHandle className="w-2 bg-gray-100 hover:bg-gray-200 transition-colors" />
                    <Panel>
                      <div className="h-full bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-900">Calmness vs Doubt</h3>
                          <button
                            onClick={() => handleMaximize('calmness-doubt')}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {maximizedPanel === 'calmness-doubt' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                          </button>
                        </div>
                        <TrendChart
                          data={mockTrendData}
                          metrics={[
                            { key: 'calmness', color: '#425563', name: 'Calmness' },
                            { key: 'doubt', color: '#FF8D6D', name: 'Doubt' }
                          ]}
                        />
                      </div>
                    </Panel>
                  </PanelGroup>
                </Panel>
                <PanelResizeHandle className="h-2 bg-gray-100 hover:bg-gray-200 transition-colors" />
                {/* Second Row: Satisfaction vs Disapproval and Surprise */}
                <Panel>
                  <PanelGroup direction="horizontal">
                    <Panel>
                      <div className="h-full bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-900">Satisfaction vs Disapproval</h3>
                          <button
                            onClick={() => handleMaximize('satisfaction-disapproval')}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {maximizedPanel === 'satisfaction-disapproval' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                          </button>
                        </div>
                        <TrendChart
                          data={mockTrendData}
                          metrics={[
                            { key: 'satisfaction', color: '#01A982', name: 'Satisfaction' },
                            { key: 'disapproval', color: '#FF8D6D', name: 'Disapproval' }
                          ]}
                        />
                      </div>
                    </Panel>
                    <PanelResizeHandle className="w-2 bg-gray-100 hover:bg-gray-200 transition-colors" />
                    <Panel>
                      <div className="h-full bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-900">Surprise (Positive vs Negative)</h3>
                          <button
                            onClick={() => handleMaximize('surprise')}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {maximizedPanel === 'surprise' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                          </button>
                        </div>
                        <TrendChart
                          data={mockTrendData}
                          metrics={[
                            { key: 'surprisePositive', color: '#01A982', name: 'Positive Surprise' },
                            { key: 'surpriseNegative', color: '#FF8D6D', name: 'Negative Surprise' }
                          ]}
                        />
                      </div>
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

export default App;