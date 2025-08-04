import React, { useState } from 'react';
import { Card, Button, Typography, Steps, message, Space } from 'antd';
import { PlayCircleOutlined, FastForwardOutlined, RobotOutlined } from '@ant-design/icons';
import { demoIndustryAnswers, demoCompanyAnswers } from '../../data/demoAnswers';

const { Title, Text } = Typography;
const { Step } = Steps;

interface QuickDemoProps {
  onComplete: (results: any) => void;
}

const QuickDemo: React.FC<QuickDemoProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    { title: '🔍 分析遮阳蓬行业', description: '智能分析行业趋势、市场规模、竞争格局' },
    { title: '🏢 评估格绿朗公司', description: '深度分析企业现状、技术能力、竞争优势' },
    { title: '🤖 AI生成建议', description: '基于综合分析生成个性化研发建议' },
    { title: '📋 展示专业方案', description: '查看详细的实施方案和资源配置' }
  ];

  const runQuickDemo = async () => {
    setIsRunning(true);
    
    // 步骤1：行业分析
    setCurrentStep(0);
    await new Promise(resolve => setTimeout(resolve, 1500));
    message.success('🔍 遮阳蓬行业分析完成');
    
    // 步骤2：企业分析
    setCurrentStep(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    message.success('🏢 格绿朗公司评估完成');
    
    // 步骤3：AI建议生成
    setCurrentStep(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
    message.success('🤖 AI建议生成完成');
    
    // 步骤4：展示结果
    setCurrentStep(3);
    setIsRunning(false);
    message.success('📋 专业方案已生成');
    
    // 传递演示结果
    onComplete({
      industryResults: demoIndustryAnswers,
      companyResults: demoCompanyAnswers,
      isDemo: true
    });
  };

  if (currentStep === 3) {
    return (
      <div className="text-center space-y-6">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <Title level={3} className="text-green-700">
            ✅ AI分析演示完成！
          </Title>
          <Text className="text-lg">
            已为广东格绿朗节能科技有限公司生成专业的研发建议
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 演示介绍 */}
      <Card className="text-center bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-center mb-4">
          <RobotOutlined className="text-4xl text-blue-500 mr-3" />
          <Title level={2} className="mb-0 text-blue-700">
            AI智能分析演示
          </Title>
        </div>
        
        <Text className="text-lg text-gray-700 block mb-2">
          为<span className="font-bold text-blue-600">广东格绿朗节能科技有限公司</span>定制的AI分析系统
        </Text>
        <Text className="text-gray-600 block mb-6">
          体验完整的AI分析流程：行业分析 → 企业评估 → 智能建议生成
        </Text>
        
        <Steps current={currentStep} className="mb-8">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              title={step.title} 
              description={step.description}
              status={index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait'}
            />
          ))}
        </Steps>

        <div className="space-y-4">
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={runQuickDemo}
            loading={isRunning}
            disabled={isRunning}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 px-8 py-6 text-lg h-auto"
          >
            {isRunning ? '🤖 AI正在分析中...' : '🚀 开始AI智能分析'}
          </Button>
          
          {!isRunning && (
            <div>
              <Button
                size="large"
                icon={<FastForwardOutlined />}
                onClick={() => {
                  setCurrentStep(3);
                  onComplete({
                    industryResults: demoIndustryAnswers,
                    companyResults: demoCompanyAnswers,
                    isDemo: true
                  });
                }}
                className="mx-4"
              >
                直接查看AI建议结果
              </Button>
            </div>
          )}
          
          <div className="text-center mt-4">
            <Text className="text-gray-500 text-sm">
              ⏱️ 演示时长约6秒 • 🎯 生成5-8项专业建议 • 📊 包含详细实施方案
            </Text>
          </div>
        </div>
      </Card>

      {/* 功能预览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card size="small" className="text-center">
          <div className="text-2xl mb-2">🔍</div>
          <Text strong>行业深度分析</Text>
          <div className="text-xs text-gray-500 mt-1">
            市场规模 • 竞争格局 • 发展趋势
          </div>
        </Card>
        <Card size="small" className="text-center">
          <div className="text-2xl mb-2">🏢</div>
          <Text strong>企业能力评估</Text>
          <div className="text-xs text-gray-500 mt-1">
            技术实力 • 市场地位 • 核心优势
          </div>
        </Card>
        <Card size="small" className="text-center">
          <div className="text-2xl mb-2">💡</div>
          <Text strong>智能建议生成</Text>
          <div className="text-xs text-gray-500 mt-1">
            研发方向 • 实施方案 • 资源配置
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuickDemo;