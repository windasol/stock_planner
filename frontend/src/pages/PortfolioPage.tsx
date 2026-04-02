import { Container, Typography } from '@mui/material';

export default function PortfolioPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700}>
        포트폴리오
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        포트폴리오 기능 - Phase 4에서 구현 예정
      </Typography>
    </Container>
  );
}
