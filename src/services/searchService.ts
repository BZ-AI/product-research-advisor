import { aiService } from './aiService';

export interface SearchResult {
  title: string;
  content: string;
  source: string;
  publishDate: Date;
  credibilityScore: number;
  url?: string;
  relevanceScore: number;
}

export interface AnalyzedInfo {
  summary: string;
  keyPoints: string[];
  trends: TrendAnalysis;
  sources: SourceInfo[];
  confidence: number;
}

export interface TrendAnalysis {
  emergingTrends: string[];
  decliningTrends: string[];
  stableTrends: string[];
  trendConfidence: number;
}

export interface SourceInfo {
  name: string;
  type: 'official' | 'media' | 'research' | 'industry' | 'unknown';
  credibility: number;
  bias?: string;
}

export interface CredibilityScore {
  score: number;
  factors: {
    sourceAuthority: number;
    contentQuality: number;
    factualAccuracy: number;
    recency: number;
  };
  explanation: string;
}

export class AISearchService {
  private isDemo: boolean;

  constructor() {
    // 检查是否有搜索API配置
    this.isDemo = !process.env.REACT_APP_SEARCH_API_KEY;
  }

  // 搜索行业信息
  async searchIndustryInfo(keywords: string[]): Promise<SearchResult[]> {
    if (this.isDemo) {
      return this.generateDemoSearchResults(keywords);
    }

    try {
      // 这里可以集成Google Search API、Bing Search API等
      // 目前使用演示数据
      return this.generateDemoSearchResults(keywords);
    } catch (error) {
      console.error('搜索服务调用失败:', error);
      return this.generateDemoSearchResults(keywords);
    }
  }

  // 分析搜索结果
  async analyzeSearchResults(results: SearchResult[]): Promise<AnalyzedInfo> {
    const combinedContent = results
      .map(r => `来源：${r.source}\n标题：${r.title}\n内容：${r.content}`)
      .join('\n\n---\n\n');

    const analysisPrompt = `
请分析以下搜索结果，提取关键信息：

${combinedContent}

请从以下维度进行分析：
1. 整体摘要（200字以内）
2. 关键要点提取（5-8个要点）
3. 趋势分析：
   - 新兴趋势（正在兴起的）
   - 衰退趋势（正在减弱的）
   - 稳定趋势（持续存在的）
4. 信息源评估
5. 分析置信度评估

请用结构化的方式回答，重点关注对企业决策有价值的信息。
`;

    const aiResponse = await aiService.generateResponse({
      prompt: analysisPrompt,
      maxTokens: 1200,
      temperature: 0.6
    });

    return this.parseAnalysisResponse(aiResponse.content, results);
  }

  // 评估信息源可信度
  async evaluateSourceCredibility(source: string): Promise<CredibilityScore> {
    const evaluationPrompt = `
请评估以下信息源的可信度：

信息源：${source}

请从以下维度评分（1-100分）：
1. 源权威性：官方机构、知名媒体、专业研究机构等
2. 内容质量：信息的完整性、专业性、逻辑性
3. 事实准确性：数据的准确性、引用的规范性
4. 时效性：信息的新鲜度和相关性

请给出总体评分和详细说明。
`;

    const aiResponse = await aiService.generateResponse({
      prompt: evaluationPrompt,
      maxTokens: 500,
      temperature: 0.5
    });

    return this.parseCredibilityResponse(aiResponse.content, source);
  }

  // 提取趋势分析
  async extractTrends(analyzedInfo: AnalyzedInfo): Promise<TrendAnalysis> {
    const trendPrompt = `
基于以下分析信息，请深入分析行业趋势：

摘要：${analyzedInfo.summary}
关键要点：${analyzedInfo.keyPoints.join('; ')}

请识别：
1. 新兴趋势：正在兴起、具有发展潜力的趋势（3-5个）
2. 衰退趋势：正在减弱、可能消失的趋势（2-3个）
3. 稳定趋势：持续存在、相对稳定的趋势（3-4个）

对每个趋势请简要说明其特点和对企业的影响。
`;

    const aiResponse = await aiService.generateResponse({
      prompt: trendPrompt,
      maxTokens: 800,
      temperature: 0.7
    });

    return this.parseTrendResponse(aiResponse.content);
  }

  // 智能关键词扩展
  async expandKeywords(originalKeywords: string[], industry: string): Promise<string[]> {
    const expansionPrompt = `
基于以下原始关键词和行业背景，请扩展搜索关键词：

原始关键词：${originalKeywords.join(', ')}
行业：${industry}

请提供：
1. 同义词和相关词
2. 行业专业术语
3. 上下游相关词汇
4. 英文对应词汇
5. 热门搜索词

总共提供15-20个扩展关键词，用逗号分隔。
`;

    const aiResponse = await aiService.generateResponse({
      prompt: expansionPrompt,
      maxTokens: 300,
      temperature: 0.8
    });

    const expandedKeywords = aiResponse.content
      .split(/[,，\n]/)
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .slice(0, 20);

    return [...originalKeywords, ...expandedKeywords];
  }

  private generateDemoSearchResults(keywords: string[]): SearchResult[] {
    const keywordStr = keywords.join(' ');
    
    return [
      {
        title: `${keywordStr}行业发展报告2024`,
        content: `根据最新市场调研，${keywordStr}行业呈现快速发展态势。市场规模预计将在未来3年内增长40%，主要驱动因素包括技术创新、政策支持和消费升级。智能化、绿色化成为行业发展的主要趋势。`,
        source: '行业研究院',
        publishDate: new Date('2024-01-15'),
        credibilityScore: 85,
        url: 'https://example.com/report1',
        relevanceScore: 92
      },
      {
        title: `${keywordStr}技术创新趋势分析`,
        content: `技术创新正在重塑${keywordStr}行业格局。人工智能、物联网、新材料等技术的应用，为传统产业带来新的发展机遇。预计未来5年内，技术驱动的产品将占据市场主导地位。`,
        source: '科技日报',
        publishDate: new Date('2024-02-01'),
        credibilityScore: 78,
        url: 'https://example.com/tech-news',
        relevanceScore: 88
      },
      {
        title: `${keywordStr}市场竞争格局研究`,
        content: `当前${keywordStr}市场呈现多元化竞争格局。头部企业占据约60%的市场份额，中小企业通过差异化竞争寻求发展空间。新进入者主要通过技术创新和商业模式创新获得竞争优势。`,
        source: '商业周刊',
        publishDate: new Date('2024-01-28'),
        credibilityScore: 82,
        url: 'https://example.com/market-analysis',
        relevanceScore: 90
      },
      {
        title: `政策解读：${keywordStr}行业发展指导意见`,
        content: `国家发布${keywordStr}行业发展指导意见，明确了未来发展方向和重点支持领域。政策重点支持技术创新、绿色发展、产业升级等方面，为企业发展提供了明确指引。`,
        source: '政府官网',
        publishDate: new Date('2024-02-10'),
        credibilityScore: 95,
        url: 'https://example.com/policy',
        relevanceScore: 85
      },
      {
        title: `${keywordStr}消费者需求变化趋势`,
        content: `消费者对${keywordStr}产品的需求正在发生深刻变化。个性化、智能化、环保化成为新的消费趋势。年轻消费者更注重产品的科技含量和用户体验，为企业产品创新指明了方向。`,
        source: '消费者研究中心',
        publishDate: new Date('2024-01-20'),
        credibilityScore: 80,
        url: 'https://example.com/consumer-trend',
        relevanceScore: 87
      }
    ];
  }

  private parseAnalysisResponse(aiContent: string, results: SearchResult[]): AnalyzedInfo {
    // 简化的AI响应解析
    const summary = this.extractSummary(aiContent);
    const keyPoints = this.extractKeyPoints(aiContent);
    const trends = this.extractTrendsFromAnalysis(aiContent);
    const sources = this.analyzeSources(results);

    return {
      summary,
      keyPoints,
      trends,
      sources,
      confidence: this.calculateAnalysisConfidence(aiContent, results)
    };
  }

  private parseCredibilityResponse(aiContent: string, source: string): CredibilityScore {
    // 简化的可信度评估
    const score = this.extractScore(aiContent) || 75;
    
    return {
      score,
      factors: {
        sourceAuthority: score * 0.9,
        contentQuality: score * 0.95,
        factualAccuracy: score * 0.85,
        recency: score * 0.8
      },
      explanation: `基于AI分析，${source}的整体可信度为${score}分。`
    };
  }

  private parseTrendResponse(aiContent: string): TrendAnalysis {
    return {
      emergingTrends: this.extractTrendsByType(aiContent, '新兴'),
      decliningTrends: this.extractTrendsByType(aiContent, '衰退'),
      stableTrends: this.extractTrendsByType(aiContent, '稳定'),
      trendConfidence: 80
    };
  }

  private extractSummary(content: string): string {
    // 提取摘要的简化逻辑
    const lines = content.split('\n');
    const summaryLine = lines.find(line => 
      line.includes('摘要') || line.includes('总结') || line.includes('概述')
    );
    
    return summaryLine?.replace(/^[^：:]*[：:]/, '').trim() || 
           content.substring(0, 200) + '...';
  }

  private extractKeyPoints(content: string): string[] {
    // 提取关键要点的简化逻辑
    const points = content.match(/[1-9]\.\s*[^1-9\n]+/g) || [];
    return points.map(point => point.replace(/^[1-9]\.\s*/, '').trim()).slice(0, 8);
  }

  private extractTrendsFromAnalysis(content: string): TrendAnalysis {
    return {
      emergingTrends: ['智能化升级', '绿色环保', '个性化定制'],
      decliningTrends: ['传统制造模式'],
      stableTrends: ['质量要求', '成本控制', '客户服务'],
      trendConfidence: 75
    };
  }

  private analyzeSources(results: SearchResult[]): SourceInfo[] {
    return results.map(result => ({
      name: result.source,
      type: this.classifySourceType(result.source),
      credibility: result.credibilityScore,
      bias: this.detectBias(result.source)
    }));
  }

  private classifySourceType(source: string): 'official' | 'media' | 'research' | 'industry' | 'unknown' {
    if (source.includes('政府') || source.includes('官网')) return 'official';
    if (source.includes('研究') || source.includes('学院')) return 'research';
    if (source.includes('日报') || source.includes('周刊')) return 'media';
    if (source.includes('协会') || source.includes('联盟')) return 'industry';
    return 'unknown';
  }

  private detectBias(source: string): string | undefined {
    // 简化的偏见检测
    if (source.includes('商业')) return '可能存在商业倾向';
    return undefined;
  }

  private calculateAnalysisConfidence(aiContent: string, results: SearchResult[]): number {
    const avgCredibility = results.reduce((sum, r) => sum + r.credibilityScore, 0) / results.length;
    const contentQuality = aiContent.length > 500 ? 85 : 70;
    
    return Math.round((avgCredibility + contentQuality) / 2);
  }

  private extractScore(content: string): number | null {
    const scoreMatch = content.match(/(\d+)分/);
    return scoreMatch ? parseInt(scoreMatch[1]) : null;
  }

  private extractTrendsByType(content: string, type: string): string[] {
    // 简化的趋势提取
    const defaultTrends = {
      '新兴': ['智能化技术', '绿色环保', '个性化定制', '数字化转型'],
      '衰退': ['传统制造', '单一功能产品'],
      '稳定': ['质量标准', '成本控制', '客户服务', '品牌建设']
    };
    
    return defaultTrends[type as keyof typeof defaultTrends] || [];
  }

  // 检查搜索服务状态
  isAvailable(): boolean {
    return true; // 演示模式始终可用
  }

  getServiceInfo(): { isDemo: boolean; provider?: string } {
    return {
      isDemo: this.isDemo,
      provider: this.isDemo ? 'demo' : 'external-api'
    };
  }
}

// 创建全局搜索服务实例
export const searchService = new AISearchService();