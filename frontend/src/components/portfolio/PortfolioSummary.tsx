import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { Portfolio } from '../../types/portfolio';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export default function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const isPositive = portfolio.totalReturnPercent >= 0;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {portfolio.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">총 평가액</Typography>
            <Typography variant="h6" fontWeight={600}>
              {formatCurrency(portfolio.totalValue)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">총 수익</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isPositive ? <TrendingUp color="error" fontSize="small" /> : <TrendingDown color="primary" fontSize="small" />}
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ color: isPositive ? 'error.main' : 'primary.main' }}
              >
                {formatCurrency(portfolio.totalReturn)} ({formatPercent(portfolio.totalReturnPercent)})
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">보유 종목 수</Typography>
            <Typography variant="h6" fontWeight={600}>
              {portfolio.holdings.length}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
