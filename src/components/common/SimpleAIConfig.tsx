import React, { useState } from 'react'
import { Modal, Form, Input, Button, Alert, Typography } from 'antd'
import { RobotOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

interface SimpleAIConfigProps {
  visible: boolean
  onClose: () => void
  onConfigured: () => void
}

export const SimpleAIConfig: React.FC<SimpleAIConfigProps> = ({
  visible,
  onClose,
  onConfigured
}) => {
  const [form] = Form.useForm()
  const [testing, setTesting] = useState(false)

  const handleSubmit = async () => {
    try {
      setTesting(true)
      // 简化处理，直接调用配置完成
      setTimeout(() => {
        setTesting(false)
        onConfigured()
        onClose()
      }, 1000)
    } catch (error) {
      setTesting(false)
    }
  }

  return (
    <Modal
      title="AI服务配置"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <div className="py-4">
        <div className="text-center mb-6">
          <RobotOutlined className="text-4xl text-blue-500 mb-2" />
          <Title level={4}>启用真实AI功能</Title>
          <Text type="secondary">
            配置API密钥后可享受个性化AI分析
          </Text>
        </div>

        <Alert
          message="演示版本"
          description="当前为演示版本，AI功能已预配置。点击下方按钮体验完整功能。"
          type="info"
          className="mb-4"
        />

        <Form form={form} layout="vertical">
          <Form.Item label="OpenAI API密钥（可选）">
            <Input.Password 
              placeholder="sk-..." 
              disabled
            />
          </Form.Item>

          <div className="text-center">
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={testing}
              size="large"
            >
              {testing ? '配置中...' : '开始使用AI分析'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}