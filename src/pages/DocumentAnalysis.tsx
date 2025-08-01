import React, { useState } from 'react';
import { Row, Col, Card, Input, Button, List, Tag, Typography, Space, Empty } from 'antd';
import { SearchOutlined, GlobalOutlined, CalendarOutlined } from '@ant-design/icons';
import FileUpload from '../components/common/FileUpload';
import ProgressIndicator from '../components/common/ProgressIndicator';
import { mockDocumentAnalysis, mockSearchResults } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const DocumentAnalysis: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState(mockDocumentAnalysis);
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileUpload = (fileInfo: any) => {
    // 处理文件上传完成
    console.log('File uploaded:', fileInfo);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchLoading(true);
    setSearchQuery(query);
    
    try {
      // 模拟AI搜索过程
      setTimeout(() => {
        // 这里可以根据搜索关键词生成相关的模拟结果
        setSearchResults(mockSearchResults);
        setSearchLoading(false);
      }, 2000);
    } catch (error) {
      setSearchLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      market: 'blue',
      technology: 'green',
      competition: 'orange'
    };
    return colors[category as keyof typeof colors] || 'default';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      market: '市场趋势',
      technology: '技术发展',
      competition: '竞争分析'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-2">文档分析</Title>
        <Text type="secondary">
          上传行业报告或使用AI搜索功能，获取智能分析结果
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* 文件上传区域 */}
        <Col xs={24} lg={12}>
          <div className="space-y-6">
            <FileUpload onUploadComplete={handleFileUpload} />
            
            {/* 上传文件状态 */}
            {uploadedFiles.length > 0 && (
              <Card title="文件分析状态">
                <div className="space-y-4">
                  {uploadedFiles.map(file => (
                    <div key={file.id}>
                      {file.status !== 'completed' ? (
                        <ProgressIndicator
                          title={file.fileName}
                          description={
                            file.status === 'uploading' 
                              ? '正在上传文件...' 
                              : '正在进行AI智能分析...'
                          }
                          progress={file.progress}
                          status={file.status === 'failed' ? 'exception' : 'active'}
                        />
                      ) : (
                        <Card size="small" className="border border-green-200 bg-green-50">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Text strong>{file.fileName}</Text>
                              <Tag color="green">分析完成</Tag>
                            </div>
                            
                            {file.results && (
                              <div className="space-y-2">
                                <div>
                                  <Text className="text-sm font-medium">市场趋势:</Text>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {file.results.marketTrends.map((trend, idx) => (
                                      <Tag key={idx} size="small" color="blue">{trend}</Tag>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <Text className="text-sm font-medium">技术方向:</Text>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {file.results.techDirections.map((tech, idx) => (
                                      <Tag key={idx} size="small" color="green">{tech}</Tag>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <Text type="secondary" className="text-sm">
                                    可信度评分: {file.results.credibilityScore}/100
                                  </Text>
                                  <Text type="secondary" className="text-sm">
                                    {formatDate(file.uploadTime)}
                                  </Text>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </Col>

        {/* AI搜索区域 */}
        <Col xs={24} lg={12}>
          <div className="space-y-6">
            <Card title="AI智能搜索" className="h-fit">
              <div className="space-y-4">
                <Search
                  placeholder="输入行业关键词，如：智能遮阳、户外设备、节能技术等"
                  enterButton={
                    <Button type="primary" icon={<SearchOutlined />}>
                      AI搜索
                    </Button>
                  }
                  size="large"
                  onSearch={handleSearch}
                  loading={searchLoading}
                />
                
                <Text type="secondary" className="text-sm block">
                  AI将为您搜索相关的市场报告、技术文献和行业分析
                </Text>
              </div>
            </Card>

            {/* 搜索结果 */}
            {searchLoading && (
              <ProgressIndicator
                title="AI智能搜索中"
                description={`正在为您搜索"${searchQuery}"相关的行业信息...`}
                progress={Math.random() * 80 + 10}
              />
            )}

            {searchResults.length > 0 && !searchLoading && (
              <Card 
                title={
                  <Space>
                    <GlobalOutlined />
                    <span>搜索结果</span>
                    <Tag color="blue">{searchResults.length}条</Tag>
                  </Space>
                }
                className="h-fit"
              >
                <List
                  dataSource={searchResults}
                  renderItem={(result) => (
                    <List.Item className="border-0 px-0">
                      <div className="w-full">
                        <div className="flex items-start justify-between mb-2">
                          <Title level={5} className="mb-1 flex-1">
                            {result.title}
                          </Title>
                          <div className="flex items-center space-x-2 ml-4">
                            <Tag color={getCategoryColor(result.category)}>
                              {getCategoryLabel(result.category)}
                            </Tag>
                            <Text className="text-sm text-green-600 font-medium">
                              可信度: {result.credibility}%
                            </Text>
                          </div>
                        </div>
                        
                        <Paragraph 
                          className="text-gray-600 mb-2 text-sm"
                          ellipsis={{ rows: 2, expandable: true }}
                        >
                          {result.content}
                        </Paragraph>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <Space>
                            <Text>来源: {result.source}</Text>
                            <CalendarOutlined />
                            <Text>{result.publishDate}</Text>
                          </Space>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {searchResults.length === 0 && !searchLoading && searchQuery && (
              <Card>
                <Empty 
                  description={`未找到关于"${searchQuery}"的相关信息`}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentAnalysis;