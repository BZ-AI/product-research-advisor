import React, { useState } from 'react';
import { Card, Select, Button, Typography, Space, Tag, message } from 'antd';
import { RobotOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'high' | 'medium' | 'basic';
  cost: 'low' | 'medium' | 'high';
}

const availableModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: '最强大的AI模型，分析质量最高',
    speed: 'medium',
    quality: 'high',
    cost: 'high'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: '快速响应，性价比高',
    speed: 'fast',
    quality: 'medium',
    cost: 'low'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude-3 Opus',
    provider: 'Anthropic',
    description: '专业分析能力强，逻辑清晰',
    speed: 'medium',
    quality: 'high',
    cost: 'high'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude-3 Sonnet',
    provider: 'Anthropic',
    description: '平衡性能与成本',
    speed: 'fast',
    quality: 'medium',
    cost: 'medium'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: '多模态能力强，支持图片分析',
    speed: 'fast',
    quality: 'medium',
    cost: 'low'
  }
];

interface AIModelSelectorProps {
  currentModel?: string;
  onModelChange?: (modelId: string) => void;
}

const AIModelSelector: React.FC<AIModelSelectorProps> = ({
  currentModel = 'gpt-4',
  onModelChange
}) => {
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [isDemo] = useState(true); // 当前是演示模式

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    onModelChange?.(modelId);
    message.success(`已切换到 ${availableModels.find(m => m.id === modelId)?.name}`);
  };

  const getSpeedColor = (speed: string) => {
    const colors = { fast: 'green', medium: 'orange', slow: 'red' };
    return colors[speed as keyof typeof colors];
  };

  const getQualityColor = (quality: string) => {
    const colors = { high: 'purple', medium: 'blue', basic: 'gray' };
    return colors[quality as keyof typeof colors];
  };

  const getCostColor = (cost: string) => {
    const colors = { low: 'green', medium: 'orange', high: 'red' };
    return colors[cost as keyof typeof colors];
  };

  const selectedModelInfo = availableModels.find(m => m.id === selectedModel);

  return (
    <Card 
      title={
        <div className="flex items-center space-x-2">
          <RobotOutlined className="text-blue-500" />
          <span>AI模型选择</span>
          {isDemo && <Tag color="orange">演示模式</Tag>}
        </div>
      }
      size="small"
    >
      <div className="space-y-4">
        {/* 当前选择的模型 */}
        {selectedModelInfo && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Title level={5} className="mb-0">
                当前使用：{selectedModelInfo.name}
              </Title>
              <CheckCircleOutlined className="text-green-500" />
            </div>
            <Text className="text-gray-600 block mb-2">
              {selectedModelInfo.description}
            </Text>
            <Space>
              <Tag color={getSpeedColor(selectedModelInfo.speed)}>
                速度: {selectedModelInfo.speed === 'fast' ? '快' : selectedModelInfo.speed === 'medium' ? '中' : '慢'}
              </Tag>
              <Tag color={getQualityColor(selectedModelInfo.quality)}>
                质量: {selectedModelInfo.quality === 'high' ? '高' : selectedModelInfo.quality === 'medium' ? '中' : '基础'}
              </Tag>
              <Tag color={getCostColor(selectedModelInfo.cost)}>
                成本: {selectedModelInfo.cost === 'low' ? '低' : selectedModelInfo.cost === 'medium' ? '中' : '高'}
              </Tag>
            </Space>
          </div>
        )}

        {/* 模型选择器 */}
        <div>
          <Text strong className="block mb-2">选择AI模型：</Text>
          <Select
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full"
            size="large"
          >
            {availableModels.map(model => (
              <Option key={model.id} value={model.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <Text strong>{model.name}</Text>
                    <Text className="text-gray-500 ml-2">({model.provider})</Text>
                  </div>
                  <Space size="small">
                    <Tag color={getSpeedColor(model.speed)} size="small">
                      {model.speed === 'fast' ? '快' : model.speed === 'medium' ? '中' : '慢'}
                    </Tag>
                    <Tag color={getQualityColor(model.quality)} size="small">
                      {model.quality === 'high' ? '高质量' : model.quality === 'medium' ? '中质量' : '基础'}
                    </Tag>
                  </Space>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        {/* 演示模式提示 */}
        {isDemo && (
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <Text className="text-orange-700">
              <SettingOutlined className="mr-1" />
              当前为演示模式，所有AI模型都使用预设回答。配置API密钥后可使用真实AI功能。
            </Text>
          </div>
        )}

        {/* 模型对比 */}
        <div>
          <Text strong className="block mb-2">模型对比：</Text>
          <div className="space-y-2">
            {availableModels.map(model => (
              <div key={model.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <Text strong>{model.name}</Text>
                  <Text className="text-gray-500 ml-2 text-sm">{model.description}</Text>
                </div>
                <Space size="small">
                  <Tag color={getSpeedColor(model.speed)} size="small">
                    {model.speed === 'fast' ? '快' : model.speed === 'medium' ? '中' : '慢'}
                  </Tag>
                  <Tag color={getQualityColor(model.quality)} size="small">
                    {model.quality === 'high' ? '高' : model.quality === 'medium' ? '中' : '基础'}
                  </Tag>
                  <Tag color={getCostColor(model.cost)} size="small">
                    {model.cost === 'low' ? '低成本' : model.cost === 'medium' ? '中成本' : '高成本'}
                  </Tag>
                </Space>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIModelSelector;