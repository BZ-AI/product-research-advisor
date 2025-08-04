import React from 'react';
import { Tag, Tooltip } from 'antd';
import { 
  RobotOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { aiService } from '../../services/aiService';
import { searchService } from '../../services/searchService';

const AIStatusIndicator: React.FC = () => {
  const aiServiceInfo = aiService.getServiceInfo();
  const searchServiceInfo = searchService.getServiceInfo();

  const getStatusColor = (isDemo: boolean) => {
    return isDemo ? 'orange' : 'green';
  };

  const getStatusIcon = (isDemo: boolean) => {
    return isDemo ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />;
  };

  const getStatusText = (isDemo: boolean) => {
    return isDemo ? '演示模式' : 'AI增强';
  };

  return (
    <div className="flex items-center space-x-2">
      <Tooltip 
        title={
          <div>
            <div className="mb-2">
              <strong>AI服务状态</strong>
            </div>
            <div className="space-y-1">
              <div>智能分析: {aiServiceInfo.isDemo ? '演示模式' : `已启用 (${aiServiceInfo.model})`}</div>
              <div>智能搜索: {searchServiceInfo.isDemo ? '演示模式' : '已启用'}</div>
            </div>
            {aiServiceInfo.isDemo && (
              <div className="mt-2 text-yellow-200">
                <InfoCircleOutlined className="mr-1" />
                配置API密钥以启用真实AI功能
              </div>
            )}
          </div>
        }
      >
        <Tag 
          icon={<RobotOutlined />} 
          color={getStatusColor(aiServiceInfo.isDemo)}
          className="cursor-help"
        >
          AI功能
        </Tag>
      </Tooltip>

      <Tooltip title="智能分析服务状态">
        <Tag 
          icon={getStatusIcon(aiServiceInfo.isDemo)} 
          color={getStatusColor(aiServiceInfo.isDemo)}
          size="small"
        >
          {getStatusText(aiServiceInfo.isDemo)}
        </Tag>
      </Tooltip>

      {!aiServiceInfo.isDemo && (
        <Tooltip title={`当前使用模型: ${aiServiceInfo.model}`}>
          <Tag color="blue" size="small">
            {aiServiceInfo.model}
          </Tag>
        </Tooltip>
      )}
    </div>
  );
};

export default AIStatusIndicator;