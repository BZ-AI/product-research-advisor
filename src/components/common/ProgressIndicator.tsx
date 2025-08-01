import React from 'react';
import { Progress, Card, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ProgressIndicatorProps {
  title: string;
  description: string;
  progress: number;
  status?: 'active' | 'success' | 'exception';
  showIcon?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  title,
  description,
  progress,
  status = 'active',
  showIcon = true
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <Card className="w-full">
      <div className="flex items-center space-x-4">
        {showIcon && status === 'active' && progress < 100 && (
          <Spin indicator={antIcon} />
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <Text strong className="text-lg">{title}</Text>
            <Text className="text-blue-600 font-medium">{progress}%</Text>
          </div>
          
          <Progress 
            percent={progress} 
            status={status}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            className="mb-2"
          />
          
          <Text type="secondary" className="text-sm">
            {description}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default ProgressIndicator;