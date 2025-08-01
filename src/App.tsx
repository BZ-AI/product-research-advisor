import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DocumentAnalysis from './pages/DocumentAnalysis';
import CompanyConfig from './pages/CompanyConfig';
import AnalysisResults from './pages/AnalysisResults';
import ImplementationPlan from './pages/ImplementationPlan';
import History from './pages/History';
import ReportExport from './pages/ReportExport';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'document-analysis':
        return <DocumentAnalysis />;
      case 'company-config':
        return <CompanyConfig />;
      case 'analysis-results':
        return <AnalysisResults />;
      case 'implementation-plan':
        return <ImplementationPlan />;
      case 'history':
        return <History />;
      case 'report-export':
        return <ReportExport />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout
        selectedKey={currentPage}
        onMenuSelect={setCurrentPage}
      >
        {renderCurrentPage()}
      </Layout>
    </ConfigProvider>
  );
}

export default App;