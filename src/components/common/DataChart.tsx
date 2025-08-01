import React from 'react';
import { Card, Typography } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;

interface DataChartProps {
  type: 'bar' | 'doughnut' | 'line';
  title: string;
  data: any;
  options?: any;
  height?: number;
}

const DataChart: React.FC<DataChartProps> = ({
  type,
  title,
  data,
  options = {},
  height = 300
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    ...options
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={defaultOptions} height={height} />;
      case 'doughnut':
        return <Doughnut data={data} options={defaultOptions} height={height} />;
      case 'line':
        return <Line data={data} options={defaultOptions} height={height} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <AntTitle level={4} className="mb-4 text-center">
        {title}
      </AntTitle>
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </Card>
  );
};

// 预设的图表数据
export const chartData = {
  marketTrends: {
    labels: ['智能化', '环保材料', '定制服务', '节能技术', '自动化'],
    datasets: [
      {
        label: '市场需求度',
        data: [85, 72, 68, 79, 81],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  },
  
  competitiveAnalysis: {
    labels: ['技术创新', '成本控制', '市场份额', '品牌影响', '服务质量'],
    datasets: [
      {
        label: '我们的公司',
        data: [78, 85, 42, 35, 72],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
      {
        label: '行业平均',
        data: [65, 70, 60, 55, 68],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      },
    ],
  },
  
  implementationProgress: {
    labels: ['已完成', '进行中', '计划中'],
    datasets: [
      {
        data: [25, 45, 30],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  },
};

export default DataChart;