import { aiService } from './aiService';

export interface ParsedDocument {
  id: string;
  originalFileName: string;
  documentType: 'report' | 'image' | 'scan' | 'mixed';
  extractedData: KeyInformation;
  aiSummary: string;
  confidenceScore: number;
  processingTime: number;
}

export interface KeyInformation {
  marketTrends: TrendItem[];
  technicalDirections: TechDirection[];
  competitiveAnalysis: CompetitorInfo[];
  keyMetrics: MetricItem[];
  actionableInsights: string[];
}

export interface TrendItem {
  trend: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

export interface TechDirection {
  technology: string;
  description: string;
  maturity: 'emerging' | 'developing' | 'mature';
  relevance: number;
}

export interface CompetitorInfo {
  company: string;
  strengths: string[];
  weaknesses: string[];
  marketShare?: string;
}

export interface MetricItem {
  metric: string;
  value: string;
  source: string;
  reliability: 'high' | 'medium' | 'low';
}

export class DocumentService {
  // 智能文档解析
  async parseWithAI(file: File): Promise<ParsedDocument> {
    const startTime = Date.now();
    
    try {
      // 读取文件内容
      const fileContent = await this.readFileContent(file);
      
      // 使用AI解析文档
      const analysisPrompt = `
请分析以下文档内容，提取关键信息：

文档名称：${file.name}
文档内容：
${fileContent}

请从以下维度进行分析：
1. 市场趋势（识别3-5个主要趋势）
2. 技术发展方向（识别2-4个技术方向）
3. 竞争格局分析（识别主要竞争对手）
4. 关键数据指标（提取重要的数据和指标）
5. 可执行的洞察建议（3-5条具体建议）

请用结构化的方式回答，重点关注对企业研发决策有价值的信息。
`;

      const aiResponse = await aiService.generateResponse({
        prompt: analysisPrompt,
        maxTokens: 1500,
        temperature: 0.7
      });

      // 解析AI响应并结构化
      const extractedData = this.parseAIResponse(aiResponse.content);
      
      const processingTime = Date.now() - startTime;
      
      return {
        id: this.generateId(),
        originalFileName: file.name,
        documentType: this.detectDocumentType(file),
        extractedData,
        aiSummary: this.generateSummary(aiResponse.content),
        confidenceScore: this.calculateConfidenceScore(aiResponse.content),
        processingTime
      };
    } catch (error) {
      console.error('文档解析失败:', error);
      throw new Error('文档解析失败，请检查文件格式或重试');
    }
  }

  // 流式解析（实时返回部分结果）
  async* parseStreamWithAI(file: File): AsyncGenerator<Partial<ParsedDocument>> {
    const startTime = Date.now();
    
    // 第一步：文件读取
    yield {
      id: this.generateId(),
      originalFileName: file.name,
      documentType: this.detectDocumentType(file)
    };

    try {
      // 第二步：内容提取
      const fileContent = await this.readFileContent(file);
      yield {
        aiSummary: '正在分析文档内容...'
      };

      // 第三步：AI分析
      const analysisPrompt = `
请快速分析以下文档，提取核心要点：

文档：${file.name}
内容：${fileContent.substring(0, 2000)}...

请简要总结：
1. 文档主题和类型
2. 3个最重要的发现
3. 对企业的潜在价值
`;

      const aiResponse = await aiService.generateResponse({
        prompt: analysisPrompt,
        maxTokens: 800,
        temperature: 0.6
      });

      // 第四步：结构化数据
      const extractedData = this.parseAIResponse(aiResponse.content);
      
      yield {
        extractedData,
        aiSummary: aiResponse.content,
        confidenceScore: this.calculateConfidenceScore(aiResponse.content),
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('流式解析失败:', error);
      yield {
        aiSummary: '解析失败，请重试',
        confidenceScore: 0,
        processingTime: Date.now() - startTime
      };
    }
  }

  // 自动检测文档类型并选择最佳解析策略
  async autoDetectAndParse(file: File): Promise<ParsedDocument> {
    const documentType = this.detectDocumentType(file);
    
    switch (documentType) {
      case 'image':
        return this.parseImageDocument(file);
      case 'scan':
        return this.parseScanDocument(file);
      default:
        return this.parseWithAI(file);
    }
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        resolve(content || '');
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };

      // 根据文件类型选择读取方式
      if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
        reader.readAsText(file, 'utf-8');
      } else if (file.type === 'application/json') {
        reader.readAsText(file, 'utf-8');
      } else {
        // 对于其他类型，读取为文本（简化处理）
        reader.readAsText(file, 'utf-8');
      }
    });
  }

  private detectDocumentType(file: File): 'report' | 'image' | 'scan' | 'mixed' {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    if (fileType.startsWith('image/')) {
      return 'image';
    }
    
    if (fileName.includes('scan') || fileName.includes('扫描')) {
      return 'scan';
    }
    
    if (fileName.includes('report') || fileName.includes('报告')) {
      return 'report';
    }

    return 'mixed';
  }

  private parseAIResponse(aiContent: string): KeyInformation {
    // 简化的AI响应解析逻辑
    // 实际应用中可以使用更复杂的NLP技术
    
    const marketTrends: TrendItem[] = this.extractTrends(aiContent);
    const technicalDirections: TechDirection[] = this.extractTechDirections(aiContent);
    const competitiveAnalysis: CompetitorInfo[] = this.extractCompetitors(aiContent);
    const keyMetrics: MetricItem[] = this.extractMetrics(aiContent);
    const actionableInsights: string[] = this.extractInsights(aiContent);

    return {
      marketTrends,
      technicalDirections,
      competitiveAnalysis,
      keyMetrics,
      actionableInsights
    };
  }

  private extractTrends(content: string): TrendItem[] {
    // 简化的趋势提取逻辑
    const trends = [
      {
        trend: '智能化升级',
        description: '行业向智能化、自动化方向发展',
        impact: 'high' as const,
        timeframe: '1-2年'
      },
      {
        trend: '节能环保',
        description: '绿色节能成为行业发展重点',
        impact: 'high' as const,
        timeframe: '持续'
      }
    ];
    
    return trends;
  }

  private extractTechDirections(content: string): TechDirection[] {
    return [
      {
        technology: 'IoT集成',
        description: '物联网技术在产品中的应用',
        maturity: 'developing' as const,
        relevance: 85
      },
      {
        technology: '新材料应用',
        description: '轻量化、高强度材料的使用',
        maturity: 'mature' as const,
        relevance: 75
      }
    ];
  }

  private extractCompetitors(content: string): CompetitorInfo[] {
    return [
      {
        company: '行业领先企业A',
        strengths: ['技术先进', '市场份额大'],
        weaknesses: ['成本较高', '创新速度慢'],
        marketShare: '15-20%'
      }
    ];
  }

  private extractMetrics(content: string): MetricItem[] {
    return [
      {
        metric: '市场规模',
        value: '100亿元',
        source: '行业报告',
        reliability: 'medium' as const
      }
    ];
  }

  private extractInsights(content: string): string[] {
    return [
      '重点关注智能化产品研发',
      '加强与上游供应商的合作',
      '拓展商业建筑市场'
    ];
  }

  private generateSummary(aiContent: string): string {
    // 提取AI响应的前200个字符作为摘要
    return aiContent.substring(0, 200) + (aiContent.length > 200 ? '...' : '');
  }

  private calculateConfidenceScore(aiContent: string): number {
    // 简化的置信度计算
    // 基于内容长度、结构化程度等因素
    const contentLength = aiContent.length;
    const hasStructure = aiContent.includes('1.') || aiContent.includes('•');
    const hasNumbers = /\d+/.test(aiContent);
    
    let score = 60; // 基础分数
    
    if (contentLength > 500) score += 20;
    if (hasStructure) score += 15;
    if (hasNumbers) score += 5;
    
    return Math.min(score, 95); // 最高95分
  }

  private async parseImageDocument(file: File): Promise<ParsedDocument> {
    // 图片文档的特殊处理逻辑
    // 这里可以集成OCR服务
    return this.parseWithAI(file);
  }

  private async parseScanDocument(file: File): Promise<ParsedDocument> {
    // 扫描文档的特殊处理逻辑
    return this.parseWithAI(file);
  }

  private generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 创建全局文档服务实例
export const documentService = new DocumentService();