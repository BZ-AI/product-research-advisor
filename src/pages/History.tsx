import React, { useState } from 'react';
import { 
  Card, 
  List, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Typography, 
  Modal, 
  Space,
  DatePicker,
  Row,
  Col,
  Empty
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  DeleteOutlined, 
  DownloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { mockHistoryRecords } from '../data/mockData';
import { formatDate, getStatusColor } from '../utils/helpers';
import type { HistoryRecord } from '../types';

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const History: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>(mockHistoryRecords);
  const [filteredRecords, setFilteredRecords] = useState<HistoryRecord[]>(mockHistoryRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    filterRecords(value, statusFilter, typeFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterRecords(searchQuery, status, typeFilter);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    filterRecords(searchQuery, statusFilter, type);
  };

  const filterRecords = (query: string, status: string, type: string) => {
    let filtered = records;

    if (query) {
      filtered = filtered.filter(record => 
        record.title.toLowerCase().includes(query.toLowerCase()) ||
        record.summary.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(record => record.status === status);
    }

    if (type !== 'all') {
      filtered = filtered.filter(record => record.type === type);
    }

    setFilteredRecords(filtered);
  };

  const handleViewDetail = (record: HistoryRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？此操作不可恢复。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const newRecords = records.filter(r => r.id !== recordId);
        setRecords(newRecords);
        filterRecords(searchQuery, statusFilter, typeFilter);
      }
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      analysis: 'blue',
      plan: 'green',
      report: 'orange'
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      analysis: '分析报告',
      plan: '实施方案',
      report: '导出报告'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: '已完成',
      'in-progress': '进行中'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-2">历史记录</Title>
        <Text type="secondary">
          查看和管理您的分析历史、实施方案和导出报告
        </Text>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索记录标题或内容"
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={handleStatusFilter}
              className="w-full"
            >
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
              <Select.Option value="in-progress">进行中</Select.Option>
            </Select>
          </Col>
          
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="类型筛选"
              value={typeFilter}
              onChange={handleTypeFilter}
              className="w-full"
            >
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="analysis">分析报告</Select.Option>
              <Select.Option value="plan">实施方案</Select.Option>
              <Select.Option value="report">导出报告</Select.Option>
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              className="w-full"
            />
          </Col>
        </Row>
      </Card>

      {/* 记录列表 */}
      <Card 
        title={
          <Space>
            <Text>历史记录</Text>
            <Tag color="blue">{filteredRecords.length} 条记录</Tag>
          </Space>
        }
      >
        {filteredRecords.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={filteredRecords}
            renderItem={(record) => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record)}
                  >
                    查看详情
                  </Button>,
                  <Button 
                    type="text" 
                    icon={<DownloadOutlined />}
                  >
                    下载
                  </Button>,
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    删除
                  </Button>
                ]}
                className="hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors"
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center space-x-2">
                      <Text strong className="text-lg">{record.title}</Text>
                      <Tag color={getTypeColor(record.type)}>
                        {getTypeLabel(record.type)}
                      </Tag>
                      <Tag color={getStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-2">
                      <Text type="secondary">{record.summary}</Text>
                      <Text type="secondary" className="text-sm">
                        创建时间: {formatDate(record.createdAt)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="暂无匹配的历史记录"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="记录详情"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />}>
            下载报告
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Title level={4} className="mb-0">{selectedRecord.title}</Title>
              <Tag color={getTypeColor(selectedRecord.type)}>
                {getTypeLabel(selectedRecord.type)}
              </Tag>
              <Tag color={getStatusColor(selectedRecord.status)}>
                {getStatusLabel(selectedRecord.status)}
              </Tag>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <Text type="secondary" className="block mb-2">记录摘要:</Text>
              <Text>{selectedRecord.summary}</Text>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <Text>创建时间: {formatDate(selectedRecord.createdAt)}</Text>
              <Text>记录ID: {selectedRecord.id}</Text>
            </div>
            
            {/* 这里可以根据不同类型显示更详细的内容 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <Text type="secondary" className="block mb-2">详细内容:</Text>
              <Text>
                {selectedRecord.type === 'analysis' && '包含市场机会分析、技术建议和产品改进方案的完整分析报告...'}
                {selectedRecord.type === 'plan' && '详细的分阶段实施计划，包括任务分解、资源配置和风险评估...'}
                {selectedRecord.type === 'report' && '可下载的PDF/Word格式报告，包含完整的图表和数据分析...'}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default History;