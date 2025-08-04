import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  List, 
  Tag, 
  Rate,
  Progress,
  Divider,
  Space,
  Alert,
  Collapse,
  Spin
} from 'antd';
import { 
  BulbOutlined, 
  TrophyOutlined, 
  RocketOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  RobotOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { generateDemoRecommendations } from '../../data/demoAnswers';
import { aiServiceManager } from '../../services/AIServiceManager';
import { recommendationEngine, EnhancedRecommendation } from '../../services/recommendationEngine';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// 使用增强的建议类型
type Recommendation = EnhancedRecommendation;

interface RecommendationGeneratorProps {
  industryResults: any;
  companyResults: any;
  documentData?: any[];
  searchData?: any;
  onComplete: (recommendations: Recommendation[]) => void;
}

const RecommendationGenerator: React.FC<RecommendationGeneratorProps> = ({
  industryResults,
  companyResults,
  documentData,
  searchData,
  onComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentStep, setCurrentStep] = useState('');

  // 基于分析结果生成建议
  const generateRecommendations = async () => {
    setIsGenerating(true);
    setProgress(0);

    // AI分析步骤
    const steps = [
      { text: '分析行业趋势数据...', progress: 15 },
      { text: '评估企业现状...', progress: 30 },
      { text: '识别市场机会...', progress: 45 },
      { text: '匹配技术能力...', progress: 60 },
      { text: '生成个性化建议...', progress: 75 },
      { text: '评估可行性...', progress: 90 },
      { text: '制定实施计划...', progress: 100 }
    ];

    try {
      for (const step of steps) {
        setCurrentStep(step.text);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(step.progress);
      }

      // 使用增强的建议引擎生成个性化建议
      let enhancedRecommendations: Recommendation[] = [];
      
      try {
        setCurrentStep('AI正在生成个性化建议...');
        
        // 使用新的AI服务管理器生成分析报告
        const analysisData = {
          industryAnswers: industryResults?.answers || {},
          companyAnswers: companyResults?.answers || {},
          companyInfo: {
            name: companyResults?.companyName || '广东格绿朗节能科技有限公司',
            industry: industryResults?.industry || '遮阳蓬行业',
            size: '中型企业',
            location: '广东省'
          }
        };

        const analysisReport = await aiServiceManager.generateAnalysis(analysisData);
        enhancedRecommendations = analysisReport.recommendations;
        
      } catch (error) {
        console.error('AI分析生成失败，使用演示数据:', error);
        enhancedRecommendations = generateDemoRecommendations(industryResults, companyResults);
      }
    
    // 使用增强的建议结果
    const generatedRecommendations: Recommendation[] = [
      ...enhancedRecommendations,
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
      },
      {
        id: '3',
        title: '研发新型轻量化环保材料',
        description: '开发更轻便、更耐用、更环保的遮阳材料，提升产品竞争力，符合绿色发展趋势。',
        category: 'product',
        priority: 'medium',
        feasibility: 72,
        impact: 68,
        timeline: '8-15个月',
        resources: ['材料研发团队5人', '实验设备投入100万', '供应商合作'],
        risks: ['研发周期不确定', '成本控制难度', '供应链稳定性'],
        successMetrics: ['材料性能提升30%', '成本降低15%', '环保认证通过'],
        implementationSteps: [
          '材料配方研发（6个月）',
          '性能测试和优化（4个月）',
          '生产工艺调整（3个月）',
          '批量生产准备（2个月）'
        ]
      },
      {
        id: '4',
        title: '建立产学研合作创新体系',
        description: '与高校和科研院所建立长期合作关系，共同开发前沿技术，提升企业创新能力。',
        category: 'strategy',
        priority: 'medium',
        feasibility: 88,
        impact: 65,
        timeline: '3-6个月',
        resources: ['合作费用50万/年', '专职对接人员2人', '实验室共建'],
        risks: ['合作效果不明确', '知识产权纠纷', '人才流失'],
        successMetrics: ['建立合作关系3家', '联合申请专利5项', '技术转化2项'],
        implementationSteps: [
          '合作伙伴筛选和洽谈（2个月）',
          '合作协议签署（1个月）',
          '联合研发项目启动（1个月）',
          '定期评估和调整（持续）'
        ]
      },
      {
        id: '5',
        title: '优化供应链和成本结构',
        description: '通过供应链整合和生产工艺优化，降低生产成本，提高市场竞争力。',
        category: 'strategy',
        priority: 'low',
        feasibility: 82,
        impact: 58,
        timeline: '6-9个月',
        resources: ['供应链管理团队3人', '系统升级费用30万', '流程优化咨询'],
        risks: ['供应商配合度', '质量控制风险', '短期成本增加'],
        successMetrics: ['成本降低12%', '交货周期缩短20%', '质量稳定性提升'],
        implementationSteps: [
          '供应链现状分析（2个月）',
          '优化方案设计（2个月）',
          '试点实施和调整（3个月）',
          '全面推广（2个月）'
        ]
      }
    ];

      setRecommendations(generatedRecommendations);
      setCurrentStep('建议生成完成！');
      onComplete(generatedRecommendations);
    } catch (error) {
      console.error('建议生成过程出错:', error);
      // 使用演示数据作为后备
      const fallbackRecommendations = generateDemoRecommendations(industryResults, companyResults);
      setRecommendations(fallbackRecommendations);
      onComplete(fallbackRecommendations);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      market: <TrophyOutlined className="text-green-500" />,
      technology: <BulbOutlined className="text-blue-500" />,
      product: <RocketOutlined className="text-purple-500" />,
      strategy: <CheckCircleOutlined className="text-orange-500" />
    };
    return icons[category as keyof typeof icons];
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      market: '市场机会',
      technology: '技术创新',
      product: '产品开发',
      strategy: '战略优化'
    };
    return labels[category as keyof typeof labels];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'green'
    };
    return colors[priority as keyof typeof colors];
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级'
    };
    return labels[priority as keyof typeof labels];
  };

  useEffect(() => {
    // 自动开始生成建议
    if (industryResults && companyResults) {
      generateRecommendations();
    }
  }, [industryResults, companyResults]);

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center space-y-4">
            <Spin size="large" />
            <div className="flex items-center justify-center space-x-2">
              <RobotOutlined className="text-4xl text-blue-500" />
              <BulbOutlined className="text-4xl text-green-500" />
            </div>
            <Title level={3}>AI正在生成个性化研发建议</Title>
            <Text type="secondary" className="block">
              基于行业分析和企业分析结果，为您生成专业的研发建议...
            </Text>
            <Text className="text-blue-600 font-medium">
              {currentStep}
            </Text>
            <Progress 
              percent={Math.round(progress)} 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              className="max-w-md mx-auto"
            />
            
            <Alert
              message="AI增强模式"
              description="正在使用人工智能技术分析您的数据，生成个性化建议"
              type="info"
              showIcon
              icon={<RobotOutlined />}
              className="max-w-md mx-auto"
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 概览统计 */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="mb-0">
            个性化研发建议
          </Title>
          <Space>
            <Tag color="blue">共 {recommendations.length} 项建议</Tag>
            <Tag color="red">
              {recommendations.filter(r => r.priority === 'high').length} 高优先级
            </Tag>
          </Space>
        </div>

        <Alert
          message={
            <div className="flex items-center space-x-2">
              <span>建议生成完成</span>
              <Tag icon={<RobotOutlined />} color="blue" size="small">
                AI增强
              </Tag>
            </div>
          }
          description={`基于${industryResults?.industry || '遮阳蓬'}行业分析和${companyResults?.companyName || '企业'}分析，已生成${recommendations.length}项个性化研发建议。`}
          type="success"
          showIcon
          className="mb-4"
          action={
            <Button 
              size="small" 
              icon={<ReloadOutlined />}
              onClick={generateRecommendations}
            >
              重新生成
            </Button>
          }
        />

        {/* 分类统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['market', 'technology', 'product', 'strategy'].map(category => {
            const count = recommendations.filter(r => r.category === category).length;
            return (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">
                  {getCategoryIcon(category)}
                </div>
                <Text strong className="block">{getCategoryLabel(category)}</Text>
                <Text className="text-2xl font-bold text-blue-600">{count}</Text>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 建议列表 */}
      <Card title="详细建议">
        <List
          dataSource={recommendations}
          renderItem={(recommendation) => (
            <List.Item className="border-0 px-0">
              <Card 
                className="w-full border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
                size="small"
              >
                <div className="space-y-4">
                  {/* 标题和标签 */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      {getCategoryIcon(recommendation.category)}
                      <Title level={5} className="mb-0">
                        {recommendation.title}
                      </Title>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Tag color={getPriorityColor(recommendation.priority)}>
                        {getPriorityLabel(recommendation.priority)}
                      </Tag>
                      <Tag color="blue">
                        {getCategoryLabel(recommendation.category)}
                      </Tag>
                    </div>
                  </div>

                  {/* 描述 */}
                  <Paragraph className="text-gray-700 mb-0">
                    {recommendation.description}
                  </Paragraph>

                  {/* 评分 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Text className="text-sm text-gray-500">可行性:</Text>
                      <Rate 
                        disabled 
                        defaultValue={Math.round(recommendation.feasibility / 20)} 
                        className="text-sm"
                      />
                      <Text className="text-sm font-medium">{recommendation.feasibility}%</Text>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Text className="text-sm text-gray-500">影响度:</Text>
                      <Rate 
                        disabled 
                        defaultValue={Math.round(recommendation.impact / 20)} 
                        className="text-sm"
                      />
                      <Text className="text-sm font-medium">{recommendation.impact}%</Text>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Text className="text-sm text-gray-500">ROI:</Text>
                      <Rate 
                        disabled 
                        defaultValue={Math.round((recommendation.roi || 60) / 20)} 
                        className="text-sm"
                      />
                      <Text className="text-sm font-medium">{recommendation.roi || 60}%</Text>
                    </div>

                    <div className="flex items-center space-x-2">
                      <ClockCircleOutlined className="text-gray-400" />
                      <Text className="text-sm">预计时间: {recommendation.timeline}</Text>
                    </div>
                  </div>

                  {/* AI增强信息 */}
                  {(recommendation as EnhancedRecommendation).aiConfidence && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <Text className="text-xs text-gray-500 block">AI置信度</Text>
                          <Text className="font-medium text-blue-600">
                            {(recommendation as EnhancedRecommendation).aiConfidence}%
                          </Text>
                        </div>
                        <div>
                          <Text className="text-xs text-gray-500 block">市场匹配度</Text>
                          <Text className="font-medium text-green-600">
                            {(recommendation as EnhancedRecommendation).marketAlignment}%
                          </Text>
                        </div>
                        <div>
                          <Text className="text-xs text-gray-500 block">竞争优势</Text>
                          <Text className="font-medium text-purple-600">
                            {(recommendation as EnhancedRecommendation).competitiveAdvantage}%
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 详细信息折叠面板 */}
                  <Collapse size="small" ghost>
                    <Panel header="查看详细实施方案" key="1">
                      <div className="space-y-4">
                        <div>
                          <Text strong className="block mb-2">实施步骤:</Text>
                          <List
                            size="small"
                            dataSource={Array.isArray(recommendation.implementationSteps) ? 
                              recommendation.implementationSteps : []
                            }
                            renderItem={(step, index) => (
                              <List.Item className="py-1">
                                <Text className="text-sm">
                                  {index + 1}. {typeof step === 'string' ? step : step.description}
                                </Text>
                              </List.Item>
                            )}
                          />
                          {(!Array.isArray(recommendation.implementationSteps) || 
                            recommendation.implementationSteps.length === 0) && (
                            <Text className="text-xs text-gray-500">暂无详细实施步骤</Text>
                          )}
                        </div>

                        <Divider className="my-3" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Text strong className="block mb-2">所需资源:</Text>
                            {Array.isArray(recommendation.resources) ? 
                              recommendation.resources.map((resource, index) => (
                                <Tag key={index} className="mb-1 text-xs">
                                  {typeof resource === 'string' ? resource : resource.description}
                                </Tag>
                              )) :
                              <Text className="text-xs text-gray-500">暂无详细资源信息</Text>
                            }
                          </div>

                          <div>
                            <Text strong className="block mb-2">主要风险:</Text>
                            {Array.isArray(recommendation.risks) ? 
                              recommendation.risks.map((risk, index) => (
                                <div key={index} className="flex items-center space-x-1 mb-1">
                                  <ExclamationCircleOutlined className="text-orange-500 text-xs" />
                                  <Text className="text-xs">
                                    {typeof risk === 'string' ? risk : risk.description}
                                  </Text>
                                </div>
                              )) :
                              <Text className="text-xs text-gray-500">暂无详细风险信息</Text>
                            }
                          </div>

                          <div>
                            <Text strong className="block mb-2">成功指标:</Text>
                            {Array.isArray(recommendation.successMetrics) ? 
                              recommendation.successMetrics.map((metric, index) => (
                                <div key={index} className="flex items-center space-x-1 mb-1">
                                  <CheckCircleOutlined className="text-green-500 text-xs" />
                                  <Text className="text-xs">
                                    {typeof metric === 'string' ? metric : metric.metric}
                                  </Text>
                                </div>
                              )) :
                              <Text className="text-xs text-gray-500">暂无详细指标信息</Text>
                            }
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default RecommendationGenerator;