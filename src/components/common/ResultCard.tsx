import React from 'react';
import { Card, Tag, Rate, Typography, Button, Divider } from 'antd';
import { 
  TrophyOutlined, 
  BulbOutlined, 
  TeamOutlined, 
  ExpandAltOutlined,
  CalendarOutlined 
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface ResultCardProps {
  type: 'opportunity' | 'technology' | 'competition' | 'improvement';
  title: string;
  description: string;
  impact?: number;
  feasibility?: number;
  priority?: 'high' | 'medium' | 'low';
  timeline?: string;
  tags?: string[];
  onExpand?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  type,
  title,
  description,
  impact,
  feasibility,
  priority,
  timeline,
  tags = [],
  onExpand
}) => {
  const getTypeIcon = () => {
    const icons = {
      opportunity: <TrophyOutlined className="text-green-500" />,
      technology: <BulbOutlined className="text-blue-500" />,
      competition: <TeamOutlined className="text-orange-500" />,
      improvement: <ExpandAltOutlined className="text-purple-500" />
    };
    return icons[type];
  };

  const getTypeColor = () => {
    const colors = {
      opportunity: 'border-l-green-500',
      technology: 'border-l-blue-500',
      competition: 'border-l-orange-500',
      improvement: 'border-l-purple-500'
    };
    return colors[type];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'green'
    };
    return colors[priority as keyof typeof colors] || 'default';
  };

  return (
    <Card 
      className={`w-full border-l-4 ${getTypeColor()} hover:shadow-lg transition-shadow duration-300`}
      actions={[
        onExpand && (
          <Button type="link" onClick={onExpand} className="flex items-center justify-center">
            查看详情
          </Button>
        )
      ].filter(Boolean)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <Text strong className="text-lg">{title}</Text>
          </div>
          
          {priority && (
            <Tag color={getPriorityColor(priority)} className="ml-2">
              {priority === 'high' ? '高优先级' : priority === 'medium' ? '中优先级' : '低优先级'}
            </Tag>
          )}
        </div>

        <Paragraph className="text-gray-600 mb-0">
          {description}
        </Paragraph>

        {(impact !== undefined || feasibility !== undefined) && (
          <>
            <Divider className="my-3" />
            <div className="flex items-center space-x-6">
              {impact !== undefined && (
                <div className="flex items-center space-x-2">
                  <Text className="text-sm text-gray-500">影响度:</Text>
                  <Rate 
                    disabled 
                    defaultValue={Math.round(impact / 20)} 
                    className="text-sm"
                  />
                  <Text className="text-sm font-medium">{impact}%</Text>
                </div>
              )}
              
              {feasibility !== undefined && (
                <div className="flex items-center space-x-2">
                  <Text className="text-sm text-gray-500">可行性:</Text>
                  <Rate 
                    disabled 
                    defaultValue={Math.round(feasibility / 20)} 
                    className="text-sm"
                  />
                  <Text className="text-sm font-medium">{feasibility}%</Text>
                </div>
              )}
            </div>
          </>
        )}

        {timeline && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarOutlined />
            <Text>预计时间: {timeline}</Text>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Tag key={index} className="text-xs">
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResultCard;