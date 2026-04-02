import { Card, CardActionArea, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPercent } from '../../utils/formatters';

interface StockCardProps {
  ticker: string;
  name: string;
  market: string;
  exchange?: string;
  sector?: string;
  changePercent?: number;
}

export default function StockCard({ ticker, name, market, exchange, sector, changePercent }: StockCardProps) {
  const navigate = useNavigate();
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea onClick={() => navigate(`/stock/${market}/${ticker}`)}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {ticker}
            </Typography>
            <Chip label={market} size="small" color={market === 'US' ? 'primary' : 'secondary'} />
          </Box>
          <Typography variant="body2" color="text.secondary" noWrap>
            {name}
          </Typography>
          {exchange && (
            <Typography variant="caption" color="text.secondary">
              {exchange} {sector && `| ${sector}`}
            </Typography>
          )}
          {changePercent !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              {isPositive ? <TrendingUp fontSize="small" color="error" /> : <TrendingDown fontSize="small" color="primary" />}
              <Typography variant="body2" sx={{ color: isPositive ? 'error.main' : 'primary.main', fontWeight: 600 }}>
                {formatPercent(changePercent)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
