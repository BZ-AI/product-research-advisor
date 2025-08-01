import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Timeline, 
  Tag, 
  Collapse, 
  List,
  Statistic,
  Modal,
  Form,
  InputNumber,
  Select
} from 'antd';
import { 
  PlayCircleOutlined, 
  ClockCircleOutlined, 
  DollarOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { mockImplementationPlan } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const ImplementationPlan: React.FC = () => {
  const [plan] = useState(mockImplementationPlan);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [form] = Form.useForm();

  const handleAdjustPlan = (values: any) => {
    console.log('Plan adjustments:', values);
    setShowAdjustModal(false);
    // 这里可以根据调整参数重新生成计划
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'red';
    if (priority === 2) return 'orange';
    return 'green';
  };

  const getPriorityText = (priority: number) => {
    if (priority === 1) return '高优先级';
    if (priority === 2) return '中优先级';
    return '低优先级';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">实施方案</Title>
          <Text type="secondary">
            基于分析结果生成的可执行实施计划，支持参数调整和优化
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<SettingOutlined />}
          onClick={() => setShowAdjustModal(true)}
        >
          调整方案参数
        </Button>
      </div>

      {/* 方案概览 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总体时间"
              value={plan.totalTimeline}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="预估成本"
              value={plan.estimatedCost}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="实施阶段"
              value={plan.phases.length}
              suffix="个阶段"
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 时间线视图 */}
      <Card title="实施时间线">
        <Timeline mode="left">
          {plan.phases.map((phase, index) => (
            <Timeline.Item
              key={phase.id}
              color={index === 0 ? 'green' : index === 1 ? 'blue' : 'gray'}
              dot={
                index === 0 ? <PlayCircleOutlined /> : 
                index === 1 ? <ClockCircleOutlined /> : 
                <CheckCircleOutlined />
              }
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Title level={5} className="mb-0">{phase.name}</Title>
                  <Tag color={getPriorityColor(phase.priority)}>
                    {getPriorityText(phase.priority)}
                  </Tag>
                  <Tag>{phase.duration}</Tag>
                </div>
                <Text type="secondary" className="block">
                  阶段 {index + 1} • {phase.tasks.length} 个任务 • {phase.resources.length} 项资源
                </Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* 详细阶段信息 */}
      <Card title="详细实施计划">
        <Collapse defaultActiveKey={['0']} className="bg-transparent">
          {plan.phases.map((phase, index) => (
            <Panel
              key={index}
              header={
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center space-x-3">
                    <Text strong>{phase.name}</Text>
                    <Tag color={getPriorityColor(phase.priority)}>
                      {getPriorityText(phase.priority)}
                    </Tag>
                    <Tag color="blue">{phase.duration}</Tag>
                  </div>
                </div>
              }
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card size="small" title="任务清单" className="h-full">
                    <List
                      size="small"
                      dataSource={phase.tasks}
                      renderItem={(task, taskIndex) => (
                        <List.Item>
                          <div className="flex items-center space-x-2 w-full">
                            <CheckCircleOutlined className="text-green-500" />
                            <Text className="flex-1">任务 {taskIndex + 1}: {task}</Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <Card size="small" title="资源需求" className="h-full">
                    <List
                      size="small"
                      dataSource={phase.resources}
                      renderItem={(resource, resourceIndex) => (
                        <List.Item>
                          <div className="flex items-center space-x-2 w-full">
                            <TeamOutlined className="text-blue-500" />
                            <Text className="flex-1">资源 {resourceIndex + 1}: {resource}</Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                
                {phase.risks.length > 0 && (
                  <Col xs={24}>
                    <Card size="small" title="风险评估" className="border-orange-200">
                      <List
                        size="small"
                        dataSource={phase.risks}
                        renderItem={(risk, riskIndex) => (
                          <List.Item>
                            <div className="flex items-center space-x-2 w-full">
                              <ExclamationCircleOutlined className="text-orange-500" />
                              <Text className="flex-1">风险 {riskIndex + 1}: {risk}</Text>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                )}
              </Row>
            </Panel>
          ))}
        </Collapse>
      </Card>

      {/* 方案调整模态框 */}
      <Modal
        title="调整方案参数"
        open={showAdjustModal}
        onCancel={() => setShowAdjustModal(false)}
        onOk={() => form.submit()}
        okText="重新生成方案"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdjustPlan}
          initialValues={{
            timeline: 12,
            budget: 150,
            riskTolerance: 'medium',
            priority: 'balanced'
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="timeline"
                label="预期时间线（月）"
                rules={[{ required: true, message: '请输入预期时间线' }]}
              >
                <InputNumber min={3} max={36} className="w-full" />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="budget"
                label="预算限制（万元）"
                rules={[{ required: true, message: '请输入预算限制' }]}
              >
                <InputNumber min={50} max={1000} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="riskTolerance"
                label="风险承受度"
                rules={[{ required: true, message: '请选择风险承受度' }]}
              >
                <Select>
                  <Select.Option value="low">保守型</Select.Option>
                  <Select.Option value="medium">平衡型</Select.Option>
                  <Select.Option value="high">激进型</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="priority"
                label="优先级重点"
                rules={[{ required: true, message: '请选择优先级重点' }]}
              >
                <Select>
                  <Select.Option value="speed">快速实施</Select.Option>
                  <Select.Option value="cost">成本控制</Select.Option>
                  <Select.Option value="quality">质量优先</Select.Option>
                  <Select.Option value="balanced">平衡发展</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ImplementationPlan;