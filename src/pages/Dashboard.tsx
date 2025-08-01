import React from 'react';
import { Row, Col, Card, Statistic, Badge, List, Button, Typography, Tag } from 'antd';
import { 
  FileTextOutlined, 
  TrophyOutlined, 
  BulbOutlined, 
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RightOutlined
} from '@ant-design/icons';
import DataChart, { chartData } from '../components/common/DataChart';
import { mockHistoryRecords } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const { Title, Text } = Typography;

interface DashboardProps {
  onNavigate: (key: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const quickActions = [
    {
      title: '上传文档分析',
      description: '上传行业报告进行AI智能分析',
      icon: <FileTextOutlined />,
      action: () => onNavigate('document-analysis'),
      color: '#1890ff'
    },
    {
      title: '企业信息配置',
      description: '配置企业和产品基本信息',
      icon: <BulbOutlined />,
      action: () => onNavigate('company-config'),
      color: '#52c41a'
    },
    {
      title: '查看分析结果',
      description: '查看最新的AI分析建议',
      icon: <TrophyOutlined />,
      action: () => onNavigate('analysis-results'),
      color: '#fa8c16'
    }
  ];

  const recentActivities = mockHistoryRecords.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">仪表板</Title>
          <Text type="secondary">
            欢迎使用产品研发建议平台，基于AI驱动的智能分析为您提供个性化建议
          </Text>
        </div>
      </div>

      {/* 数据统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="文档分析"
              value={12}
              prefix={<FileTextOutlined />}
              suffix={
                <span className="flex items-center text-sm">
                  <ArrowUpOutlined className="text-green-500 mr-1" />
                  <span className="text-green-500">8.5%</span>
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="生成报告"
              value={8}
              prefix={<TrophyOutlined />}
              suffix={
                <span className="flex items-center text-sm">
                  <ArrowUpOutlined className="text-green-500 mr-1" />
                  <span className="text-green-500">12.3%</span>
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="实施方案"
              value={5}
              prefix={<BulbOutlined />}
              suffix={
                <span className="flex items-center text-sm">
                  <ArrowDownOutlined className="text-red-500 mr-1" />
                  <span className="text-red-500">2.1%</span>
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均匹配度"
              value={82}
              prefix={<ClockCircleOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Card title="快速操作" className="w-full">
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card 
                hoverable
                className="h-full cursor-pointer border border-gray-200 hover:border-blue-400 transition-all duration-300"
                onClick={action.action}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                    style={{ backgroundColor: action.color }}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <Title level={5} className="mb-2">{action.title}</Title>
                    <Text type="secondary" className="text-sm">
                      {action.description}
                    </Text>
                  </div>
                  <RightOutlined className="text-gray-400" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 数据可视化和最近活动 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <DataChart
            type="bar"
            title="市场趋势分析"
            data={chartData.marketTrends}
            height={350}
          />
        </Col>
        <Col xs={24} lg={10}>
          <Card title="最近活动" className="h-full">
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item className="px-0 border-0">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <Text strong className="text-sm">{item.title}</Text>
                      <Tag color={item.status === 'completed' ? 'green' : 'blue'}>
                        {item.status === 'completed' ? '已完成' : '进行中'}
                      </Tag>
                    </div>
                    <Text type="secondary" className="text-xs block mb-1">
                      {item.summary}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {formatDate(item.createdAt)}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
            <div className="text-center mt-4">
              <Button 
                type="link" 
                onClick={() => onNavigate('history')}
              >
                查看全部记录
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;