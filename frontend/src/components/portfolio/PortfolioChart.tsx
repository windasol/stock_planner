import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Paper, Typography } from '@mui/material';
import type { Holding } from '../../types/portfolio';

const COLORS = ['#e94560', '#0a1931', '#185adb', '#ffc93c', '#ff6b6b', '#6c5ce7', '#00cec9', '#fd79a8'];

interface PortfolioChartProps {
  holdings: Holding[];
}

export default function PortfolioChart({ holdings }: PortfolioChartProps) {
  if (holdings.length === 0) return null;

  const data = holdings.map((h) => ({
    name: h.stock.ticker,
    value: h.currentValue,
  }));

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        포트폴리오 구성
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}
