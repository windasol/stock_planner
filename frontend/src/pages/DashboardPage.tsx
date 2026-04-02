import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Chip, CircularProgress, Alert, Divider, Button,
} from '@mui/material';
import { TrendingUp, TrendingDown, ArrowForward } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../components/common/SearchBar';
import { marketApi } from '../api/marketApi';
import { useWatchlist } from '../hooks/useWatchlist';
import { usePortfolios } from '../hooks/usePortfolio';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { QUERY_STALE_TIME } from '../utils/constants';

function ChangeLabel({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {isPositive
        ? <TrendingUp fontSize="small" sx={{ color: 'error.main' }} />
        : <TrendingDown fontSize="small" sx={{ color: 'primary.main' }} />
      }
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ color: isPositive ? 'error.main' : 'primary.main' }}
      >
        {formatPercent(value)}
      </Typography>
    </Box>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: indices, isLoading: indicesLoading, isError: indicesError } = useQuery({
    queryKey: ['marketIndices'],
    queryFn: marketApi.getIndices,
    staleTime: QUERY_STALE_TIME,
  });

  const { data: watchlist } = useWatchlist();
  const { data: portfolios } = usePortfolios();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 & 검색 */}
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

      {/* 시장 지수 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          시장 지수
        </Typography>
        {indicesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : indicesError ? (
          <Alert severity="warning">시장 지수를 불러올 수 없습니다.</Alert>
        ) : (
          <Grid container spacing={2}>
            {indices?.map((index) => (
              <Grid item xs={6} sm={4} md={3} key={index.name}>
                <Card variant="outlined">
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>{index.name}</Typography>
                      <Chip label={index.market} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {index.value.toLocaleString()}
                    </Typography>
                    <ChangeLabel value={index.changePercent} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        {/* 관심종목 미리보기 */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>관심종목</Typography>
            <Button
              size="small"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/watchlist')}
            >
              전체보기
            </Button>
          </Box>
          {!watchlist || watchlist.length === 0 ? (
            <Alert severity="info" sx={{ fontSize: 14 }}>
              관심종목이 없습니다.
            </Alert>
          ) : (
            <Card variant="outlined">
              {watchlist.slice(0, 5).map((item, idx) => (
                <Box key={item.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 2,
                      py: 1.5,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate(`/stock/${item.stock.market}/${item.stock.ticker}`)}
                  >
                    <Box>
                      <Typography fontWeight={600} variant="body2">{item.stock.ticker}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.stock.name}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(item.stock.price, item.stock.currency)}
                      </Typography>
                      <ChangeLabel value={item.stock.changePercent} />
                    </Box>
                  </Box>
                  {idx < Math.min(watchlist.length, 5) - 1 && <Divider />}
                </Box>
              ))}
            </Card>
          )}
        </Grid>

        {/* 포트폴리오 미리보기 */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>포트폴리오</Typography>
            <Button
              size="small"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/portfolio')}
            >
              전체보기
            </Button>
          </Box>
          {!portfolios || portfolios.length === 0 ? (
            <Alert severity="info" sx={{ fontSize: 14 }}>
              포트폴리오가 없습니다.
            </Alert>
          ) : (
            <Card variant="outlined">
              {portfolios.slice(0, 5).map((portfolio, idx) => {
                const isPositive = portfolio.totalReturnPercent >= 0;
                return (
                  <Box key={portfolio.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        py: 1.5,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => navigate('/portfolio')}
                    >
                      <Box>
                        <Typography fontWeight={600} variant="body2">{portfolio.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {portfolio.holdings.length}개 종목
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(portfolio.totalValue)}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          sx={{ color: isPositive ? 'error.main' : 'primary.main' }}
                        >
                          {formatPercent(portfolio.totalReturnPercent)}
                        </Typography>
                      </Box>
                    </Box>
                    {idx < Math.min(portfolios.length, 5) - 1 && <Divider />}
                  </Box>
                );
              })}
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
