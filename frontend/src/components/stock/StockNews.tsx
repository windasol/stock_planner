import { useState, useEffect } from 'react';
import { Alert, Box, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NewsCard from './NewsCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNews } from '../../hooks/useNews';

interface Props {
  ticker: string;
  market: string;
  stockName?: string;
}

export default function StockNews({ ticker, market, stockName }: Props) {
  const defaultKeyword = market === 'KR' ? (stockName || ticker) : ticker;
  const [inputValue, setInputValue] = useState(defaultKeyword);
  const [searchKeyword, setSearchKeyword] = useState(defaultKeyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) setSearchKeyword(inputValue.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data: news, isLoading, error } = useNews(searchKeyword, market, 20);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        관련 뉴스
      </Typography>

      <TextField
        fullWidth
        size="small"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="뉴스 키워드 검색"
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      {isLoading && <LoadingSpinner message="뉴스를 불러오는 중..." />}
      {error && <Alert severity="error">뉴스를 불러올 수 없습니다.</Alert>}

      {!isLoading && !error && news && news.length === 0 && (
        <Alert severity="info">관련 뉴스가 없습니다.</Alert>
      )}

      {!isLoading && news && news.length > 0 && (
        <Box>
          {news.map((item, idx) => (
            <NewsCard key={`${item.url}-${idx}`} news={item} />
          ))}
        </Box>
      )}
    </Box>
  );
}
