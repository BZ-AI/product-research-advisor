import React, { useState } from 'react';
import { Row, Col, Card, Button, List, Typography, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CompanyForm from '../components/forms/CompanyForm';
import ProductForm from '../components/forms/ProductForm';
import { mockCompany, mockProducts } from '../data/mockData';
import type { Company, Product } from '../types';

const { Title, Text } = Typography;

const CompanyConfig: React.FC = () => {
  const [company, setCompany] = useState<Company>(mockCompany);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveCompany = async (companyData: Partial<Company>) => {
    setLoading(true);
    try {
      // 模拟保存过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCompany(prev => ({ ...prev, ...companyData }));
      message.success('企业信息更新成功');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingProduct) {
        // 更新现有产品
        setProducts(prev => 
          prev.map(p => 
            p.id === editingProduct.id 
              ? { ...p, ...productData }
              : p
          )
        );
        message.success('产品信息更新成功');
      } else {
        // 添加新产品
        const newProduct: Product = {
          id: Date.now().toString(),
          ...productData
        } as Product;
        setProducts(prev => [...prev, newProduct]);
        message.success('产品添加成功');
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个产品吗？此操作不可恢复。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        setShowProductForm(false);
        setEditingProduct(null);
        message.success('产品删除成功');
      }
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-2">企业配置</Title>
        <Text type="secondary">
          配置企业基本信息和产品体系，为AI分析提供准确的基础数据
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* 企业信息 */}
        <Col xs={24} lg={16}>
          <CompanyForm 
            company={company}
            onSave={handleSaveCompany}
            loading={loading}
          />
        </Col>

        {/* 企业概况 */}
        <Col xs={24} lg={8}>
          <Card title="企业概况" className="h-fit">
            <div className="space-y-4">
              <div>
                <Text type="secondary" className="text-sm">企业名称</Text>
                <div className="font-medium">{company.name}</div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">所属行业</Text>
                <div className="font-medium">{company.industry}</div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">企业规模</Text>
                <div className="font-medium">
                  {company.scale === 'small' ? '小型企业' : 
                   company.scale === 'medium' ? '中型企业' : '大型企业'}
                </div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">产品数量</Text>
                <div className="font-medium">{products.length} 个产品</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 产品管理 */}
      <Card 
        title="产品管理"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddProduct}
          >
            添加产品
          </Button>
        }
      >
        {products.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
            dataSource={products}
            renderItem={(product) => (
              <List.Item>
                <Card
                  hoverable
                  actions={[
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      onClick={() => handleEditProduct(product)}
                    >
                      编辑
                    </Button>,
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      删除
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          类别: {product.category}
                        </div>
                        <div className="text-sm text-gray-600">
                          定位: {product.marketPosition}
                        </div>
                        <div className="text-sm text-gray-600">
                          市场: {product.targetMarket}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {product.description}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <div className="text-center py-8">
            <Text type="secondary">暂无产品信息，请添加产品</Text>
          </div>
        )}
      </Card>

      {/* 产品表单模态框 */}
      <Modal
        title={editingProduct ? '编辑产品' : '添加产品'}
        open={showProductForm}
        onCancel={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <ProductForm
          product={editingProduct || undefined}
          onSave={handleSaveProduct}
          onDelete={editingProduct ? handleDeleteProduct : undefined}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default CompanyConfig;