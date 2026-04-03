import { useState } from 'react';
import { Alert, Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import NewsCard from './NewsCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNews } from '../../hooks/useNews';

interface Props {
  ticker: string;
  market: string;
  stockName?: string;
}

export default function StockNews({ ticker, market, stockName }: Props) {
  const [selectedMarket, setSelectedMarket] = useState<string>(market);

  const keyword = market === 'KR' ? (stockName || ticker) : ticker;
  const { data: news, isLoading, error } = useNews(keyword, selectedMarket, 20);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          관련 뉴스
        </Typography>
        <ToggleButtonGroup
          value={selectedMarket}
          exclusive
          onChange={(_, v) => { if (v) setSelectedMarket(v); }}
          size="small"
        >
          <ToggleButton value="US" sx={{ fontSize: '0.75rem', px: 1.5 }}>미국</ToggleButton>
          <ToggleButton value="KR" sx={{ fontSize: '0.75rem', px: 1.5 }}>한국</ToggleButton>
        </ToggleButtonGroup>
      </Box>

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
