
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ScanData {
  name: string;
  scans?: number;
  value?: number;
  [key: string]: any;
}

interface QRCodeScansChartProps {
  data: ScanData[];
  title?: string;
  chartType?: 'bar' | 'line' | 'area' | 'pie';
  dataKey?: string;
  nameKey?: string;
  showArea?: boolean;
  customLabel?: string;
  colors?: string[];
}

const QRCodeScansChart: React.FC<QRCodeScansChartProps> = ({
  data,
  title,
  chartType = 'bar',
  dataKey = 'scans',
  nameKey = 'name',
  showArea = false,
  customLabel,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe']
}) => {
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} name={customLabel || dataKey} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={dataKey} stroke="#8884d8" fill="#8884d8" name={customLabel || dataKey} />
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return (
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#8884d8" name={customLabel || dataKey} />
          </BarChart>
        );
    }
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default QRCodeScansChart;
