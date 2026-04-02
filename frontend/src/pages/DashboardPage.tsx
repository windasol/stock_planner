import { Box, Typography, Container } from '@mui/material';
import SearchBar from '../components/common/SearchBar';

export default function DashboardPage() {
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
      <Typography variant="h6" color="text.secondary" textAlign="center">
        시장 개요 - Phase 5에서 구현 예정
      </Typography>
    </Container>
  );
}
