import { Container, Typography } from '@mui/material';

export default function WatchlistPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700}>
        관심종목
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        관심종목 기능 - Phase 5에서 구현 예정
      </Typography>
    </Container>
  );
}
