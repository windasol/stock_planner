import { useState } from 'react';
import {
  Container, Typography, Box, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { Add, Delete, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '../hooks/useWatchlist';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function WatchlistPage() {
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [ticker, setTicker] = useState('');
  const [market, setMarket] = useState<'US' | 'KR'>('US');
  const [note, setNote] = useState('');

  const { data: items, isLoading, isError } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const handleAdd = () => {
    if (!ticker.trim()) return;
    addToWatchlist.mutate(
      { ticker: ticker.trim().toUpperCase(), market, note: note.trim() || undefined },
      {
        onSuccess: () => {
          setTicker('');
          setNote('');
          setAddOpen(false);
        },
      },
    );
  };

  const handleClose = () => {
    setTicker('');
    setNote('');
    setAddOpen(false);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">관심종목을 불러오는 데 실패했습니다.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>관심종목</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
          종목 추가
        </Button>
      </Box>

      {!items || items.length === 0 ? (
        <Alert severity="info">
          관심종목이 없습니다. 종목을 추가해 주세요.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>종목</TableCell>
                <TableCell align="right">현재가</TableCell>
                <TableCell align="right">등락률</TableCell>
                <TableCell>메모</TableCell>
                <TableCell align="right">추가일</TableCell>
                <TableCell align="center">삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const isPositive = item.stock.changePercent >= 0;
                return (
                  <TableRow
                    key={item.id}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    onClick={() => navigate(`/stock/${item.stock.market}/${item.stock.ticker}`)}
                  >
                    <TableCell>
                      <Typography fontWeight={600}>{item.stock.ticker}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.stock.name}</Typography>
                      <Chip label={item.stock.market} size="small" sx={{ ml: 1 }} />
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.stock.price, item.stock.currency)}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        {isPositive
                          ? <TrendingUp fontSize="small" sx={{ color: 'error.main' }} />
                          : <TrendingDown fontSize="small" sx={{ color: 'primary.main' }} />
                        }
                        <Typography
                          fontWeight={600}
                          sx={{ color: isPositive ? 'error.main' : 'primary.main' }}
                        >
                          {formatPercent(item.stock.changePercent)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{item.note || '-'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{item.addedAt}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist.mutate(item.id);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={addOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>관심종목 추가</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <ToggleButtonGroup
              value={market}
              exclusive
              onChange={(_, val) => val && setMarket(val)}
              size="small"
              fullWidth
            >
              <ToggleButton value="US">미국</ToggleButton>
              <ToggleButton value="KR">한국</ToggleButton>
            </ToggleButtonGroup>
            <TextField
              label="티커"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              fullWidth
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <TextField
              label="메모 (선택)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={!ticker.trim() || addToWatchlist.isPending}
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
