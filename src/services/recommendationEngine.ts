import { aiService } from './aiService';

export interface RecommendationRequest {
  industryAnalysis: any;
  companyAnalysis: any;
  documentData?: any[];
  searchData?: any;
  preferences?: RecommendationPreferences;
}

export interface RecommendationPreferences {
  focusAreas: string[]; // 重点关注领域
  timeHorizon: 'short' | 'medium' | 'long'; // 时间范围
  riskTolerance: 'low' | 'medium' | 'high'; // 风险承受度
  budgetRange: 'low' | 'medium' | 'high'; // 预算范围
  priorityType: 'innovation' | 'market' | 'efficiency' | 'growth'; // 优先级类型
}

export interface EnhancedRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'market' | 'technology' | 'product' | 'strategy';
  priority: 'high' | 'medium' | 'low';
  
  // 评估指标
  feasibility: number; // 可行性 (0-100)
  impact: number; // 影响度 (0-100)
  urgency: number; // 紧急度 (0-100)
  roi: number; // 投资回报率预估 (0-100)
  
  // 详细信息
  timeline: string;
  resources: ResourceRequirement[];
  risks: RiskAssessment[];
  successMetrics: SuccessMetric[];
  implementationSteps: ImplementationStep[];
  
  // AI增强信息
  aiConfidence: number; // AI置信度
  marketAlignment: number; // 市场匹配度
  competitiveAdvantage: number; // 竞争优势度
  
  // 关联数据
  relatedTrends: string[];
  supportingEvidence: string[];
  alternativeOptions: string[];
}

export interface ResourceRequirement {
  type: 'human' | 'financial' | 'technical' | 'infrastructure';
  description: string;
  quantity: string;
  cost?: string;
  availability: 'available' | 'acquirable' | 'challenging';
}

export interface RiskAssessment {
  type: 'technical' | 'market' | 'financial' | 'operational' | 'regulatory';
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface SuccessMetric {
  metric: string;
  target: string;
  timeframe: string;
  measurement: string;
}

export interface ImplementationStep {
  phase: string;
  description: string;
  duration: string;
  dependencies: string[];
  deliverables: string[];
  keyMilestones: string[];
}

export class RecommendationEngine {
  // 生成个性化建议
  async generateRecommendations(request: RecommendationRequest): Promise<EnhancedRecommendation[]> {
    try {
      // 构建综合分析上下文
      const context = this.buildAnalysisContext(request);
      
      // 使用AI生成初始建议
      const aiRecommendations = await this.generateAIRecommendations(context);
      
      // 增强和优化建议
      const enhancedRecommendations = await this.enhanceRecommendations(aiRecommendations, request);
      
      // 排序和筛选
      const finalRecommendations = this.prioritizeRecommendations(enhancedRecommendations, request.preferences);
      
      return finalRecommendations;
    } catch (error) {
      console.error('建议生成失败:', error);
      // 返回基础建议作为后备
      return this.generateFallbackRecommendations(request);
    }
  }

  // 构建分析上下文
  private buildAnalysisContext(request: RecommendationRequest): string {
    const { industryAnalysis, companyAnalysis, documentData, searchData } = request;
    
    let context = `
## 行业分析摘要
行业：${industryAnalysis?.industry || '遮阳蓬行业'}
完成度：${industryAnalysis?.completionRate || 0}%
关键发现：${this.extractKeyFindings(industryAnalysis?.answers)}

## 企业分析摘要  
企业：${companyAnalysis?.companyName || '广东格绿朗节能科技有限公司'}
完成度：${companyAnalysis?.completionRate || 0}%
关键发现：${this.extractKeyFindings(companyAnalysis?.answers)}
`;

    // 添加文档数据
    if (documentData && documentData.length > 0) {
      context += `\n## 文档解析数据\n`;
      documentData.forEach((doc, index) => {
        context += `文档${index + 1}：${doc.originalFileName}\n`;
        context += `摘要：${doc.aiSummary}\n`;
        context += `关键洞察：${doc.extractedData?.actionableInsights?.join('; ') || '无'}\n\n`;
      });
    }

    // 添加搜索数据
    if (searchData) {
      context += `\n## 智能搜索数据\n`;
      context += `摘要：${searchData.summary}\n`;
      context += `关键要点：${searchData.keyPoints?.join('; ') || '无'}\n`;
      context += `新兴趋势：${searchData.trends?.emergingTrends?.join('; ') || '无'}\n`;
    }

    return context;
  }

  // 使用AI生成建议
  private async generateAIRecommendations(context: string): Promise<any[]> {
    const prompt = `
基于以下综合分析，请生成5-8项具体的、可操作的研发建议：

${context}

请为每项建议提供：
1. 建议标题（简洁明确）
2. 详细描述（150-200字）
3. 分类（market/technology/product/strategy）
4. 优先级（high/medium/low）
5. 可行性评分（0-100）
6. 影响度评分（0-100）
7. 紧急度评分（0-100）
8. ROI预估（0-100）
9. 预计时间周期
10. 所需资源（人力、资金、技术、基础设施）
11. 主要风险和缓解措施
12. 成功指标
13. 实施步骤（3-5个阶段）

请确保建议：
- 基于实际分析数据
- 具有针对性和可操作性
- 考虑企业实际能力和资源
- 符合行业发展趋势
- 有明确的价值主张

请用JSON格式返回，确保数据结构完整。
`;

    const response = await aiService.generateResponse({
      prompt,
      maxTokens: 3000,
      temperature: 0.7
    });

    try {
      const recommendations = JSON.parse(response.content);
      return Array.isArray(recommendations) ? recommendations : [recommendations];
    } catch (error) {
      console.error('AI建议解析失败:', error);
      return this.generateStructuredFallback();
    }
  }

  // 增强建议
  private async enhanceRecommendations(
    recommendations: any[], 
    request: RecommendationRequest
  ): Promise<EnhancedRecommendation[]> {
    const enhanced: EnhancedRecommendation[] = [];

    for (const rec of recommendations) {
      try {
        // 使用AI进一步分析每个建议
        const enhancementPrompt = `
请深入分析以下研发建议，提供更详细的评估：

建议：${rec.title}
描述：${rec.description}

请提供：
1. AI置信度评估（基于数据支撑程度）
2. 市场匹配度分析（与当前市场需求的匹配程度）
3. 竞争优势度评估（相对于竞争对手的优势）
4. 相关市场趋势
5. 支撑证据
6. 替代方案

请用结构化的方式回答。
`;

        const enhancementResponse = await aiService.generateResponse({
          prompt: enhancementPrompt,
          maxTokens: 800,
          temperature: 0.6
        });

        const enhancedRec: EnhancedRecommendation = {
          id: this.generateId(),
          title: rec.title || '未命名建议',
          description: rec.description || '暂无描述',
          category: rec.category || 'strategy',
          priority: rec.priority || 'medium',
          
          feasibility: rec.feasibility || 70,
          impact: rec.impact || 70,
          urgency: rec.urgency || 50,
          roi: rec.roi || 60,
          
          timeline: rec.timeline || '6-12个月',
          resources: this.parseResources(rec.resources),
          risks: this.parseRisks(rec.risks),
          successMetrics: this.parseSuccessMetrics(rec.successMetrics),
          implementationSteps: this.parseImplementationSteps(rec.implementationSteps),
          
          aiConfidence: this.extractConfidence(enhancementResponse.content),
          marketAlignment: this.extractAlignment(enhancementResponse.content),
          competitiveAdvantage: this.extractAdvantage(enhancementResponse.content),
          
          relatedTrends: this.extractTrends(enhancementResponse.content),
          supportingEvidence: this.extractEvidence(enhancementResponse.content),
          alternativeOptions: this.extractAlternatives(enhancementResponse.content)
        };

        enhanced.push(enhancedRec);
      } catch (error) {
        console.error('建议增强失败:', error);
        // 使用基础版本
        enhanced.push(this.createBasicRecommendation(rec));
      }
    }

    return enhanced;
  }

  // 建议优先级排序
  private prioritizeRecommendations(
    recommendations: EnhancedRecommendation[], 
    preferences?: RecommendationPreferences
  ): EnhancedRecommendation[] {
    return recommendations.sort((a, b) => {
      // 综合评分算法
      const scoreA = this.calculateOverallScore(a, preferences);
      const scoreB = this.calculateOverallScore(b, preferences);
      
      return scoreB - scoreA; // 降序排列
    });
  }

  // 计算综合评分
  private calculateOverallScore(
    rec: EnhancedRecommendation, 
    preferences?: RecommendationPreferences
  ): number {
    let score = 0;
    
    // 基础评分（40%权重）
    score += (rec.feasibility * 0.15 + rec.impact * 0.15 + rec.roi * 0.1) * 0.4;
    
    // AI评估（30%权重）
    score += (rec.aiConfidence * 0.1 + rec.marketAlignment * 0.1 + rec.competitiveAdvantage * 0.1) * 0.3;
    
    // 优先级权重（20%权重）
    const priorityScore = rec.priority === 'high' ? 100 : rec.priority === 'medium' ? 70 : 40;
    score += priorityScore * 0.2;
    
    // 紧急度（10%权重）
    score += rec.urgency * 0.1;
    
    // 根据偏好调整
    if (preferences) {
      score = this.adjustScoreByPreferences(score, rec, preferences);
    }
    
    return score;
  }

  // 根据偏好调整评分
  private adjustScoreByPreferences(
    baseScore: number, 
    rec: EnhancedRecommendation, 
    preferences: RecommendationPreferences
  ): number {
    let adjustedScore = baseScore;
    
    // 时间范围偏好
    if (preferences.timeHorizon === 'short' && rec.timeline.includes('3-6')) {
      adjustedScore *= 1.2;
    } else if (preferences.timeHorizon === 'long' && rec.timeline.includes('18-24')) {
      adjustedScore *= 1.1;
    }
    
    // 风险承受度
    const avgRiskLevel = this.calculateAverageRiskLevel(rec.risks);
    if (preferences.riskTolerance === 'low' && avgRiskLevel === 'low') {
      adjustedScore *= 1.15;
    } else if (preferences.riskTolerance === 'high' && avgRiskLevel === 'high') {
      adjustedScore *= 1.1;
    }
    
    // 优先级类型
    if (preferences.priorityType === 'innovation' && rec.category === 'technology') {
      adjustedScore *= 1.2;
    } else if (preferences.priorityType === 'market' && rec.category === 'market') {
      adjustedScore *= 1.2;
    }
    
    return adjustedScore;
  }

  // 辅助方法
  private extractKeyFindings(answers: Record<number, any>): string {
    if (!answers) return '暂无数据';
    
    const findings = Object.values(answers)
      .map((answer: any) => answer.keyPoints?.join('; ') || answer.answer?.substring(0, 100))
      .filter(Boolean)
      .slice(0, 3)
      .join('; ');
    
    return findings || '暂无关键发现';
  }

  private parseResources(resources: any): ResourceRequirement[] {
    if (!Array.isArray(resources)) return [];
    
    return resources.map(r => ({
      type: 'human',
      description: typeof r === 'string' ? r : r.description || '未指定',
      quantity: r.quantity || '待评估',
      availability: 'acquirable'
    }));
  }

  private parseRisks(risks: any): RiskAssessment[] {
    if (!Array.isArray(risks)) return [];
    
    return risks.map(r => ({
      type: 'operational',
      description: typeof r === 'string' ? r : r.description || '未指定风险',
      probability: 'medium',
      impact: 'medium',
      mitigation: r.mitigation || '需要制定缓解措施'
    }));
  }

  private parseSuccessMetrics(metrics: any): SuccessMetric[] {
    if (!Array.isArray(metrics)) return [];
    
    return metrics.map(m => ({
      metric: typeof m === 'string' ? m : m.metric || '未指定指标',
      target: m.target || '待设定',
      timeframe: m.timeframe || '12个月',
      measurement: m.measurement || '定期评估'
    }));
  }

  private parseImplementationSteps(steps: any): ImplementationStep[] {
    if (!Array.isArray(steps)) return [];
    
    return steps.map((step, index) => ({
      phase: `阶段${index + 1}`,
      description: typeof step === 'string' ? step : step.description || '未指定',
      duration: step.duration || '2-3个月',
      dependencies: step.dependencies || [],
      deliverables: step.deliverables || [],
      keyMilestones: step.keyMilestones || []
    }));
  }

  private extractConfidence(content: string): number {
    // 简化的置信度提取
    const match = content.match(/置信度[：:]?\s*(\d+)/);
    return match ? parseInt(match[1]) : 75;
  }

  private extractAlignment(content: string): number {
    // 简化的匹配度提取
    const match = content.match(/匹配度[：:]?\s*(\d+)/);
    return match ? parseInt(match[1]) : 70;
  }

  private extractAdvantage(content: string): number {
    // 简化的优势度提取
    const match = content.match(/优势度[：:]?\s*(\d+)/);
    return match ? parseInt(match[1]) : 65;
  }

  private extractTrends(content: string): string[] {
    // 简化的趋势提取
    return ['智能化升级', '绿色环保', '个性化定制'];
  }

  private extractEvidence(content: string): string[] {
    // 简化的证据提取
    return ['市场需求增长', '政策支持', '技术成熟度提升'];
  }

  private extractAlternatives(content: string): string[] {
    // 简化的替代方案提取
    return ['分阶段实施', '合作开发', '技术引进'];
  }

  private createBasicRecommendation(rec: any): EnhancedRecommendation {
    return {
      id: this.generateId(),
      title: rec.title || '基础建议',
      description: rec.description || '暂无详细描述',
      category: rec.category || 'strategy',
      priority: rec.priority || 'medium',
      feasibility: rec.feasibility || 70,
      impact: rec.impact || 70,
      urgency: 50,
      roi: 60,
      timeline: rec.timeline || '6-12个月',
      resources: [],
      risks: [],
      successMetrics: [],
      implementationSteps: [],
      aiConfidence: 60,
      marketAlignment: 65,
      competitiveAdvantage: 60,
      relatedTrends: [],
      supportingEvidence: [],
      alternativeOptions: []
    };
  }

  private calculateAverageRiskLevel(risks: RiskAssessment[]): 'low' | 'medium' | 'high' {
    if (risks.length === 0) return 'medium';
    
    const riskScores = risks.map(r => {
      const probScore = r.probability === 'high' ? 3 : r.probability === 'medium' ? 2 : 1;
      const impactScore = r.impact === 'high' ? 3 : r.impact === 'medium' ? 2 : 1;
      return probScore * impactScore;
    });
    
    const avgScore = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;
    
    if (avgScore <= 3) return 'low';
    if (avgScore <= 6) return 'medium';
    return 'high';
  }

  private generateStructuredFallback(): any[] {
    return [
      {
        title: '智能化产品升级',
        description: '基于IoT和AI技术，开发智能遮阳控制系统',
        category: 'technology',
        priority: 'high',
        feasibility: 75,
        impact: 85,
        urgency: 70,
        roi: 80
      },
      {
        title: '商业建筑市场拓展',
        description: '重点开发商业建筑节能改造市场',
        category: 'market',
        priority: 'high',
        feasibility: 85,
        impact: 75,
        urgency: 60,
        roi: 70
      }
    ];
  }

  private generateFallbackRecommendations(request: RecommendationRequest): EnhancedRecommendation[] {
    const fallbackData = this.generateStructuredFallback();
    return fallbackData.map(rec => this.createBasicRecommendation(rec));
  }

  private generateId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 创建全局建议引擎实例
export const recommendationEngine = new RecommendationEngine();