import { Box, Typography, Container, Paper, Grid, Chip, CircularProgress } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { marketApi } from '../api/marketApi';
import type { MarketIndex } from '../api/marketApi';
import { usePortfolios } from '../hooks/usePortfolio';
import { useWatchlist } from '../hooks/useWatchlist';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { QUERY_STALE_TIME } from '../utils/constants';

function MarketIndexCard({ index }: { index: MarketIndex }) {
  const isPositive = index.changePercent >= 0;
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">{index.name}</Typography>
          <Typography variant="h6" fontWeight={700}>
            {index.value.toLocaleString()}
          </Typography>
        </Box>
        <Chip label={index.market} size="small" />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
        {isPositive
          ? <TrendingUp fontSize="small" color="error" />
          : <TrendingDown fontSize="small" color="primary" />}
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: isPositive ? 'error.main' : 'primary.main' }}
        >
          {formatPercent(index.changePercent)}
        </Typography>
      </Box>
    </Paper>
  );
}

function MarketOverview() {
  const { data: indices, isLoading } = useQuery({
    queryKey: ['market', 'indices'],
    queryFn: marketApi.getIndices,
    staleTime: QUERY_STALE_TIME,
  });

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>시장 지수</Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {(indices ?? []).map((idx) => (
            <Grid key={idx.name} size={{ xs: 6, sm: 3 }}>
              <MarketIndexCard index={idx} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

function PortfolioSnapshot() {
  const navigate = useNavigate();
  const { data: portfolios, isLoading } = usePortfolios();

  if (isLoading) return null;
  if (!portfolios || portfolios.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>내 포트폴리오</Typography>
      <Grid container spacing={2}>
        {portfolios.map((p) => {
          const isPositive = p.totalReturnPercent >= 0;
          return (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => navigate('/portfolio')}
              >
                <Typography fontWeight={600} noWrap>{p.name}</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                  {formatCurrency(p.totalValue)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  {isPositive
                    ? <TrendingUp fontSize="small" color="error" />
                    : <TrendingDown fontSize="small" color="primary" />}
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ color: isPositive ? 'error.main' : 'primary.main' }}
                  >
                    {formatPercent(p.totalReturnPercent)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({p.holdings.length}종목)
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

function WatchlistSnapshot() {
  const navigate = useNavigate();
  const { data: items, isLoading } = useWatchlist();

  if (isLoading) return null;
  if (!items || items.length === 0) return null;

  const preview = items.slice(0, 6);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>관심종목</Typography>
      <Grid container spacing={2}>
        {preview.map((item) => {
          const isPositive = item.stock.changePercent >= 0;
          return (
            <Grid key={item.id} size={{ xs: 6, sm: 4, md: 2 }}>
              <Paper
                sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => navigate(`/stock/${item.stock.market}/${item.stock.ticker}`)}
              >
                <Typography fontWeight={600}>{item.stock.ticker}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                  {item.stock.name}
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                  {formatCurrency(item.stock.price, item.stock.currency)}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ color: isPositive ? 'error.main' : 'primary.main' }}
                >
                  {formatPercent(item.stock.changePercent)}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Stock Planner
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          미국 &amp; 한국 주식 투자 플래너
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <SearchBar />
        </Box>
      </Box>

      <MarketOverview />
      <PortfolioSnapshot />
      <WatchlistSnapshot />
    </Container>
  );
}
