export interface Company {
  id: string;
  name: string;
  industry: string;
  scale: 'small' | 'medium' | 'large';
  description: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  techFeatures: string[];
  marketPosition: string;
  targetMarket: string;
  description: string;
}

export interface DocumentAnalysis {
  id: string;
  fileName: string;
  uploadTime: string;
  status: 'uploading' | 'analyzing' | 'completed' | 'failed';
  progress: number;
  results?: {
    marketTrends: string[];
    techDirections: string[];
    competitiveAnalysis: string[];
    credibilityScore: number;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  credibility: number;
  category: 'market' | 'technology' | 'competition';
  publishDate: string;
}

export interface AnalysisReport {
  id: string;
  companyId: string;
  createdAt: string;
  marketOpportunities: {
    title: string;
    description: string;
    impact: number;
    feasibility: number;
  }[];
  techSuggestions: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
  }[];
  productImprovements: {
    productId: string;
    suggestions: string[];
    expectedROI: number;
  }[];
  matchScore: number;
}

export interface ImplementationPlan {
  id: string;
  reportId: string;
  phases: {
    id: string;
    name: string;
    duration: string;
    tasks: string[];
    resources: string[];
    priority: number;
    risks: string[];
  }[];
  totalTimeline: string;
  estimatedCost: number;
}

export interface HistoryRecord {
  id: string;
  title: string;
  type: 'analysis' | 'plan' | 'report';
  createdAt: string;
  status: 'completed' | 'in-progress';
  summary: string;
}