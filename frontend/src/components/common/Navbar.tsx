import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { ShowChart, AccountBalance, Star, Dashboard, CalendarMonth } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: '대시보드', path: '/', icon: <Dashboard /> },
  { label: '포트폴리오', path: '/portfolio', icon: <AccountBalance /> },
  { label: '관심종목', path: '/watchlist', icon: <Star /> },
  { label: '캘린더', path: '/calendar', icon: <CalendarMonth /> },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1a1a2e' }}>
      <Toolbar>
        <ShowChart sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', fontWeight: 700, mr: 4 }}
          onClick={() => navigate('/')}
        >
          Stock Planner
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                fontWeight: location.pathname === item.path ? 700 : 400,
                borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                borderRadius: 0,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
