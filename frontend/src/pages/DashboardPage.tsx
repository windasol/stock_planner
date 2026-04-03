import { useState } from 'react';
import {
  Box, Typography, Container, Paper,
  TextField, InputAdornment, IconButton,
  ToggleButton, ToggleButtonGroup, Chip, Stack,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchBar from '../components/common/SearchBar';
import NewsCard from '../components/stock/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNews } from '../hooks/useNews';

const HOT_KEYWORDS = ['금리', '반도체', 'AI', '환율', '삼성전자', 'NVIDIA', '원자재', '코스피'];

export default function DashboardPage() {
  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [market, setMarket] = useState<string>('');

  const { data: news, isLoading, error } = useNews(keyword, market || undefined, 15);

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
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Stock Planner
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          미국 & 한국 주식 투자 플래너
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <SearchBar />
        </Box>
      </Box>

      {/* 뉴스 검색 섹션 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          핫이슈 뉴스 검색
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          키워드를 입력하거나 핫이슈를 클릭하면 관련 뉴스를 불러옵니다.
        </Typography>

        {/* 검색 입력 */}
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
            value={market}
            exclusive
            onChange={(_, v) => setMarket(v ?? '')}
            size="small"
          >
            <ToggleButton value="" sx={{ fontSize: '0.75rem', px: 1.5 }}>전체</ToggleButton>
            <ToggleButton value="US" sx={{ fontSize: '0.75rem', px: 1.5 }}>미국</ToggleButton>
            <ToggleButton value="KR" sx={{ fontSize: '0.75rem', px: 1.5 }}>한국</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 핫 키워드 */}
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

        {/* 결과 */}
        {!keyword && (
          <Typography variant="body2" color="text.disabled" textAlign="center" sx={{ py: 4 }}>
            키워드를 입력하거나 위 핫이슈를 클릭해보세요.
          </Typography>
        )}
        {keyword && isLoading && <LoadingSpinner message="뉴스를 불러오는 중..." />}
        {keyword && error && <Alert severity="error">뉴스를 불러올 수 없습니다.</Alert>}
        {keyword && !isLoading && news && news.length === 0 && (
          <Alert severity="info">"{keyword}" 관련 뉴스가 없습니다.</Alert>
        )}
        {keyword && !isLoading && news && news.length > 0 && (
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
