import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Select, Alert, Spin, Card, Steps, Typography } from 'antd'
import { CheckCircleOutlined, ExclamationCircleOutlined, RobotOutlined } from '@ant-design/icons'
import { aiServiceManager } from '../../services/AIServiceManager'

const { Option } = Select
const { Text, Title } = Typography
const { Step } = Steps

interface AIConfigModalProps {
  visible: boolean
  onClose: () => void
  onConfigured: () => void
}

export const AIConfigModal: React.FC<AIConfigModalProps> = ({
  visible,
  onClose,
  onConfigured
}) => {
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedProvider, setSelectedProvider] = useState<string>('openai')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [serviceStatus, setServiceStatus] = useState<any>(null)

  useEffect(() => {
    if (visible) {
      loadServiceStatus()
    }
  }, [visible])

  const loadServiceStatus = async () => {
    try {
      await aiServiceManager.initialize()
      const status = aiServiceManager.getServiceStatus()
      setServiceStatus(status)
      
      if (status.isOnline && status.currentProvider !== '演示模式') {
        setCurrentStep(2) // 已配置状态
      }
    } catch (error) {
      console.error('加载服务状态失败:', error)
    }
  }

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    setTestResult(null)
  }

  const handleTestConnection = async () => {
    try {
      const values = await form.validateFields()
      setTesting(true)
      setTestResult(null)

      const success = await aiServiceManager.configureService(selectedProvider, values.apiKey)
      
      if (success) {
        setTestResult({
          success: true,
          message: '连接成功！AI服务已配置完成。'
        })
        setCurrentStep(2)
        await loadServiceStatus()
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || '连接失败，请检查API密钥是否正确。'
      })
    } finally {
      setTesting(false)
    }
  }

  const handleFinish = () => {
    onConfigured()
    onClose()
  }

  const handleSkip = () => {
    // 继续使用演示模式
    onClose()
  }

  const getProviderInfo = (provider: string) => {
    const info = {
      openai: {
        name: 'OpenAI GPT',
        description: '最先进的AI模型，生成质量最高',
        cost: '约 $0.002/1K tokens',
        website: 'https://platform.openai.com/api-keys',
        placeholder: 'sk-...'
      },
      claude: {
        name: 'Anthropic Claude',
        description: '安全可靠的AI助手，成本较低',
        cost: '约 $0.00025/1K tokens',
        website: 'https://console.anthropic.com/',
        placeholder: 'sk-ant-...'
      }
    }
    return info[provider as keyof typeof info]
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center py-8">
            <RobotOutlined className="text-6xl text-blue-500 mb-4" />
            <Title level={3}>启用真实AI功能</Title>
            <Text className="text-gray-600 text-lg">
              当前使用演示模式，配置AI服务后可获得个性化的专业分析
            </Text>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="text-left">
                <Title level={5}>演示模式</Title>
                <Text>• 免费使用</Text><br />
                <Text>• 预设专业内容</Text><br />
                <Text>• 完整功能体验</Text>
              </Card>
              <Card className="text-left border-blue-300">
                <Title level={5} className="text-blue-600">AI模式</Title>
                <Text>• 个性化分析</Text><br />
                <Text>• 实时智能问答</Text><br />
                <Text>• 深度行业洞察</Text>
              </Card>
            </div>

            <div className="mt-8 space-x-4">
              <Button size="large" onClick={handleSkip}>
                继续使用演示模式
              </Button>
              <Button type="primary" size="large" onClick={() => setCurrentStep(1)}>
                配置AI服务
              </Button>
            </div>
          </div>
        )

      case 1:
        const providerInfo = getProviderInfo(selectedProvider)
        return (
          <div className="py-4">
            <Title level={4}>配置AI服务</Title>
            
            <Form form={form} layout="vertical" className="mt-6">
              <Form.Item label="选择AI服务商" required>
                <Select
                  value={selectedProvider}
                  onChange={handleProviderChange}
                  size="large"
                >
                  <Option value="openai">
                    <div>
                      <div className="font-semibold">OpenAI GPT</div>
                      <div className="text-sm text-gray-500">推荐 - 最先进的AI模型</div>
                    </div>
                  </Option>
                  <Option value="claude">
                    <div>
                      <div className="font-semibold">Anthropic Claude</div>
                      <div className="text-sm text-gray-500">成本更低的选择</div>
                    </div>
                  </Option>
                </Select>
              </Form.Item>

              {providerInfo && (
                <Card className="mb-4 bg-blue-50">
                  <div className="space-y-2">
                    <div><strong>服务商：</strong>{providerInfo.name}</div>
                    <div><strong>特点：</strong>{providerInfo.description}</div>
                    <div><strong>成本：</strong>{providerInfo.cost}</div>
                    <div>
                      <strong>获取API密钥：</strong>
                      <a href={providerInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2">
                        {providerInfo.website}
                      </a>
                    </div>
                  </div>
                </Card>
              )}

              <Form.Item
                label="API密钥"
                name="apiKey"
                rules={[{ required: true, message: '请输入API密钥' }]}
              >
                <Input.Password
                  placeholder={providerInfo?.placeholder}
                  size="large"
                />
              </Form.Item>

              {testResult && (
                <Alert
                  type={testResult.success ? 'success' : 'error'}
                  message={testResult.message}
                  className="mb-4"
                  icon={testResult.success ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                />
              )}

              <div className="space-x-4">
                <Button onClick={() => setCurrentStep(0)}>
                  返回
                </Button>
                <Button
                  type="primary"
                  onClick={handleTestConnection}
                  loading={testing}
                  size="large"
                >
                  {testing ? '测试连接中...' : '测试连接'}
                </Button>
              </div>
            </Form>
          </div>
        )

      case 2:
        return (
          <div className="text-center py-8">
            <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
            <Title level={3} className="text-green-600">配置成功！</Title>
            
            {serviceStatus && (
              <Card className="mt-6 text-left">
                <Title level={5}>当前服务状态</Title>
                <div className="space-y-2">
                  <div><strong>当前服务：</strong>{serviceStatus.currentProvider}</div>
                  <div><strong>状态：</strong>
                    <span className="text-green-600 ml-2">在线</span>
                  </div>
                  <div><strong>可用服务：</strong>{serviceStatus.availableProviders.join(', ')}</div>
                </div>
              </Card>
            )}

            <Alert
              type="success"
              message="现在您可以享受真实的AI分析服务了！"
              description="系统将为您生成个性化的专业研发建议，基于您的具体回答提供深度分析。"
              className="mt-6"
            />

            <Button type="primary" size="large" className="mt-6" onClick={handleFinish}>
              开始使用AI分析
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Modal
      title="AI服务配置"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <div className="py-4">
        <Steps current={currentStep} className="mb-8">
          <Step title="选择模式" />
          <Step title="配置服务" />
          <Step title="完成设置" />
        </Steps>

        {renderStepContent()}
      </div>
    </Modal>
  )
}