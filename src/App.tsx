import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AnalysisWorkflow from './pages/AnalysisWorkflow';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50">
        <AnalysisWorkflow />
      </div>
    </ConfigProvider>
  );
}

export default App;