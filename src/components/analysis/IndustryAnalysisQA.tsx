import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Progress, 
  Input, 
  Form, 
  message, 
  Steps,
  Tag,
  Divider,
  Space
} from 'antd';
import { 
  QuestionCircleOutlined, 
  CheckCircleOutlined, 
  ArrowRightOutlined,
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

interface Question {
  id: number;
  dimension: string;
  title: string;
  content: string;
  answer?: string;
  keyPoints?: string[];
  followUpThoughts?: string;
}

interface IndustryAnalysisQAProps {
  industry: string;
  onComplete: (results: any) => void;
}

const IndustryAnalysisQA: React.FC<IndustryAnalysisQAProps> = ({ 
  industry, 
  onComplete 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [form] = Form.useForm();

  // 行业分析问题数据
  const questions: Question[] = [
    // 维度一：行业认知与市场分析
    {
      id: 1,
      dimension: "行业认知与市场分析",
      title: "行业规模界定",
      content: `请分析${industry}的市场规模界定标准，包括主流的市场规模测算方法有哪些？这些数据来源的可信度如何验证？`
    },
    {
      id: 2,
      dimension: "行业认知与市场分析",
      title: "行业生命周期",
      content: `请判断${industry}目前处于行业生命周期的哪个阶段（萌芽期、成长期、成熟期、衰退期），并说明判断依据。`
    },
    {
      id: 3,
      dimension: "行业认知与市场分析",
      title: "监管环境",
      content: `请梳理${industry}的核心监管机构有哪些？主要的政策法规是什么？有哪些合规红线是企业绝对不能触碰的？`
    },
    {
      id: 4,
      dimension: "行业认知与市场分析",
      title: "竞争格局",
      content: `请分析${industry}TOP10企业的市场份额分布，以及这种竞争格局是如何形成的？有什么历史演变过程？`
    },
    {
      id: 5,
      dimension: "行业认知与市场分析",
      title: "客户画像",
      content: `请描述${industry}的典型客户群体画像，包括他们的基本特征和核心需求特征是什么？`
    },
    // 维度二：运营结构与效率优化
    {
      id: 11,
      dimension: "运营结构与效率优化",
      title: "成本结构",
      content: `请分析${industry}的平均成本结构，各项成本占比大概是多少？`
    },
    {
      id: 12,
      dimension: "运营结构与效率优化",
      title: "生产要素",
      content: `${industry}的关键生产要素有哪些？主要的获取渠道是什么？有什么有效的成本控制方法？`
    },
    // 维度三：客户价值与需求演化
    {
      id: 21,
      dimension: "客户价值与需求演化",
      title: "决策流程",
      content: `${industry}客户的决策流程有哪些关键节点？各节点的影响权重如何？`
    },
    // 维度四：风险防御与合规进化
    {
      id: 31,
      dimension: "风险防御与合规进化",
      title: "监管成本",
      content: `${industry}的政策敏感性如何？不同规模企业应对监管的成本差异有多大？`
    },
    // 维度五：技术变革与创新路径
    {
      id: 41,
      dimension: "技术变革与创新路径",
      title: "技术标准",
      content: `${industry}的主流技术标准是什么？核心技术原理、发展瓶颈及突破方向在哪里？`
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleSaveAnswer = (values: any) => {
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

    message.success('答案已保存');
    form.resetFields();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const analysisResults = {
      industry,
      totalQuestions: questions.length,
      answeredQuestions: answeredCount,
      completionRate: (answeredCount / questions.length) * 100,
      answers,
      completedAt: new Date().toISOString()
    };

    onComplete(analysisResults);
    message.success('行业分析完成！');
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
      {/* 进度概览 */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="mb-0">
            {industry} 行业分析问答
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
            <QuestionCircleOutlined className="text-blue-500" />
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
                placeholder="请基于您的了解和研究，详细回答这个问题..."
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
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                size="large"
              >
                保存答案
              </Button>
            </Form.Item>
          </Form>
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

export default IndustryAnalysisQA;