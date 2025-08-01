import React, { useState } from 'react';
import { Upload, message, Card, Progress, List, Tag } from 'antd';
import { InboxOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { simulateProgress } from '../../utils/helpers';

const { Dragger } = Upload;

interface FileUploadProps {
  onUploadComplete?: (fileInfo: any) => void;
}

interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'analyzing' | 'done' | 'error';
  progress: number;
  size: number;
  type: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);

  const handleUpload = async (file: File) => {
    const newFile: UploadFile = {
      uid: `file-${Date.now()}`,
      name: file.name,
      status: 'uploading',
      progress: 0,
      size: file.size,
      type: file.type
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // 模拟上传进度
    await simulateProgress((progress) => {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.uid === newFile.uid 
            ? { ...f, progress, status: progress === 100 ? 'analyzing' : 'uploading' }
            : f
        )
      );
    }, 2000);

    // 模拟AI分析进度
    await simulateProgress((progress) => {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.uid === newFile.uid 
            ? { ...f, progress, status: progress === 100 ? 'done' : 'analyzing' }
            : f
        )
      );
    }, 3000);

    message.success(`${file.name} 上传并分析完成`);
    onUploadComplete?.(newFile);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg,.txt',
    beforeUpload: (file) => {
      const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'text/plain'].includes(file.type);
      const isValidSize = file.size / 1024 / 1024 < 50; // 50MB

      if (!isValidType) {
        message.error('只支持 PDF、Word、图片和文本文件');
        return false;
      }
      if (!isValidSize) {
        message.error('文件大小不能超过 50MB');
        return false;
      }

      handleUpload(file);
      return false; // 阻止默认上传行为
    },
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'uploading': 'blue',
      'analyzing': 'orange',
      'done': 'green',
      'error': 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      'uploading': '上传中',
      'analyzing': 'AI分析中',
      'done': '完成',
      'error': '失败'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="space-y-6">
      <Card>
        <Dragger {...uploadProps} className="p-8">
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-4xl text-blue-500" />
          </p>
          <p className="ant-upload-text text-lg font-medium">
            点击或拖拽文件到此区域上传
          </p>
          <p className="ant-upload-hint text-gray-500">
            支持 PDF、Word 文档、图片等格式，单个文件不超过 50MB
          </p>
        </Dragger>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card title="文件处理状态" className="mt-6">
          <List
            dataSource={uploadedFiles}
            renderItem={(file) => (
              <List.Item className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 flex-1">
                  <FileTextOutlined className="text-blue-500 text-lg" />
                  <div className="flex-1">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Tag color={getStatusColor(file.status)}>
                    {getStatusText(file.status)}
                  </Tag>
                  
                  {file.status !== 'done' && (
                    <Progress 
                      percent={file.progress} 
                      size="small" 
                      status={file.status === 'error' ? 'exception' : 'active'}
                      className="w-24"
                    />
                  )}
                  
                  {file.status === 'done' && (
                    <CheckCircleOutlined className="text-green-500 text-lg" />
                  )}
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default FileUpload;