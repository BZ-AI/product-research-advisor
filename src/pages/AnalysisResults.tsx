import React, { useState } from 'react';
import { Row, Col, Card, Button, Typography, Progress, Statistic, Tabs } from 'antd';
import { 
  TrophyOutlined, 
  BulbOutlined, 
  RocketOutlined, 
  BarChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import ResultCard from '../components/common/ResultCard';
import DataChart, { chartData } from '../components/common/DataChart';
import ProgressIndicator from '../components/common/ProgressIndicator';
import { mockAnalysisReport } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AnalysisResults: React.FC = () => {
  const [analysisReport] = useState(mockAnalysisReport);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#fa8c16';
    return '#f5222d';
  };

  const getMatchScoreStatus = (score: number) => {
    if (score >= 80) return '优秀匹配';
    if (score >= 60) return '良好匹配';
    return '需要改进';
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div>
          <Title level={2} className="mb-2">分析结果</Title>
          <Text type="secondary">AI正在分析您的企业和产品信息...</Text>
        </div>
        
        <ProgressIndicator
          title="AI智能分析进行中"
          description="正在基于行业数据和企业信息生成个性化建议..."
          progress={Math.floor(analysisProgress)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">分析结果</Title>
          <Text type="secondary">
            基于AI智能分析生成的个性化研发建议 • 
            生成时间: {formatDate(analysisReport.createdAt)}
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={handleReanalyze}
        >
          重新分析
        </Button>
      </div>

      {/* 总体匹配度 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <Statistic
              title="总体匹配度"
              value={analysisReport.matchScore}
              suffix="%"
              valueStyle={{ 
                color: getMatchScoreColor(analysisReport.matchScore),
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }}
            />
            <div className="mt-2">
              <Text 
                style={{ color: getMatchScoreColor(analysisReport.matchScore) }}
                className="font-medium"
              >
                {getMatchScoreStatus(analysisReport.matchScore)}
              </Text>
            </div>
            <Progress
              percent={analysisReport.matchScore}
              strokeColor={getMatchScoreColor(analysisReport.matchScore)}
              showInfo={false}
              className="mt-3"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="市场机会"
              value={analysisReport.marketOpportunities.length}
              prefix={<TrophyOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="技术建议"
              value={analysisReport.techSuggestions.length}
              prefix={<BulbOutlined />}
              suffix="项"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="产品改进"
              value={analysisReport.productImprovements.length}
              prefix={<RocketOutlined />}
              suffix="个产品"
            />
          </Card>
        </Col>
      </Row>

      {/* 详细分析结果 */}
      <Tabs defaultActiveKey="opportunities" className="bg-white rounded-lg">
        <TabPane tab="市场机会分析" key="opportunities">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrophyOutlined className="text-green-500 text-xl" />
              <Title level={4} className="mb-0">市场机会分析</Title>
            </div>
            
            <Row gutter={[16, 16]}>
              {analysisReport.marketOpportunities.map((opportunity, index) => (
                <Col xs={24} lg={12} key={index}>
                  <ResultCard
                    type="opportunity"
                    title={opportunity.title}
                    description={opportunity.description}
                    impact={opportunity.impact}
                    feasibility={opportunity.feasibility}
                  />
                </Col>
              ))}
            </Row>

            <Row gutter={[16, 16]} className="mt-6">
              <Col xs={24} lg={12}>
                <DataChart
                  type="bar"
                  title="市场趋势分析"
                  data={chartData.marketTrends}
                  height={300}
                />
              </Col>
              <Col xs={24} lg={12}>
                <DataChart
                  type="line"
                  title="竞争力对比分析"
                  data={chartData.competitiveAnalysis}
                  height={300}
                />
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="技术发展建议" key="technology">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <BulbOutlined className="text-blue-500 text-xl" />
              <Title level={4} className="mb-0">技术发展建议</Title>
            </div>
            
            <Row gutter={[16, 16]}>
              {analysisReport.techSuggestions.map((suggestion, index) => (
                <Col xs={24} lg={12} key={index}>
                  <ResultCard
                    type="technology"
                    title={suggestion.title}
                    description={suggestion.description}
                    priority={suggestion.priority}
                    timeline={suggestion.timeline}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </TabPane>

        <TabPane tab="产品改进建议" key="improvements">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <RocketOutlined className="text-purple-500 text-xl" />
              <Title level={4} className="mb-0">产品改进建议</Title>
            </div>
            
            <Row gutter={[16, 16]}>
              {analysisReport.productImprovements.map((improvement, index) => (
                <Col xs={24} key={index}>
                  <ResultCard
                    type="improvement"
                    title={`产品改进建议 #${index + 1}`}
                    description={improvement.suggestions.join('、')}
                    tags={[`预期ROI: ${improvement.expectedROI}%`]}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </TabPane>

        <TabPane tab="数据洞察" key="insights">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChartOutlined className="text-orange-500 text-xl" />
              <Title level={4} className="mb-0">数据洞察</Title>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <DataChart
                  type="doughnut"
                  title="实施进度分布"
                  data={chartData.implementationProgress}
                  height={300}
                />
              </Col>
              <Col xs={24} lg={16}>
                <Card title="关键指标趋势">
                  <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6}>
                      <Statistic 
                        title="创新指数" 
                        value={78} 
                        suffix="/100"
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic 
                        title="市场适应性" 
                        value={85} 
                        suffix="/100"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic 
                        title="技术成熟度" 
                        value={72} 
                        suffix="/100"
                        valueStyle={{ color: '#fa8c16' }}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic 
                        title="投资回报率" 
                        value={32} 
                        suffix="%"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;