import { Box, Typography, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { Stock } from '../../types/stock';
import { formatCurrency, formatPercent, formatMarketCap } from '../../utils/formatters';

interface StockInfoProps {
  stock: Stock;
}

export default function StockInfo({ stock }: StockInfoProps) {
  const isPositive = stock.changePercent >= 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="h4" fontWeight={700}>
          {stock.ticker}
        </Typography>
        <Chip label={stock.market} size="small" color={stock.market === 'US' ? 'primary' : 'secondary'} />
        <Chip label={stock.exchange} size="small" variant="outlined" />
      </Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {stock.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h3" fontWeight={700}>
          {formatCurrency(stock.price, stock.currency)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {isPositive ? <TrendingUp color="error" /> : <TrendingDown color="primary" />}
          <Typography
            variant="h6"
            sx={{ color: isPositive ? 'error.main' : 'primary.main', fontWeight: 600 }}
          >
            {formatPercent(stock.changePercent)}
          </Typography>
        </Box>
      </Box>
      {stock.marketCap && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          시가총액: {formatMarketCap(stock.marketCap, stock.currency)}
          {stock.sector && ` | 섹터: ${stock.sector}`}
        </Typography>
      )}
    </Box>
  );
}
