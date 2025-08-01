import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Radio,
  Divider,
  List,
  Tag,
  Modal,
  message,
  Progress
} from 'antd';
import { 
  FilePdfOutlined, 
  FileTextOutlined, 
  FileExcelOutlined,
  ShareAltOutlined,
  LinkOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import ExportButton from '../components/common/ExportButton';
import { mockAnalysisReport, mockImplementationPlan } from '../data/mockData';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ReportExport: React.FC = () => {
  const [form] = Form.useForm();
  const [showPreview, setShowPreview] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const reportSections = [
    { 
      key: 'executive-summary', 
      label: '执行摘要',
      description: '分析结果的高级概述和关键发现',
      required: true
    },
    { 
      key: 'market-analysis', 
      label: '市场机会分析',
      description: '基于AI分析的市场机会和趋势',
      required: true
    },
    { 
      key: 'tech-suggestions', 
      label: '技术发展建议',
      description: '技术创新方向和实施建议',
      required: false
    },
    { 
      key: 'product-improvements', 
      label: '产品改进方案',
      description: '具体的产品优化建议',
      required: false
    },
    { 
      key: 'implementation-plan', 
      label: '实施计划',
      description: '详细的分阶段实施方案',
      required: false
    },
    { 
      key: 'risk-assessment', 
      label: '风险评估',
      description: '潜在风险和应对策略',
      required: false
    },
    { 
      key: 'appendix', 
      label: '附录',
      description: '原始数据和详细图表',
      required: false
    }
  ];

  const handleExport = async (values: any) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // 模拟导出进度
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsExporting(false);
            message.success('报告导出成功！');
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      console.log('Export configuration:', values);
    } catch (error) {
      setIsExporting(false);
      message.error('导出失败，请重试');
    }
  };

  const handleGenerateShareLink = () => {
    const link = `https://rd-platform.example.com/shared/report/${Date.now()}`;
    setShareLink(link);
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    message.success('链接已复制到剪贴板');
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-2">报告导出</Title>
        <Text type="secondary">
          自定义报告内容和格式，生成专业的产品研发建议报告
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* 导出配置 */}
        <Col xs={24} lg={16}>
          <Card title="报告配置">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleExport}
              initialValues={{
                format: 'pdf',
                language: 'zh-CN',
                style: 'professional',
                includeCharts: true,
                includeCoverPage: true,
                includeTableOfContents: true,
                sections: ['executive-summary', 'market-analysis']
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="title"
                    label="报告标题"
                    rules={[{ required: true, message: '请输入报告标题' }]}
                  >
                    <Input placeholder="产品研发建议报告" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="format"
                    label="导出格式"
                    rules={[{ required: true, message: '请选择导出格式' }]}
                  >
                    <Radio.Group>
                      <Radio value="pdf">
                        <FilePdfOutlined className="mr-1" />
                        PDF
                      </Radio>
                      <Radio value="word">
                        <FileTextOutlined className="mr-1" />
                        Word
                      </Radio>
                      <Radio value="excel">
                        <FileExcelOutlined className="mr-1" />
                        Excel
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="language" label="报告语言">
                    <Select>
                      <Select.Option value="zh-CN">中文简体</Select.Option>
                      <Select.Option value="zh-TW">中文繁体</Select.Option>
                      <Select.Option value="en-US">English</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="style" label="报告风格">
                    <Select>
                      <Select.Option value="professional">专业版</Select.Option>
                      <Select.Option value="executive">高管版</Select.Option>
                      <Select.Option value="technical">技术版</Select.Option>
                      <Select.Option value="marketing">市场版</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="description" label="报告描述">
                <TextArea 
                  rows={3} 
                  placeholder="请简要描述报告的用途和背景..."
                  showCount
                  maxLength={200}
                />
              </Form.Item>

              <Divider>报告内容选择</Divider>

              <Form.Item name="sections" label="包含章节">
                <Checkbox.Group className="w-full">
                  <List
                    dataSource={reportSections}
                    renderItem={(section) => (
                      <List.Item className="border-0 px-0">
                        <div className="w-full">
                          <div className="flex items-start space-x-3">
                            <Checkbox value={section.key} disabled={section.required} />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Text strong>{section.label}</Text>
                                {section.required && (
                                  <Tag color="red" size="small">必需</Tag>
                                )}
                              </div>
                              <Text type="secondary" className="text-sm block">
                                {section.description}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Checkbox.Group>
              </Form.Item>

              <Divider>高级选项</Divider>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Form.Item name="includeCharts" valuePropName="checked">
                    <Checkbox>包含图表</Checkbox>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={8}>
                  <Form.Item name="includeCoverPage" valuePropName="checked">
                    <Checkbox>包含封面</Checkbox>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={8}>
                  <Form.Item name="includeTableOfContents" valuePropName="checked">
                    <Checkbox>包含目录</Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              {/* 导出进度 */}
              {isExporting && (
                <div className="mb-4">
                  <Text className="block mb-2">正在生成报告...</Text>
                  <Progress percent={Math.floor(exportProgress)} status="active" />
                </div>
              )}

              <Form.Item className="mb-0">
                <div className="flex space-x-3">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={isExporting}
                    icon={<DownloadOutlined />}
                  >
                    生成并下载报告
                  </Button>
                  
                  <Button 
                    icon={<EyeOutlined />}
                    onClick={handlePreview}
                  >
                    预览报告
                  </Button>
                  
                  <Button 
                    icon={<ShareAltOutlined />}
                    onClick={handleGenerateShareLink}
                  >
                    生成分享链接
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 导出历史和快速操作 */}
        <Col xs={24} lg={8}>
          <div className="space-y-6">
            {/* 快速导出 */}
            <Card title="快速导出" size="small">
              <div className="space-y-3">
                <ExportButton
                  data={mockAnalysisReport}
                  filename="analysis-report"
                />
                <ExportButton
                  data={mockImplementationPlan}
                  filename="implementation-plan"
                />
              </div>
            </Card>

            {/* 导出提示 */}
            <Card title="导出说明" size="small">
              <div className="space-y-2 text-sm">
                <Text type="secondary" className="block">
                  • PDF格式适合阅读和打印
                </Text>
                <Text type="secondary" className="block">
                  • Word格式支持进一步编辑
                </Text>
                <Text type="secondary" className="block">
                  • Excel格式便于数据分析
                </Text>
                <Text type="secondary" className="block">
                  • 分享链接有效期为30天
                </Text>
              </div>
            </Card>

            {/* 最近导出 */}
            <Card title="最近导出" size="small">
              <List
                size="small"
                dataSource={[
                  { name: '市场分析报告.pdf', time: '2小时前' },
                  { name: '实施方案.docx', time: '1天前' },
                  { name: '产品建议.xlsx', time: '3天前' }
                ]}
                renderItem={(item) => (
                  <List.Item className="px-0 border-0">
                    <div className="w-full">
                      <Text className="text-sm font-medium block">{item.name}</Text>
                      <Text type="secondary" className="text-xs">{item.time}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Col>
      </Row>

      {/* 分享链接模态框 */}
      <Modal
        title="分享报告"
        open={showShareModal}
        onCancel={() => setShowShareModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowShareModal(false)}>
            关闭
          </Button>,
          <Button key="copy" type="primary" icon={<LinkOutlined />} onClick={copyShareLink}>
            复制链接
          </Button>
        ]}
      >
        <div className="space-y-4">
          <Text>报告分享链接已生成，您可以将此链接分享给相关人员：</Text>
          
          <div className="bg-gray-50 p-3 rounded border">
            <Text code className="text-sm break-all">{shareLink}</Text>
          </div>
          
          <div className="text-sm text-gray-500">
            <Text type="secondary">
              • 链接有效期：30天<br/>
              • 访问权限：仅限查看<br/>
              • 安全提示：请勿在公开场所分享
            </Text>
          </div>
        </div>
      </Modal>

      {/* 报告预览模态框 */}
      <Modal
        title="报告预览"
        open={showPreview}
        onCancel={() => setShowPreview(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setShowPreview(false)}>
            关闭
          </Button>
        ]}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="text-center border-b pb-4">
            <Title level={3}>产品研发建议报告</Title>
            <Text type="secondary">阳光遮蓬科技有限公司</Text>
            <br />
            <Text type="secondary">{new Date().toLocaleDateString()}</Text>
          </div>
          
          <div className="space-y-4">
            <div>
              <Title level={4}>执行摘要</Title>
              <Paragraph>
                基于AI智能分析，本报告为阳光遮蓬科技有限公司提供了全面的产品研发建议。
                通过对行业趋势、技术发展和市场机会的深入分析，我们识别出了关键的发展方向...
              </Paragraph>
            </div>
            
            <div>
              <Title level={4}>市场机会分析</Title>
              <Paragraph>
                智能家居集成市场呈现快速增长态势，预计未来3年将保持25%的年增长率。
                商业建筑节能改造政策为遮阳设备行业带来新的发展机遇...
              </Paragraph>
            </div>
            
            <div>
              <Title level={4}>技术发展建议</Title>
              <Paragraph>
                建议重点发展AI驱动的自适应遮阳系统，集成环境感知和用户习惯学习功能。
                同时，应关注新型轻量化材料的研发，提升产品竞争力...
              </Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportExport;