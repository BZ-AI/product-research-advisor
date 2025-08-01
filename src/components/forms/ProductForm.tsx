import React from 'react';
import { Form, Input, Select, Button, Card, Tag, message } from 'antd';
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Product } from '../../types';

const { TextArea } = Input;
const { Option } = Select;

interface ProductFormProps {
  product?: Product;
  onSave: (product: Partial<Product>) => void;
  onDelete?: (productId: string) => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSave, 
  onDelete,
  loading = false 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSave(values);
    message.success('产品信息保存成功');
  };

  const handleDelete = () => {
    if (product?.id && onDelete) {
      onDelete(product.id);
      message.success('产品删除成功');
    }
  };

  const categoryOptions = [
    '智能遮阳设备',
    '便携遮阳设备',
    '固定遮阳设备',
    '装饰遮阳设备',
    '商用遮阳设备',
    '其他'
  ];

  const marketPositionOptions = [
    '高端产品',
    '中端产品',
    '经济型产品',
    '定制化产品',
    '创新型产品'
  ];

  const techFeatureOptions = [
    '自动感应',
    '远程控制',
    '防风保护',
    '节能电机',
    '智能调节',
    '抗UV涂层',
    '轻量化材料',
    '快速折叠',
    '防水功能',
    '语音控制'
  ];

  return (
    <Card 
      title={product ? '编辑产品信息' : '添加新产品'}
      extra={
        product && onDelete && (
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={handleDelete}
          >
            删除产品
          </Button>
        )
      }
      className="w-full"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={product}
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Form.Item
            name="name"
            label="产品名称"
            rules={[
              { required: true, message: '请输入产品名称' },
              { min: 2, message: '产品名称至少2个字符' }
            ]}
          >
            <Input 
              placeholder="请输入产品名称" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="产品类别"
            rules={[{ required: true, message: '请选择产品类别' }]}
          >
            <Select 
              placeholder="请选择产品类别" 
              size="large"
            >
              {categoryOptions.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Form.Item
            name="marketPosition"
            label="市场定位"
            rules={[{ required: true, message: '请选择市场定位' }]}
          >
            <Select 
              placeholder="请选择市场定位" 
              size="large"
            >
              {marketPositionOptions.map(position => (
                <Option key={position} value={position}>
                  {position}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="targetMarket"
            label="目标市场"
            rules={[{ required: true, message: '请输入目标市场' }]}
          >
            <Input 
              placeholder="例如：高端住宅、商业空间" 
              size="large"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="techFeatures"
          label="技术特点"
          rules={[{ required: true, message: '请选择技术特点' }]}
        >
          <Select
            mode="multiple"
            placeholder="请选择产品的技术特点"
            size="large"
            tagRender={(props) => {
              const { label, onClose } = props;
              return (
                <Tag 
                  closable 
                  onClose={onClose}
                  color="blue"
                  className="m-1"
                >
                  {label}
                </Tag>
              );
            }}
          >
            {techFeatureOptions.map(feature => (
              <Option key={feature} value={feature}>
                {feature}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="产品描述"
          rules={[
            { required: true, message: '请输入产品描述' },
            { min: 10, message: '产品描述至少10个字符' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="请详细描述产品的特色、优势、应用场景等..."
            showCount
            maxLength={300}
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
            {product ? '更新产品信息' : '添加产品'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductForm;