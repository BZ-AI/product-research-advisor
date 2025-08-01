import React from 'react';
import { Form, Input, Select, Button, Card, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import type { Company } from '../../types';

const { TextArea } = Input;
const { Option } = Select;

interface CompanyFormProps {
  company?: Company;
  onSave: (company: Partial<Company>) => void;
  loading?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ 
  company, 
  onSave, 
  loading = false 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSave(values);
    message.success('企业信息保存成功');
  };

  const industryOptions = [
    '遮阳设备制造',
    '智能家居',
    '建筑材料',
    '户外用品',
    '新能源',
    '环保科技',
    '其他'
  ];

  const scaleOptions = [
    { value: 'small', label: '小型企业 (50人以下)' },
    { value: 'medium', label: '中型企业 (50-500人)' },
    { value: 'large', label: '大型企业 (500人以上)' }
  ];

  return (
    <Card title="企业基本信息" className="w-full">
      <Form
        form={form}
        layout="vertical"
        initialValues={company}
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Form.Item
            name="name"
            label="企业名称"
            rules={[
              { required: true, message: '请输入企业名称' },
              { min: 2, message: '企业名称至少2个字符' }
            ]}
          >
            <Input 
              placeholder="请输入企业名称" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="industry"
            label="所属行业"
            rules={[{ required: true, message: '请选择所属行业' }]}
          >
            <Select 
              placeholder="请选择所属行业" 
              size="large"
              showSearch
              optionFilterProp="children"
            >
              {industryOptions.map(industry => (
                <Option key={industry} value={industry}>
                  {industry}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="scale"
          label="企业规模"
          rules={[{ required: true, message: '请选择企业规模' }]}
        >
          <Select placeholder="请选择企业规模" size="large">
            {scaleOptions.map(scale => (
              <Option key={scale.value} value={scale.value}>
                {scale.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="企业描述"
          rules={[
            { required: true, message: '请输入企业描述' },
            { min: 10, message: '企业描述至少10个字符' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="请简要描述企业的主营业务、发展阶段、核心竞争力等..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
            className="w-full lg:w-auto"
          >
            保存企业信息
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CompanyForm;