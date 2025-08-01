import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  FileTextOutlined, 
  BuildOutlined, 
  BarChartOutlined,
  SolutionOutlined,
  HistoryOutlined,
  ExportOutlined 
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  selectedKey: string;
  onMenuSelect: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, selectedKey, onMenuSelect }) => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: 'document-analysis',
      icon: <FileTextOutlined />,
      label: '文档分析',
    },
    {
      key: 'company-config',
      icon: <BuildOutlined />,
      label: '企业配置',
    },
    {
      key: 'analysis-results',
      icon: <BarChartOutlined />,
      label: '分析结果',
    },
    {
      key: 'implementation-plan',
      icon: <SolutionOutlined />,
      label: '实施方案',
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: '历史记录',
    },
    {
      key: 'report-export',
      icon: <ExportOutlined />,
      label: '报告导出',
    },
  ];

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      className="bg-white shadow-lg"
      width={240}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        {!collapsed && (
          <div className="text-blue-600 font-bold text-lg">RD Platform</div>
        )}
        {collapsed && (
          <div className="text-blue-600 font-bold text-xl">RP</div>
        )}
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className="border-r-0 mt-4"
        onClick={({ key }) => onMenuSelect(key)}
      />
    </Sider>
  );
};

export default Sidebar;