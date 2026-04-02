import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, ToggleButton, ToggleButtonGroup, Alert } from '@mui/material';
import SearchBar from '../components/common/SearchBar';
import StockSearchResults from '../components/stock/StockSearchResults';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useStockSearch } from '../hooks/useStock';
import { MARKETS } from '../utils/constants';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [market, setMarket] = useState('');

  const { data: results, isLoading, error } = useStockSearch(query, market || undefined);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
        <SearchBar />
        <ToggleButtonGroup
          value={market}
          exclusive
          onChange={(_, val) => val !== null && setMarket(val)}
          size="small"
        >
          {MARKETS.map((m) => (
            <ToggleButton key={m.value} value={m.value}>
              {m.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {query && (
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          "{query}" 검색 결과
        </Typography>
      )}

      {isLoading && <LoadingSpinner message="검색 중..." />}
      {error && <Alert severity="error">검색 중 오류가 발생했습니다.</Alert>}
      {results && results.length === 0 && <Alert severity="info">검색 결과가 없습니다.</Alert>}
      {results && results.length > 0 && <StockSearchResults results={results} />}
    </Container>
  );
}
