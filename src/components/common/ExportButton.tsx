import React, { useState } from 'react';
import { Button, Dropdown, Modal, Form, Input, Select, message, Space } from 'antd';
import { ExportOutlined, FileTextOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { downloadReport } from '../../utils/helpers';

interface ExportButtonProps {
  data: any;
  filename?: string;
  onExport?: (format: string, options: any) => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  filename = 'report', 
  onExport 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [form] = Form.useForm();

  const exportFormats = [
    { key: 'pdf', label: 'PDF 报告', icon: <FilePdfOutlined /> },
    { key: 'word', label: 'Word 文档', icon: <FileTextOutlined /> },
    { key: 'excel', label: 'Excel 表格', icon: <FileExcelOutlined /> },
  ];

  const menuItems: MenuProps['items'] = exportFormats.map(format => ({
    key: format.key,
    icon: format.icon,
    label: format.label,
    onClick: () => {
      setSelectedFormat(format.key);
      setModalVisible(true);
    }
  }));

  const handleExport = async (values: any) => {
    try {
      // 模拟导出过程
      const exportData = {
        format: selectedFormat,
        filename: values.filename || filename,
        title: values.title,
        includeCharts: values.includeCharts,
        includeRawData: values.includeRawData,
        data
      };

      // 生成模拟报告内容
      const reportContent = generateReportContent(exportData);
      
      // 模拟文件下载
      downloadReport(
        reportContent, 
        `${values.filename || filename}.${selectedFormat === 'word' ? 'docx' : selectedFormat}`
      );

      message.success(`${exportFormats.find(f => f.key === selectedFormat)?.label} 导出成功`);
      setModalVisible(false);
      form.resetFields();
      
      onExport?.(selectedFormat, exportData);
    } catch (error) {
      message.error('导出失败，请重试');
    }
  };

  const generateReportContent = (exportData: any) => {
    const { title, format, data } = exportData;
    
    let content = `${title}\n\n`;
    content += `导出时间: ${new Date().toLocaleString()}\n`;
    content += `导出格式: ${format.toUpperCase()}\n\n`;
    
    if (data) {
      content += '=== 报告内容 ===\n\n';
      content += JSON.stringify(data, null, 2);
    }
    
    return content;
  };

  return (
    <>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Button type="primary" icon={<ExportOutlined />}>
          导出报告
        </Button>
      </Dropdown>

      <Modal
        title={`导出 ${exportFormats.find(f => f.key === selectedFormat)?.label}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="确认导出"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleExport}
          initialValues={{
            filename: filename,
            title: '产品研发建议报告',
            includeCharts: true,
            includeRawData: false
          }}
        >
          <Form.Item
            name="filename"
            label="文件名"
            rules={[{ required: true, message: '请输入文件名' }]}
          >
            <Input placeholder="请输入文件名" />
          </Form.Item>

          <Form.Item
            name="title"
            label="报告标题"
            rules={[{ required: true, message: '请输入报告标题' }]}
          >
            <Input placeholder="请输入报告标题" />
          </Form.Item>

          <Form.Item name="includeCharts" label="包含图表">
            <Select>
              <Select.Option value={true}>是</Select.Option>
              <Select.Option value={false}>否</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="includeRawData" label="包含原始数据">
            <Select>
              <Select.Option value={true}>是</Select.Option>
              <Select.Option value={false}>否</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ExportButton;