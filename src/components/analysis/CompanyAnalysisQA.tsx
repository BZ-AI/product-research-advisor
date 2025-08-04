import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Progress, 
  Input, 
  Form, 
  message, 
  Tag,
  Space,
  Alert,
  Spin,
  Tooltip
} from 'antd';
import { 
  BuildOutlined, 
  CheckCircleOutlined, 
  ArrowRightOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { aiService } from '../../services/aiService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Question {
  id: number;
  dimension: string;
  title: string;
  content: string;
  answer?: string;
  keyPoints?: string[];
  followUpThoughts?: string;
}

interface CompanyAnalysisQAProps {
  companyName: string;
  industryResults?: any;
  onComplete: (results: any) => void;
}

const CompanyAnalysisQA: React.FC<CompanyAnalysisQAProps> = ({ 
  companyName, 
  industryResults,
  onComplete 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [form] = Form.useForm();
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');

  // 企业分析问题数据（精选核心问题）
  const questions: Question[] = [
    // 维度一：企业现状诊断与定位分析
    {
      id: 1,
      dimension: "企业现状诊断与定位分析",
      title: "企业基本画像",
      content: `请详细描述${companyName}的基本情况：成立时间、注册资本、员工规模、年营收范围、主营业务、核心产品线？`
    },
    {
      id: 2,
      dimension: "企业现状诊断与定位分析",
      title: "市场地位评估",
      content: `${companyName}在其所处行业中的市场地位如何？市场份额大概是多少？与行业TOP10企业相比处于什么位置？`
    },
    {
      id: 3,
      dimension: "企业现状诊断与定位分析",
      title: "产品组合分析",
      content: `请分析${companyName}当前的产品组合：核心产品有哪些？各产品线的营收贡献比例？产品生命周期阶段？`
    },
    {
      id: 4,
      dimension: "企业现状诊断与定位分析",
      title: "技术能力盘点",
      content: `${companyName}的技术能力现状如何？拥有哪些核心技术？技术团队规模？研发投入占营收比例？`
    },
    {
      id: 5,
      dimension: "企业现状诊断与定位分析",
      title: "核心竞争力识别",
      content: `${companyName}的核心竞争力是什么？这些竞争力的可持续性如何？与竞争对手相比的差异化优势在哪里？`
    },
    // 维度二：竞争环境与差距分析
    {
      id: 11,
      dimension: "竞争环境与差距分析",
      title: "直接竞争对手",
      content: `${companyName}的直接竞争对手有哪些？这些竞争对手的优势和劣势分别是什么？`
    },
    {
      id: 12,
      dimension: "竞争环境与差距分析",
      title: "技术差距分析",
      content: `${companyName}与行业技术领先企业相比，在核心技术方面存在哪些差距？这些差距需要多长时间才能缩小？`
    },
    // 维度三：市场机会与需求匹配
    {
      id: 21,
      dimension: "市场机会与需求匹配",
      title: "未开发市场识别",
      content: `基于行业分析，有哪些市场机会是${companyName}尚未涉足但具备进入条件的？`
    },
    {
      id: 22,
      dimension: "市场机会与需求匹配",
      title: "客户需求演变",
      content: `${companyName}的目标客户需求在近年来有什么变化趋势？这些变化对产品研发有什么启示？`
    },
    // 维度四：技术创新与产品开发
    {
      id: 31,
      dimension: "技术创新与产品开发",
      title: "技术路线图",
      content: `基于${companyName}的技术现状和行业技术趋势，应该制定怎样的技术发展路线图？`
    },
    {
      id: 32,
      dimension: "技术创新与产品开发",
      title: "产品创新方向",
      content: `基于市场需求和技术趋势，${companyName}的产品创新应该朝哪些方向发展？`
    },
    // 维度五：资源配置与能力建设
    {
      id: 41,
      dimension: "资源配置与能力建设",
      title: "核心能力建设",
      content: `${companyName}需要重点建设哪些核心能力？建设的优先级和时间安排如何？`
    },
    // 维度六：实施路径与行动计划
    {
      id: 51,
      dimension: "实施路径与行动计划",
      title: "战略目标设定",
      content: `基于前面的分析，${companyName}应该设定怎样的3-5年战略目标？`
    },
    {
      id: 52,
      dimension: "实施路径与行动计划",
      title: "优先级排序",
      content: `所有的研发建议中，哪些是最优先的？优先级排序的依据是什么？`
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleSaveAnswer = async (values: any) => {
    const answerData = {
      questionId: currentQuestion.id,
      answer: values.answer,
      keyPoints: values.keyPoints?.split('\n').filter((point: string) => point.trim()) || [],
      followUpThoughts: values.followUpThoughts,
      timestamp: new Date().toISOString()
    };

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerData
    }));

    // 使用AI增强分析
    if (values.answer && values.answer.length > 50) {
      try {
        setIsAIAnalyzing(true);
        const context = `企业：${companyName}，问题维度：${currentQuestion.dimension}`;
        const aiAnalysis = await aiService.enhanceQuestionAnswer(
          currentQuestion.content,
          values.answer,
          context
        );
        setAiSuggestion(aiAnalysis);
      } catch (error) {
        console.error('AI分析失败:', error);
      } finally {
        setIsAIAnalyzing(false);
      }
    }

    message.success('答案已保存');
    form.resetFields();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAiSuggestion(''); // 清除AI建议
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAiSuggestion(''); // 清除AI建议
    }
  };

  const handleComplete = () => {
    const analysisResults = {
      companyName,
      totalQuestions: questions.length,
      answeredQuestions: answeredCount,
      completionRate: (answeredCount / questions.length) * 100,
      answers,
      industryResults,
      completedAt: new Date().toISOString()
    };

    onComplete(analysisResults);
    message.success('企业分析完成！');
  };

  // 获取维度统计
  const getDimensionStats = () => {
    const dimensions = [...new Set(questions.map(q => q.dimension))];
    return dimensions.map(dim => {
      const dimQuestions = questions.filter(q => q.dimension === dim);
      const dimAnswered = dimQuestions.filter(q => answers[q.id]).length;
      return {
        name: dim,
        total: dimQuestions.length,
        answered: dimAnswered,
        progress: (dimAnswered / dimQuestions.length) * 100
      };
    });
  };

  useEffect(() => {
    // 加载已保存的答案到表单
    const savedAnswer = answers[currentQuestion?.id];
    if (savedAnswer) {
      form.setFieldsValue({
        answer: savedAnswer.answer,
        keyPoints: savedAnswer.keyPoints?.join('\n'),
        followUpThoughts: savedAnswer.followUpThoughts
      });
    } else {
      form.resetFields();
    }
  }, [currentQuestionIndex, answers, form, currentQuestion]);

  return (
    <div className="space-y-6">
      {/* 行业分析关联提示 */}
      {industryResults && (
        <Alert
          message="行业分析已完成"
          description={`已完成行业分析（完成度：${Math.round(industryResults.completionRate)}%），现在进行企业分析以生成个性化建议。`}
          type="success"
          icon={<InfoCircleOutlined />}
          showIcon
          closable
        />
      )}

      {/* 进度概览 */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="mb-0">
            {companyName} 企业分析问答
          </Title>
          <Space>
            <Tag color="blue">
              {answeredCount}/{questions.length} 已完成
            </Tag>
            <Tag color="green">
              {Math.round((answeredCount / questions.length) * 100)}% 完成度
            </Tag>
          </Space>
        </div>
        
        <Progress 
          percent={Math.round(progress)} 
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          className="mb-4"
        />

        {/* 维度进度 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getDimensionStats().map((dim, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <Text strong className="text-sm block mb-1">{dim.name}</Text>
              <div className="flex items-center justify-between">
                <Text className="text-xs text-gray-600">
                  {dim.answered}/{dim.total}
                </Text>
                <Text className="text-xs text-blue-600">
                  {Math.round(dim.progress)}%
                </Text>
              </div>
              <Progress 
                percent={dim.progress} 
                size="small" 
                showInfo={false}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* 当前问题 */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <BuildOutlined className="text-blue-500" />
            <span>问题 {currentQuestionIndex + 1}</span>
            <Tag color="blue">{currentQuestion?.dimension}</Tag>
          </div>
        }
        extra={
          answers[currentQuestion?.id] && (
            <CheckCircleOutlined className="text-green-500 text-lg" />
          )
        }
      >
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              {currentQuestion?.title}
            </Title>
            <Paragraph className="text-gray-700 bg-blue-50 p-4 rounded-lg">
              {currentQuestion?.content}
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveAnswer}
          >
            <Form.Item
              name="answer"
              label="详细回答"
              rules={[{ required: true, message: '请输入详细回答' }]}
            >
              <TextArea
                rows={6}
                placeholder="请基于企业实际情况，详细回答这个问题..."
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <Form.Item
              name="keyPoints"
              label="关键要点提取"
              extra="每行一个要点，系统将自动整理"
            >
              <TextArea
                rows={4}
                placeholder="• 要点1&#10;• 要点2&#10;• 要点3"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              name="followUpThoughts"
              label="后续思考"
              extra="基于回复的进一步思考或需要深入的方向"
            >
              <TextArea
                rows={3}
                placeholder="基于这个回答，您认为还需要进一步了解哪些方面..."
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  size="large"
                  loading={isAIAnalyzing}
                >
                  {isAIAnalyzing ? 'AI分析中...' : '保存答案'}
                </Button>
                
                {aiService.isAvailable() && (
                  <Tooltip title="AI将基于您的回答提供专业分析和建议">
                    <Tag icon={<RobotOutlined />} color="blue">
                      AI增强分析
                    </Tag>
                  </Tooltip>
                )}
              </Space>
            </Form.Item>
          </Form>

          {/* AI分析建议 */}
          {aiSuggestion && (
            <Card 
              size="small" 
              className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
              title={
                <div className="flex items-center space-x-2">
                  <BulbOutlined className="text-blue-500" />
                  <span className="text-blue-700">AI专业分析</span>
                </div>
              }
            >
              <div className="text-gray-700 whitespace-pre-line">
                {aiSuggestion}
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* 导航控制 */}
      <Card>
        <div className="flex items-center justify-between">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            上一题
          </Button>

          <div className="flex items-center space-x-4">
            <Text>
              {currentQuestionIndex + 1} / {questions.length}
            </Text>
            
            {answeredCount === questions.length && (
              <Button
                type="primary"
                size="large"
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                完成分析
              </Button>
            )}
          </div>

          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            下一题
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CompanyAnalysisQA;