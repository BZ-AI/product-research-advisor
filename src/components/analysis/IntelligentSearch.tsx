import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
  List,
  Tag,
  Space,
  Alert,
  Spin,
  Progress,
  Collapse,
  Rate,
  message
} from 'antd';
import {
  SearchOutlined,
  RobotOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { searchService, SearchResult, AnalyzedInfo } from '../../services/searchService';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Panel } = Collapse;

interface IntelligentSearchProps {
  industry?: string;
  onSearchComplete: (results: AnalyzedInfo) => void;
}

const IntelligentSearch: React.FC<IntelligentSearchProps> = ({
  industry = '遮阳蓬行业',
  onSearchComplete
}) => {
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [analyzedInfo, setAnalyzedInfo] = useState<AnalyzedInfo | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);

  const handleSearch = async (keywords: string) => {
    if (!keywords.trim()) {
      message.warning('请输入搜索关键词');
      return;
    }

    setSearching(true);
    setSearchProgress(0);
    setSearchResults([]);
    setAnalyzedInfo(null);

    try {
      // 步骤1: 关键词扩展
      setCurrentStep('智能扩展搜索关键词...');
      setSearchProgress(20);
      
      const keywordList = keywords.split(/[,，\s]+/).filter(k => k.trim());
      const expandedKeywords = await searchService.expandKeywords(keywordList, industry);
      setSearchKeywords(expandedKeywords);

      // 步骤2: 搜索行业信息
      setCurrentStep('搜索相关行业信息...');
      setSearchProgress(40);
      
      const results = await searchService.searchIndustryInfo(expandedKeywords.slice(0, 10));
      setSearchResults(results);

      // 步骤3: AI分析搜索结果
      setCurrentStep('AI分析搜索结果...');
      setSearchProgress(70);
      
      const analysis = await searchService.analyzeSearchResults(results);
      setAnalyzedInfo(analysis);

      // 步骤4: 完成
      setCurrentStep('分析完成');
      setSearchProgress(100);
      
      onSearchComplete(analysis);
      message.success(`搜索完成，找到${results.length}条相关信息`);

    } catch (error) {
      console.error('智能搜索失败:', error);
      message.error('搜索失败，请重试');
    } finally {
      setSearching(false);
    }
  };

  const getSourceTypeIcon = (type: string) => {
    const icons = {
      official: <CheckCircleOutlined className="text-green-500" />,
      research: <TrophyOutlined className="text-blue-500" />,
      media: <GlobalOutlined className="text-orange-500" />,
      industry: <ExclamationCircleOutlined className="text-purple-500" />,
      unknown: <ExclamationCircleOutlined className="text-gray-400" />
    };
    return icons[type as keyof typeof icons] || icons.unknown;
  };

  const getSourceTypeLabel = (type: string) => {
    const labels = {
      official: '官方机构',
      research: '研究机构',
      media: '媒体报道',
      industry: '行业组织',
      unknown: '其他来源'
    };
    return labels[type as keyof typeof labels] || '未知来源';
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  const getRelevanceStars = (score: number) => {
    return Math.round(score / 20); // 转换为1-5星
  };

  return (
    <div className="space-y-6">
      {/* 搜索输入 */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <SearchOutlined className="text-blue-500" />
            <span>智能行业搜索</span>
            <Tag icon={<RobotOutlined />} color="blue">
              AI增强
            </Tag>
          </div>
        }
      >
        <div className="space-y-4">
          <Search
            placeholder={`输入${industry}相关关键词，如：市场趋势、技术发展、竞争格局等`}
            enterButton={
              <Button type="primary" icon={<SearchOutlined />} loading={searching}>
                智能搜索
              </Button>
            }
            size="large"
            onSearch={handleSearch}
            disabled={searching}
          />

          {/* 搜索进度 */}
          {searching && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Spin size="small" />
                <Text>{currentStep}</Text>
              </div>
              <Progress 
                percent={searchProgress} 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <Alert
                message="AI智能搜索中"
                description="正在使用人工智能技术搜索和分析相关信息，请稍候..."
                type="info"
                showIcon
                icon={<RobotOutlined />}
              />
            </div>
          )}

          {/* 扩展关键词显示 */}
          {searchKeywords.length > 0 && (
            <div>
              <Text className="text-sm text-gray-500 block mb-2">
                AI扩展的搜索关键词:
              </Text>
              <div className="flex flex-wrap gap-1">
                {searchKeywords.slice(0, 15).map((keyword, index) => (
                  <Tag key={index} size="small" color="blue">
                    {keyword}
                  </Tag>
                ))}
                {searchKeywords.length > 15 && (
                  <Tag size="small">+{searchKeywords.length - 15}个</Tag>
                )}
              </div>
            </div>
          )}

          <Alert
            message="智能搜索功能"
            description={
              <div>
                <p>• AI自动扩展搜索关键词，提高搜索覆盖面</p>
                <p>• 智能筛选高质量信息源，评估内容可信度</p>
                <p>• 自动分析搜索结果，提取关键趋势和洞察</p>
                <p>• 生成结构化分析报告供决策参考</p>
              </div>
            }
            type="info"
            showIcon
          />
        </div>
      </Card>

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <Card 
          title={`搜索结果 (${searchResults.length}条)`}
          extra={
            <Button 
              size="small" 
              icon={<ReloadOutlined />}
              onClick={() => handleSearch(searchKeywords.slice(0, 5).join(' '))}
            >
              重新搜索
            </Button>
          }
        >
          <List
            dataSource={searchResults}
            renderItem={(result, index) => (
              <List.Item className="border-0">
                <Card size="small" className="w-full">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <Title level={5} className="mb-0 flex-1">
                        {result.title}
                      </Title>
                      <div className="flex items-center space-x-2 ml-4">
                        <Tag color={getCredibilityColor(result.credibilityScore)}>
                          可信度: {result.credibilityScore}%
                        </Tag>
                        <Rate 
                          disabled 
                          value={getRelevanceStars(result.relevanceScore)} 
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <Paragraph className="text-gray-700 mb-2">
                      {result.content}
                    </Paragraph>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getSourceTypeIcon('unknown')}
                        <Text className="text-sm text-gray-500">
                          {result.source}
                        </Text>
                        <Text className="text-sm text-gray-400">
                          {result.publishDate.toLocaleDateString()}
                        </Text>
                      </div>
                      
                      {result.url && (
                        <Button 
                          type="link" 
                          size="small"
                          href={result.url}
                          target="_blank"
                        >
                          查看原文
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* AI分析结果 */}
      {analyzedInfo && (
        <Card 
          title={
            <div className="flex items-center space-x-2">
              <RobotOutlined className="text-blue-500" />
              <span>AI分析报告</span>
              <Tag color="green">置信度: {analyzedInfo.confidence}%</Tag>
            </div>
          }
        >
          <div className="space-y-4">
            {/* 整体摘要 */}
            <div>
              <Title level={5}>整体摘要</Title>
              <Paragraph className="bg-blue-50 p-4 rounded-lg">
                {analyzedInfo.summary}
              </Paragraph>
            </div>

            {/* 关键要点 */}
            <div>
              <Title level={5}>关键要点</Title>
              <List
                size="small"
                dataSource={analyzedInfo.keyPoints}
                renderItem={(point, index) => (
                  <List.Item className="py-2">
                    <div className="flex items-start space-x-2">
                      <Text className="text-blue-600 font-medium">{index + 1}.</Text>
                      <Text>{point}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            {/* 趋势分析 */}
            <Collapse>
              <Panel header="详细趋势分析" key="trends">
                <div className="space-y-4">
                  <div>
                    <Text strong className="text-green-600">新兴趋势:</Text>
                    <div className="mt-2">
                      {analyzedInfo.trends.emergingTrends.map((trend, index) => (
                        <Tag key={index} color="green" className="mb-1">
                          {trend}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Text strong className="text-red-600">衰退趋势:</Text>
                    <div className="mt-2">
                      {analyzedInfo.trends.decliningTrends.map((trend, index) => (
                        <Tag key={index} color="red" className="mb-1">
                          {trend}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Text strong className="text-blue-600">稳定趋势:</Text>
                    <div className="mt-2">
                      {analyzedInfo.trends.stableTrends.map((trend, index) => (
                        <Tag key={index} color="blue" className="mb-1">
                          {trend}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel header="信息源分析" key="sources">
                <List
                  size="small"
                  dataSource={analyzedInfo.sources}
                  renderItem={(source) => (
                    <List.Item>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          {getSourceTypeIcon(source.type)}
                          <Text>{source.name}</Text>
                          <Tag size="small" color="blue">
                            {getSourceTypeLabel(source.type)}
                          </Tag>
                        </div>
                        <Tag color={getCredibilityColor(source.credibility)}>
                          {source.credibility}%
                        </Tag>
                      </div>
                    </List.Item>
                  )}
                />
              </Panel>
            </Collapse>
          </div>
        </Card>
      )}
    </div>
  );
};

export default IntelligentSearch;