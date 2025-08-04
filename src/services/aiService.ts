// AI服务层 - 集成大语言模型API
export interface AIServiceConfig {
  apiKey?: string;
  baseURL?: string;
  model?: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
}

export interface AnalysisRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export class AIService {
  private config: AIServiceConfig;
  private isDemo: boolean;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.REACT_APP_OPENAI_API_KEY,
      baseURL: config.baseURL || 'https://api.openai.com/v1',
      model: config.model || 'gpt-4',
      ...config
    };
    
    // 如果没有API密钥，使用演示模式
    this.isDemo = !this.config.apiKey;
  }

  async generateResponse(request: AnalysisRequest): Promise<AIResponse> {
    if (this.isDemo) {
      return this.generateDemoResponse(request);
    }

    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的产品研发顾问，专门为企业提供基于行业分析的研发建议。请用中文回答，内容要专业、具体、可操作。'
            },
            {
              role: 'user',
              content: request.context ? `${request.context}\n\n${request.prompt}` : request.prompt
            }
          ],
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature || 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`AI API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage,
        model: data.model
      };
    } catch (error) {
      console.error('AI服务调用失败:', error);
      // 降级到演示模式
      return this.generateDemoResponse(request);
    }
  }

  private async generateDemoResponse(request: AnalysisRequest): Promise<AIResponse> {
    // 模拟AI响应延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // 基于prompt关键词生成相应的演示回答
    const prompt = request.prompt.toLowerCase();
    let demoContent = '';

    if (prompt.includes('行业') || prompt.includes('市场')) {
      demoContent = `基于当前市场分析，遮阳蓬行业正处于快速发展期。主要趋势包括：

1. **智能化升级**：消费者对智能家居集成的需求不断增长，自动化遮阳系统成为新的增长点。

2. **节能环保要求**：政策推动下，建筑节能改造市场需求旺盛，为遮阳产品带来新机遇。

3. **材料技术进步**：新型轻量化、高强度材料的应用，提升了产品性能和用户体验。

4. **定制化趋势**：商业建筑和高端住宅对个性化遮阳解决方案的需求增加。

建议重点关注智能控制系统的研发和商业建筑市场的拓展。`;
    } else if (prompt.includes('企业') || prompt.includes('公司')) {
      demoContent = `基于企业现状分析，广东格绿朗节能科技有限公司具备以下优势和发展方向：

**核心优势：**
- 在遮阳蓬制造领域有一定技术积累
- 位于广东制造业集群，供应链优势明显
- 节能科技定位符合行业发展趋势

**发展建议：**
1. **技术升级**：投入智能控制系统研发，提升产品附加值
2. **市场拓展**：重点开发商业建筑节能改造市场
3. **产学研合作**：与高校建立合作关系，提升创新能力
4. **品牌建设**：强化节能环保品牌形象

**实施优先级：**
- 短期：完善现有产品线，提升质量稳定性
- 中期：开发智能化产品，拓展新市场
- 长期：建立行业领先地位，实现规模化发展`;
    } else if (prompt.includes('建议') || prompt.includes('推荐')) {
      demoContent = `基于综合分析，为企业提供以下研发建议：

**高优先级项目：**
1. **智能遮阳控制系统**
   - 投资回报：预期18个月内收回投资
   - 市场潜力：智能家居市场年增长率30%+
   - 技术可行性：现有技术基础良好

2. **商业建筑节能解决方案**
   - 政策支持：建筑节能改造补贴政策
   - 市场规模：千亿级市场空间
   - 竞争优势：先发优势明显

**中优先级项目：**
3. **新材料研发**：轻量化、高强度材料应用
4. **产学研合作**：与高校建立长期合作关系

**实施建议：**
- 建立专门的研发团队
- 设立创新基金，年投入不少于营收的5%
- 建立项目管理体系，确保执行效果`;
    } else {
      demoContent = `基于您的问题，我建议从以下几个方面进行深入分析：

1. **市场机会识别**：分析当前市场空白和潜在需求
2. **技术能力评估**：评估现有技术基础和发展潜力  
3. **竞争优势分析**：识别差异化竞争点
4. **资源配置优化**：合理分配研发资源和投入
5. **风险控制策略**：制定风险防范和应对措施

建议结合具体的企业情况和行业特点，制定个性化的发展策略。`;
    }

    return {
      content: demoContent,
      usage: {
        promptTokens: request.prompt.length,
        completionTokens: demoContent.length,
        totalTokens: request.prompt.length + demoContent.length
      },
      model: 'demo-model'
    };
  }

  // 智能问答增强
  async enhanceQuestionAnswer(question: string, answer: string, context?: string): Promise<string> {
    const prompt = `
请基于以下问题和回答，提供专业的分析和建议：

问题：${question}
回答：${answer}
${context ? `背景信息：${context}` : ''}

请从以下角度进行分析：
1. 回答的关键要点提取
2. 潜在的机会和风险识别  
3. 具体的行动建议
4. 需要进一步关注的方面

请用专业、简洁的语言回答，重点突出可操作性。
`;

    const response = await this.generateResponse({ prompt, maxTokens: 800 });
    return response.content;
  }

  // 生成个性化建议
  async generatePersonalizedRecommendations(
    industryAnalysis: any, 
    companyAnalysis: any
  ): Promise<any[]> {
    const prompt = `
基于以下行业分析和企业分析结果，请生成5-8项具体的、可操作的研发建议：

行业分析摘要：
- 行业：${industryAnalysis.industry}
- 完成度：${industryAnalysis.completionRate}%
- 关键发现：${this.extractKeyFindings(industryAnalysis.answers)}

企业分析摘要：
- 企业：${companyAnalysis.companyName}  
- 完成度：${companyAnalysis.completionRate}%
- 关键发现：${this.extractKeyFindings(companyAnalysis.answers)}

请为每项建议提供：
1. 建议标题（简洁明确）
2. 详细描述（200字以内）
3. 优先级（high/medium/low）
4. 可行性评分（1-100）
5. 影响度评分（1-100）
6. 预计时间周期
7. 所需资源
8. 主要风险
9. 成功指标
10. 实施步骤（3-5步）

请用JSON格式返回，确保建议具有针对性和可操作性。
`;

    const response = await this.generateResponse({ 
      prompt, 
      maxTokens: 2000,
      temperature: 0.8 
    });

    try {
      // 尝试解析JSON响应
      const recommendations = JSON.parse(response.content);
      return Array.isArray(recommendations) ? recommendations : [recommendations];
    } catch (error) {
      // 如果JSON解析失败，返回结构化的演示数据
      return this.generateDemoRecommendations(industryAnalysis, companyAnalysis);
    }
  }

  private extractKeyFindings(answers: Record<number, any>): string {
    const findings = Object.values(answers)
      .map((answer: any) => answer.keyPoints?.join('; ') || answer.answer?.substring(0, 100))
      .filter(Boolean)
      .slice(0, 3)
      .join('; ');
    
    return findings || '暂无关键发现';
  }

  private generateDemoRecommendations(industryAnalysis: any, companyAnalysis: any): any[] {
    return [
      {
        id: '1',
        title: '开发智能化遮阳控制系统',
        description: '基于IoT技术和AI算法，开发能够自动感知环境变化并调节遮阳角度的智能控制系统，满足智能家居集成需求。',
        category: 'technology',
        priority: 'high',
        feasibility: 78,
        impact: 85,
        timeline: '12-18个月',
        resources: ['研发团队8人', '技术投入150万', 'IoT设备采购'],
        risks: ['技术实现复杂度', '市场接受度不确定', '竞争对手抢先'],
        successMetrics: ['产品上市时间', '客户满意度>85%', '市场份额提升15%'],
        implementationSteps: [
          '技术调研和方案设计（2个月）',
          '核心算法开发（4个月）',
          '硬件集成和测试（3个月）',
          '用户测试和优化（2个月）',
          '产品发布和推广（1个月）'
        ]
      },
      {
        id: '2',
        title: '拓展商业建筑节能改造市场',
        description: '抓住政策机遇，重点开发适用于商业建筑的大型遮阳系统，提供节能改造整体解决方案。',
        category: 'market',
        priority: 'high',
        feasibility: 85,
        impact: 78,
        timeline: '6-12个月',
        resources: ['销售团队扩充', '市场推广费用80万', '技术支持团队'],
        risks: ['政策变化风险', '项目周期长', '资金回收慢'],
        successMetrics: ['新增大客户5家', '项目合同额>500万', 'ROI>25%'],
        implementationSteps: [
          '市场调研和客户开发（2个月）',
          '产品方案定制化（2个月）',
          '试点项目实施（4个月）',
          '成功案例推广（4个月）'
        ]
      }
    ];
  }

  // 检查AI服务状态
  isAvailable(): boolean {
    return !!this.config.apiKey || this.isDemo;
  }

  getServiceInfo(): { isDemo: boolean; model?: string } {
    return {
      isDemo: this.isDemo,
      model: this.config.model
    };
  }
}

// 创建全局AI服务实例
export const aiService = new AIService();