export interface SentimentMetric {
  value: number;
  change: number;
}

export interface Metrics {
  netPositivity: SentimentMetric;
  interest: SentimentMetric;
  enthusiasm: SentimentMetric;
  calmness: SentimentMetric;
  satisfaction: SentimentMetric;
  surprisePositive: SentimentMetric;
}

export interface AnalystQuestion {
  analyst: string;
  question: string;
  quarter: string;
  year: number;
  netPositivity: number;
  netNegativity: number;
  stockChangeNextDay: number;
}

export interface TrendData {
  quarter: string;
  netPositivity: number;
  netNegativity: number;
  interest: number;
  enthusiasm: number;
  calmness: number;
  satisfaction: number;
  surprisePositive: number;
}