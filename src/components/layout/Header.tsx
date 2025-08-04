import React, { useState } from 'react';
import { Layout, Button, Avatar, Dropdown, Space, Badge, Modal } from 'antd';
import { BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined, RobotOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import AIStatusIndicator from '../common/AIStatusIndicator';
import AIModelSelector from '../common/AIModelSelector';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const [showAISettings, setShowAISettings] = useState(false);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <AntHeader className="bg-white shadow-sm px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800 m-0">
          产品研发建议平台
        </h1>
        <AIStatusIndicator />
        <Button
          type="text"
          icon={<RobotOutlined />}
          onClick={() => setShowAISettings(true)}
          className="text-blue-600"
        >
          AI设置
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Badge count={3} size="small">
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            className="flex items-center justify-center"
          />
        </Badge>
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <Avatar size="small" icon={<UserOutlined />} />
            <span className="text-gray-700">管理员</span>
          </Space>
        </Dropdown>
      </div>

      {/* AI设置弹窗 */}
      <Modal
        title="AI模型设置"
        open={showAISettings}
        onCancel={() => setShowAISettings(false)}
        footer={null}
        width={600}
      >
        <AIModelSelector />
      </Modal>
    </AntHeader>
  );
};

export default Header;