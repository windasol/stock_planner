import { useSearchParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import SearchBar from '../components/common/SearchBar';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SearchBar />
      <Typography variant="h5" fontWeight={700} sx={{ mt: 3 }}>
        검색 결과: "{query}"
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        검색 기능 - Phase 3에서 구현 예정
      </Typography>
    </Container>
  );
}
