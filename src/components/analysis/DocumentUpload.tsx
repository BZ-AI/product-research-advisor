import React, { useState } from 'react';
import {
  Card,
  Upload,
  Button,
  Typography,
  Progress,
  Alert,
  List,
  Tag,
  Space,
  Divider,
  Spin,
  message
} from 'antd';
import {
  InboxOutlined,
  FileTextOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { documentService, ParsedDocument } from '../../services/documentService';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface DocumentUploadProps {
  onDocumentParsed: (document: ParsedDocument) => void;
  maxFiles?: number;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentParsed,
  maxFiles = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedDocuments, setParsedDocuments] = useState<ParsedDocument[]>([]);
  const [currentParsingFile, setCurrentParsingFile] = useState<string>('');
  const [parsingProgress, setParsingProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    if (parsedDocuments.length >= maxFiles) {
      message.error(`最多只能上传${maxFiles}个文档`);
      return false;
    }

    setUploading(true);
    setCurrentParsingFile(file.name);
    
    try {
      // 检查文件类型
      const allowedTypes = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx|jpg|jpeg|png|gif)$/i)) {
        message.error('不支持的文件格式，请上传 PDF、Word、图片或文本文件');
        return false;
      }

      setParsing(true);
      setParsingProgress(0);

      // 使用流式解析获取实时进度
      const parseGenerator = documentService.parseStreamWithAI(file);
      let finalDocument: ParsedDocument | null = null;

      for await (const partialResult of parseGenerator) {
        if (partialResult.processingTime) {
          setParsingProgress(80 + (partialResult.processingTime / 30000) * 20); // 假设30秒完成
        } else {
          setParsingProgress(prev => Math.min(prev + 20, 75));
        }

        if (partialResult.extractedData && partialResult.aiSummary) {
          finalDocument = partialResult as ParsedDocument;
        }
      }

      if (finalDocument) {
        setParsedDocuments(prev => [...prev, finalDocument]);
        onDocumentParsed(finalDocument);
        message.success(`文档 "${file.name}" 解析完成`);
        setParsingProgress(100);
      } else {
        throw new Error('文档解析失败');
      }

    } catch (error) {
      console.error('文档上传解析失败:', error);
      message.error(`文档解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setUploading(false);
      setParsing(false);
      setCurrentParsingFile('');
      setParsingProgress(0);
    }

    return false; // 阻止默认上传行为
  };

  const handleRemoveDocument = (documentId: string) => {
    setParsedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    message.success('文档已移除');
  };

  const getDocumentTypeIcon = (type: string) => {
    const icons = {
      report: <FileTextOutlined className="text-blue-500" />,
      image: <EyeOutlined className="text-green-500" />,
      scan: <FileTextOutlined className="text-orange-500" />,
      mixed: <FileTextOutlined className="text-purple-500" />
    };
    return icons[type as keyof typeof icons] || <FileTextOutlined />;
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      report: '报告文档',
      image: '图片文档',
      scan: '扫描文档',
      mixed: '混合文档'
    };
    return labels[type as keyof typeof labels] || '未知类型';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  return (
    <div className="space-y-6">
      {/* 文档上传区域 */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <InboxOutlined className="text-blue-500" />
            <span>智能文档解析</span>
            <Tag icon={<RobotOutlined />} color="blue">
              AI增强
            </Tag>
          </div>
        }
      >
        <Dragger
          name="file"
          multiple={false}
          beforeUpload={handleFileUpload}
          showUploadList={false}
          disabled={uploading || parsedDocuments.length >= maxFiles}
          className="mb-4"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-4xl text-blue-500" />
          </p>
          <p className="ant-upload-text">
            点击或拖拽文件到此区域上传
          </p>
          <p className="ant-upload-hint">
            支持 PDF、Word、图片、文本文件。AI将自动解析并提取关键信息。
          </p>
        </Dragger>

        {/* 解析进度 */}
        {parsing && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Spin size="small" />
              <Text>正在解析文档: {currentParsingFile}</Text>
            </div>
            <Progress 
              percent={Math.round(parsingProgress)} 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              className="mb-2"
            />
            <Alert
              message="AI正在分析文档内容"
              description="系统正在使用人工智能技术提取关键信息，请稍候..."
              type="info"
              showIcon
              icon={<RobotOutlined />}
            />
          </div>
        )}

        {/* 使用说明 */}
        <Alert
          message="智能解析功能"
          description={
            <div>
              <p>• AI自动识别文档类型并选择最佳解析策略</p>
              <p>• 提取市场趋势、技术方向、竞争分析等关键信息</p>
              <p>• 生成结构化数据供后续分析使用</p>
              <p>• 支持图片和扫描文档的OCR识别</p>
            </div>
          }
          type="info"
          showIcon
          className="mt-4"
        />
      </Card>

      {/* 已解析文档列表 */}
      {parsedDocuments.length > 0 && (
        <Card title={`已解析文档 (${parsedDocuments.length}/${maxFiles})`}>
          <List
            dataSource={parsedDocuments}
            renderItem={(doc) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveDocument(doc.id)}
                  >
                    移除
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={getDocumentTypeIcon(doc.documentType)}
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{doc.originalFileName}</span>
                      <Tag color="blue">
                        {getDocumentTypeLabel(doc.documentType)}
                      </Tag>
                      <Tag color={getConfidenceColor(doc.confidenceScore)}>
                        置信度: {doc.confidenceScore}%
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-2">
                      <Text className="text-gray-600">
                        {doc.aiSummary}
                      </Text>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <Text className="text-xs text-gray-500 block">市场趋势</Text>
                          <Text className="font-medium text-blue-600">
                            {doc.extractedData.marketTrends.length}
                          </Text>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <Text className="text-xs text-gray-500 block">技术方向</Text>
                          <Text className="font-medium text-green-600">
                            {doc.extractedData.technicalDirections.length}
                          </Text>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <Text className="text-xs text-gray-500 block">竞争分析</Text>
                          <Text className="font-medium text-orange-600">
                            {doc.extractedData.competitiveAnalysis.length}
                          </Text>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <Text className="text-xs text-gray-500 block">关键指标</Text>
                          <Text className="font-medium text-purple-600">
                            {doc.extractedData.keyMetrics.length}
                          </Text>
                        </div>
                      </div>

                      <div className="mt-2">
                        <Text className="text-xs text-gray-500">
                          解析时间: {(doc.processingTime / 1000).toFixed(1)}秒
                        </Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* 解析结果统计 */}
      {parsedDocuments.length > 0 && (
        <Card title="解析结果统计" size="small">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Text className="text-2xl font-bold text-blue-600 block">
                {parsedDocuments.reduce((sum, doc) => sum + doc.extractedData.marketTrends.length, 0)}
              </Text>
              <Text className="text-sm text-gray-500">市场趋势</Text>
            </div>
            <div className="text-center">
              <Text className="text-2xl font-bold text-green-600 block">
                {parsedDocuments.reduce((sum, doc) => sum + doc.extractedData.technicalDirections.length, 0)}
              </Text>
              <Text className="text-sm text-gray-500">技术方向</Text>
            </div>
            <div className="text-center">
              <Text className="text-2xl font-bold text-orange-600 block">
                {parsedDocuments.reduce((sum, doc) => sum + doc.extractedData.competitiveAnalysis.length, 0)}
              </Text>
              <Text className="text-sm text-gray-500">竞争信息</Text>
            </div>
            <div className="text-center">
              <Text className="text-2xl font-bold text-purple-600 block">
                {Math.round(parsedDocuments.reduce((sum, doc) => sum + doc.confidenceScore, 0) / parsedDocuments.length)}%
              </Text>
              <Text className="text-sm text-gray-500">平均置信度</Text>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;