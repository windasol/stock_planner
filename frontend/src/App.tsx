import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './components/common/Navbar';

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navbar />
      <Outlet />
    </Box>
  );
}
