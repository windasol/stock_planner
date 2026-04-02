import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

export default function StockDetailPage() {
  const { market, ticker } = useParams<{ market: string; ticker: string }>();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700}>
        {ticker} ({market})
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        종목 상세 - Phase 3에서 구현 예정
      </Typography>
    </Container>
  );
}
