import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = '로딩 중...' }: LoadingSpinnerProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
      <CircularProgress size={48} />
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );
}
