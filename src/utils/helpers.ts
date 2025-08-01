export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString()}万`;
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'completed': '#52c41a',
    'in-progress': '#1890ff',
    'analyzing': '#fa8c16',
    'uploading': '#722ed1',
    'failed': '#f5222d'
  };
  return statusColors[status] || '#d9d9d9';
};

export const getPriorityColor = (priority: string): string => {
  const priorityColors: Record<string, string> = {
    'high': '#f5222d',
    'medium': '#fa8c16',
    'low': '#52c41a'
  };
  return priorityColors[priority] || '#d9d9d9';
};

export const generateReportId = (): string => {
  return `RPT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const simulateProgress = (
  onProgress: (progress: number) => void,
  duration: number = 3000
): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        onProgress(progress);
        clearInterval(interval);
        resolve();
      } else {
        onProgress(Math.floor(progress));
      }
    }, duration / 20);
  });
};

export const downloadReport = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};