import React, { useState } from 'react';
import { Layout as AntLayout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
  selectedKey: string;
  onMenuSelect: (key: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, selectedKey, onMenuSelect }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntLayout className="min-h-screen">
      <Sidebar 
        collapsed={collapsed} 
        selectedKey={selectedKey}
        onMenuSelect={onMenuSelect}
      />
      <AntLayout>
        <Header />
        <div className="bg-white px-6 py-2 border-b border-gray-200 flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center"
          />
        </div>
        <Content className="bg-gray-50 p-6">
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;