import React from 'react';
import { Layout, Button, Avatar, Dropdown, Space, Badge } from 'antd';
import { BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import AIStatusIndicator from '../common/AIStatusIndicator';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
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
    </AntHeader>
  );
};

export default Header;