import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Chip, CircularProgress, Alert, Divider, Button,
  Paper, TextField, InputAdornment, IconButton,
  ToggleButton, ToggleButtonGroup, Stack,
} from '@mui/material';
import { TrendingUp, TrendingDown, ArrowForward } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../components/common/SearchBar';
import NewsCard from '../components/stock/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { marketApi } from '../api/marketApi';
import { useWatchlist } from '../hooks/useWatchlist';
import { usePortfolios } from '../hooks/usePortfolio';
import { useNews } from '../hooks/useNews';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { QUERY_STALE_TIME } from '../utils/constants';

const HOT_KEYWORDS = ['금리', '반도체', '환율', '삼성전자', '코스피', '원자재', 'SK하이닉스', '인플레이션'];

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
  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [newsMarket, setNewsMarket] = useState<string>('');

  const { data: indices, isLoading: indicesLoading, isError: indicesError } = useQuery({
    queryKey: ['marketIndices'],
    queryFn: marketApi.getIndices,
    staleTime: QUERY_STALE_TIME,
  });

  const { data: watchlist } = useWatchlist();
  const { data: portfolios } = usePortfolios();
  const { data: news, isLoading: newsLoading, error: newsError } = useNews(keyword, newsMarket || undefined, 15);

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed) setKeyword(trimmed);
  };

  const handleHotKeyword = (kw: string) => {
    setInputValue(kw);
    setKeyword(kw);
  };

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

      <Divider sx={{ my: 3 }} />

      {/* 핫이슈 뉴스 검색 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          핫이슈 뉴스 검색
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          키워드를 입력하거나 핫이슈를 클릭하면 관련 뉴스를 불러옵니다.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="키워드 입력 (예: 금리, 반도체, AAPL ...)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleSearch}>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup
            value={newsMarket}
            exclusive
            onChange={(_, v) => setNewsMarket(v ?? '')}
            size="small"
          >
            <ToggleButton value="" sx={{ fontSize: '0.75rem', px: 1.5 }}>전체</ToggleButton>
            <ToggleButton value="KR" sx={{ fontSize: '0.75rem', px: 1.5 }}>한국</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
          {HOT_KEYWORDS.map((kw) => (
            <Chip
              key={kw}
              label={kw}
              size="small"
              clickable
              color={keyword === kw ? 'primary' : 'default'}
              onClick={() => handleHotKeyword(kw)}
            />
          ))}
        </Stack>

        {!keyword && (
          <Typography variant="body2" color="text.disabled" textAlign="center" sx={{ py: 4 }}>
            키워드를 입력하거나 위 핫이슈를 클릭해보세요.
          </Typography>
        )}
        {keyword && newsLoading && <LoadingSpinner message="뉴스를 불러오는 중..." />}
        {keyword && newsError && <Alert severity="error">뉴스를 불러올 수 없습니다.</Alert>}
        {keyword && !newsLoading && news && news.length === 0 && (
          <Alert severity="info">"{keyword}" 관련 뉴스가 없습니다.</Alert>
        )}
        {keyword && !newsLoading && news && news.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              "{keyword}" 검색 결과 {news.length}건
            </Typography>
            {news.map((item, idx) => (
              <NewsCard key={`${item.url}-${idx}`} news={item} />
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
