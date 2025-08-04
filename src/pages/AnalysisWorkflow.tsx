import React, { useState } from 'react';
import { Steps, Card, Button, Typography, message, Tabs } from 'antd';
import { 
  SearchOutlined, 
  BuildOutlined, 
  BulbOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  GlobalOutlined,
  RobotOutlined
} from '@ant-design/icons';
import IndustryAnalysisQA from '../components/analysis/IndustryAnalysisQA';
import CompanyAnalysisQA from '../components/analysis/CompanyAnalysisQA';
import RecommendationGenerator from '../components/analysis/RecommendationGenerator';
import QuickDemo from '../components/analysis/QuickDemo';
import DocumentUpload from '../components/analysis/DocumentUpload';
import IntelligentSearch from '../components/analysis/IntelligentSearch';

const { Title, Text } = Typography;
const { Step } = Steps;

const AnalysisWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [industryResults, setIndustryResults] = useState<any>(null);
  const [companyResults, setCompanyResults] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showDemo, setShowDemo] = useState(true); // 默认显示演示
  const [documentData, setDocumentData] = useState<any[]>([]);
  const [searchData, setSearchData] = useState<any>(null);

  // 预设的企业信息
  const companyName = "广东格绿朗节能科技有限公司";
  const industry = "遮阳蓬行业";

  const handleDemoComplete = (demoResults: any) => {
    setIndustryResults(demoResults.industryResults);
    setCompanyResults(demoResults.companyResults);
    setCurrentStep(2);
    setShowDemo(false);
    message.success('演示完成，查看AI生成的建议');
  };

  const handleIndustryComplete = (results: any) => {
    setIndustryResults(results);
    setCurrentStep(1);
    message.success('行业分析完成，开始企业分析');
  };

  const handleCompanyComplete = (results: any) => {
    setCompanyResults(results);
    setCurrentStep(2);
    message.success('企业分析完成，开始生成建议');
  };

  const handleRecommendationsComplete = (recs: any[]) => {
    setRecommendations(recs);
    setCurrentStep(3);
    message.success('研发建议生成完成！');
  };

  const steps = [
    {
      title: '行业分析',
      description: '深入分析遮阳蓬行业现状',
      icon: <SearchOutlined />,
      content: (
        <Tabs defaultActiveKey="qa" className="mt-4">
          <Tabs.TabPane 
            tab={
              <span>
                <BuildOutlined />
                问答分析
              </span>
            } 
            key="qa"
          >
            <IndustryAnalysisQA
              industry={industry}
              onComplete={handleIndustryComplete}
            />
          </Tabs.TabPane>
          <Tabs.TabPane 
            tab={
              <span>
                <FileTextOutlined />
                文档解析
              </span>
            } 
            key="document"
          >
            <DocumentUpload
              onDocumentParsed={(doc) => {
                setDocumentData(prev => [...prev, doc]);
                message.success('文档解析完成，数据已整合到行业分析中');
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane 
            tab={
              <span>
                <GlobalOutlined />
                智能搜索
              </span>
            } 
            key="search"
          >
            <IntelligentSearch
              industry={industry}
              onSearchComplete={(data) => {
                setSearchData(data);
                message.success('搜索分析完成，数据已整合到行业分析中');
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      )
    },
    {
      title: '企业分析',
      description: '分析企业现状和竞争力',
      icon: <BuildOutlined />,
      content: (
        <CompanyAnalysisQA
          companyName={companyName}
          industryResults={industryResults}
          onComplete={handleCompanyComplete}
        />
      )
    },
    {
      title: '生成建议',
      description: '基于分析生成研发建议',
      icon: <BulbOutlined />,
      content: (
        <RecommendationGenerator
          industryResults={industryResults}
          companyResults={companyResults}
          documentData={documentData}
          searchData={searchData}
          onComplete={handleRecommendationsComplete}
        />
      )
    },
    {
      title: '完成',
      description: '分析完成，查看结果',
      icon: <CheckCircleOutlined />,
      content: (
        <Card>
          <div className="text-center space-y-4">
            <CheckCircleOutlined className="text-6xl text-green-500" />
            <Title level={2}>分析完成！</Title>
            <Text type="secondary" className="block">
              已为{companyName}生成了{recommendations.length}项个性化研发建议
            </Text>
            <div className="space-x-4">
              <Button type="primary" size="large">
                查看详细报告
              </Button>
              <Button size="large">
                导出分析结果
              </Button>
            </div>
          </div>
        </Card>
      )
    }
  ];

  const handleStepChange = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <Title level={2} className="mb-2">
          {companyName} 研发建议分析
        </Title>
        <Text type="secondary" className="text-lg">
          基于AI驱动的行业分析和企业诊断，生成个性化研发建议
        </Text>
      </div>

      {/* 步骤导航 */}
      <Card>
        <Steps
          current={currentStep}
          onChange={handleStepChange}
          className="mb-6"
        >
          {steps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              status={
                index < currentStep ? 'finish' : 
                index === currentStep ? 'process' : 
                'wait'
              }
            />
          ))}
        </Steps>
      </Card>

      {/* 欢迎页面 - 立即体验AI */}
      {currentStep === 0 && !showDemo && (
        <div className="text-center space-y-8 py-12">
          {/* 主标题 */}
          <div>
            <Title level={1} className="text-4xl font-bold text-gray-800 mb-4">
              🤖 AI产品研发建议平台
            </Title>
            <Text className="text-xl text-gray-600 block mb-2">
              专为遮阳蓬行业定制的智能分析系统
            </Text>
            <Text className="text-lg text-blue-600">
              3秒钟体验完整AI分析流程，获得专业研发建议
            </Text>
          </div>

          {/* 核心功能展示 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <RobotOutlined className="text-4xl text-blue-500 mb-3" />
              <Title level={4}>AI智能分析</Title>
              <Text className="text-gray-600">
                实时AI分析用户回答，提供专业建议
              </Text>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <FileTextOutlined className="text-4xl text-green-500 mb-3" />
              <Title level={4}>文档智能解析</Title>
              <Text className="text-gray-600">
                支持PDF、Word、图片等格式AI解析
              </Text>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <BulbOutlined className="text-4xl text-purple-500 mb-3" />
              <Title level={4}>个性化建议</Title>
              <Text className="text-gray-600">
                多维度评估，生成定制化研发建议
              </Text>
            </Card>
          </div>

          {/* 立即体验按钮 */}
          <div className="space-y-4">
            <Button
              type="primary"
              size="large"
              onClick={() => setShowDemo(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 px-12 py-6 text-xl h-auto"
            >
              🚀 立即免费体验AI分析
            </Button>
            <div>
              <Text className="text-gray-500">
                无需注册 • 3秒体验 • 专业建议
              </Text>
            </div>
          </div>

          {/* 客户案例 */}
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50">
            <Title level={5} className="text-center mb-3">
              ✨ 为广东格绿朗节能科技有限公司定制
            </Title>
            <Text className="text-center text-gray-600">
              基于遮阳蓬行业深度分析，提供专业的产品研发建议和实施方案
            </Text>
          </Card>
        </div>
      )}

      {/* 当前步骤内容 */}
      <div>
        {showDemo ? (
          <QuickDemo onComplete={handleDemoComplete} />
        ) : (
          steps[currentStep]?.content
        )}
      </div>

      {/* 进度提示 */}
      {currentStep < 3 && (
        <Card size="small" className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <Text strong>当前进度: {steps[currentStep]?.title}</Text>
              <Text type="secondary" className="block text-sm">
                {steps[currentStep]?.description}
              </Text>
            </div>
            <Text className="text-blue-600 font-medium">
              {currentStep + 1} / {steps.length}
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalysisWorkflow;