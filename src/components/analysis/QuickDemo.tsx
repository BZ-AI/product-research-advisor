import React, { useState } from 'react';
import { Card, Button, Typography, Steps, message, Space } from 'antd';
import { PlayCircleOutlined, FastForwardOutlined } from '@ant-design/icons';
import { demoIndustryAnswers, demoCompanyAnswers } from '../../data/demoAnswers';
import RecommendationGenerator from './RecommendationGenerator';

const { Title, Text } = Typography;
const { Step } = Steps;

interface QuickDemoProps {
  onComplete: (results: any) => void;
}

const QuickDemo: React.FC<QuickDemoProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    { title: '加载演示数据', description: '使用预设的行业和企业分析数据' },
    { title: '生成AI建议', description: '基于演示数据生成研发建议' },
    { title: '展示结果', description: '查看完整的分析结果和建议' }
  ];

  const runQuickDemo = async () => {
    setIsRunning(true);
    
    // 步骤1：加载演示数据
    setCurrentStep(0);
    await new Promise(resolve => setTimeout(resolve, 1000));
    message.success('演示数据加载完成');
    
    // 步骤2：生成建议
    setCurrentStep(1);
    await new Promise(resolve => setTimeout(resolve, 2000));
    message.success('AI建议生成完成');
    
    // 步骤3：展示结果
    setCurrentStep(2);
    setIsRunning(false);
    
    // 传递演示结果
    onComplete({
      industryResults: demoIndustryAnswers,
      companyResults: demoCompanyAnswers,
      isDemo: true
    });
  };

  if (currentStep === 2) {
    return (
      <RecommendationGenerator
        industryResults={demoIndustryAnswers}
        companyResults={demoCompanyAnswers}
        onComplete={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="text-center space-y-4">
          <Title level={3}>快速演示模式</Title>
          <Text type="secondary" className="block">
            使用预设的演示数据，快速体验完整的分析流程和AI建议生成功能
          </Text>
          
          <div className="max-w-md mx-auto">
            <Steps
              current={currentStep}
              direction="vertical"
              size="small"
            >
              {steps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  status={
                    index < currentStep ? 'finish' : 
                    index === currentStep && isRunning ? 'process' : 
                    'wait'
                  }
                />
              ))}
            </Steps>
          </div>

          <Space size="large" className="mt-6">
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={runQuickDemo}
              loading={isRunning}
              disabled={isRunning}
            >
              {isRunning ? '演示进行中...' : '开始快速演示'}
            </Button>
          </Space>

          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <Text className="text-sm text-blue-700">
              <strong>演示说明：</strong>
              <br />
              • 使用广东格绿朗节能科技有限公司的模拟数据
              <br />
              • 基于遮阳蓬行业的专业分析问题
              <br />
              • 生成5项个性化研发建议和实施方案
              <br />
              • 整个演示过程约需3-5秒
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickDemo;