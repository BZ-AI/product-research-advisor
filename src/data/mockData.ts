import { Company, Product, DocumentAnalysis, SearchResult, AnalysisReport, ImplementationPlan, HistoryRecord } from '../types';

export const mockCompany: Company = {
  id: '1',
  name: '阳光遮蓬科技有限公司',
  industry: '遮阳设备制造',
  scale: 'medium',
  description: '专业从事户外遮阳产品研发、生产和销售的高新技术企业',
  createdAt: '2024-01-15'
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: '智能电动遮阳篷',
    category: '智能遮阳设备',
    techFeatures: ['自动感应', '远程控制', '防风保护', '节能电机'],
    marketPosition: '高端智能产品',
    targetMarket: '高端住宅、商业空间',
    description: '集成IoT技术的智能遮阳解决方案'
  },
  {
    id: '2',
    name: '折叠式户外遮阳伞',
    category: '便携遮阳设备',
    techFeatures: ['轻量化材料', '快速折叠', '抗UV涂层'],
    marketPosition: '中端便民产品',
    targetMarket: '个人消费者、户外活动',
    description: '便携高效的个人遮阳产品'
  }
];

export const mockDocumentAnalysis: DocumentAnalysis[] = [
  {
    id: '1',
    fileName: '2024年全球遮阳设备市场报告.pdf',
    uploadTime: '2024-12-20 10:30:00',
    status: 'completed',
    progress: 100,
    results: {
      marketTrends: ['智能化趋势明显', '环保材料需求增长', '定制化服务受欢迎'],
      techDirections: ['IoT集成技术', '新材料应用', '自动化控制系统'],
      competitiveAnalysis: ['欧美品牌技术领先', '中国制造成本优势', '新兴品牌重视创新'],
      credibilityScore: 92
    }
  },
  {
    id: '2',
    fileName: '户外遮阳行业技术发展白皮书.docx',
    uploadTime: '2024-12-20 14:20:00',
    status: 'analyzing',
    progress: 65
  }
];

export const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: '智能遮阳设备市场预计2025年增长25%',
    content: '根据最新市场调研，智能遮阳设备市场呈现快速增长态势，消费者对自动化和智能化产品需求旺盛...',
    source: '行业研究院',
    credibility: 88,
    category: 'market',
    publishDate: '2024-12-18'
  },
  {
    id: '2',
    title: '新型纳米材料在遮阳产品中的应用突破',
    content: '最新研发的纳米涂层技术可以显著提升遮阳效果，同时具备自清洁功能...',
    source: '材料科学期刊',
    credibility: 95,
    category: 'technology',
    publishDate: '2024-12-15'
  }
];

export const mockAnalysisReport: AnalysisReport = {
  id: '1',
  companyId: '1',
  createdAt: '2024-12-20 15:30:00',
  marketOpportunities: [
    {
      title: '智能家居集成市场',
      description: '随着智能家居普及，遮阳设备与智能家居系统集成需求增长',
      impact: 85,
      feasibility: 78
    },
    {
      title: '商业建筑节能改造',
      description: '政策推动下的商业建筑节能改造为遮阳设备带来新机遇',
      impact: 78,
      feasibility: 85
    }
  ],
  techSuggestions: [
    {
      title: '研发AI驱动的自适应遮阳系统',
      description: '基于环境感知和用户习惯的智能遮阳控制系统',
      priority: 'high',
      timeline: '12-18个月'
    },
    {
      title: '开发新型轻量化材料',
      description: '研发更轻便、更耐用的遮阳材料',
      priority: 'medium',
      timeline: '8-12个月'
    }
  ],
  productImprovements: [
    {
      productId: '1',
      suggestions: ['增加语音控制功能', '优化电机静音效果', '增强防风能力'],
      expectedROI: 35
    },
    {
      productId: '2',
      suggestions: ['改进折叠机构设计', '提升材料防水性能'],
      expectedROI: 28
    }
  ],
  matchScore: 82
};

export const mockImplementationPlan: ImplementationPlan = {
  id: '1',
  reportId: '1',
  phases: [
    {
      id: '1',
      name: '技术调研与方案设计',
      duration: '2个月',
      tasks: ['市场调研', '技术方案设计', '可行性分析'],
      resources: ['研发团队5人', '市场调研费用10万'],
      priority: 1,
      risks: ['技术方案可行性风险', '市场需求变化风险']
    },
    {
      id: '2',
      name: '原型开发与测试',
      duration: '4个月',
      tasks: ['原型开发', '功能测试', '用户测试'],
      resources: ['研发团队8人', '设备采购费用20万'],
      priority: 2,
      risks: ['开发进度风险', '技术实现难度风险']
    }
  ],
  totalTimeline: '12个月',
  estimatedCost: 150
};

export const mockHistoryRecords: HistoryRecord[] = [
  {
    id: '1',
    title: '阳光遮蓬产品分析报告',
    type: 'analysis',
    createdAt: '2024-12-20 15:30:00',
    status: 'completed',
    summary: '基于2024年市场报告的产品发展建议分析'
  },
  {
    id: '2',
    title: '智能遮阳技术实施方案',
    type: 'plan',
    createdAt: '2024-12-19 09:15:00',
    status: 'completed',
    summary: '智能遮阳系统技术升级的详细实施计划'
  },
  {
    id: '3',
    title: '市场机会分析报告',
    type: 'report',
    createdAt: '2024-12-18 16:45:00',
    status: 'in-progress',
    summary: '2025年遮阳设备市场机会深度分析'
  }
];