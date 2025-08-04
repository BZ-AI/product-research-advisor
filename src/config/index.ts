// 应用配置文件 - 不依赖环境变量的配置方案
export const config = {
  // 应用基本信息
  appTitle: '产品研发建议平台',
  companyName: '广东格绿朗节能科技有限公司',
  version: '1.0.0',
  
  // 功能开关
  demoMode: false, // 演示模式 - 改为false，优先使用真实AI
  enableAI: true, // 启用AI功能
  enableAnalytics: false, // 分析统计
  
  // UI配置
  theme: {
    primaryColor: '#1890ff',
    successColor: '#52c41a',
    warningColor: '#faad14',
    errorColor: '#f5222d'
  },
  
  // 分析配置
  analysis: {
    industryQuestions: 10,
    companyQuestions: 14,
    recommendationCount: 5,
    maxRetries: 3
  },
  
  // API配置（如果需要）
  api: {
    baseUrl: '', // 暂时为空，纯前端应用
    timeout: 10000,
    retryCount: 3
  }
}

// 获取配置的辅助函数
export const getConfig = (key: string) => {
  const keys = key.split('.')
  let value: any = config
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value
}

// 检查功能是否启用
export const isFeatureEnabled = (feature: string): boolean => {
  switch (feature) {
    case 'demo':
      return config.demoMode
    case 'ai':
      return config.enableAI
    case 'analytics':
      return config.enableAnalytics
    default:
      return false
  }
}