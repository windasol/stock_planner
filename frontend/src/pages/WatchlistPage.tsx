import { useState } from 'react';
import {
  Container, Box, Typography, Button, Paper, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, ToggleButton, ToggleButtonGroup, CircularProgress,
} from '@mui/material';
import { Add, Delete, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '../hooks/useWatchlist';
import { formatCurrency, formatPercent } from '../utils/formatters';

function AddWatchlistDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [ticker, setTicker] = useState('');
  const [market, setMarket] = useState<'US' | 'KR'>('US');
  const [note, setNote] = useState('');
  const addToWatchlist = useAddToWatchlist();

  const handleSubmit = async () => {
    if (!ticker.trim()) return;
    await addToWatchlist.mutateAsync({ ticker: ticker.toUpperCase().trim(), market, note: note.trim() || undefined });
    setTicker('');
    setNote('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
            autoFocus
            placeholder="예: AAPL, 005930"
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
        <Button onClick={onClose}>취소</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!ticker.trim() || addToWatchlist.isPending}
        >
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function WatchlistPage() {
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const { data: items, isLoading } = useWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>관심종목</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
          종목 추가
        </Button>
      </Box>

      {!items || items.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            관심종목이 없습니다
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            관심 있는 종목을 추가해 한눈에 확인하세요.
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
            첫 종목 추가
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>종목</TableCell>
                <TableCell align="right">현재가</TableCell>
                <TableCell align="right">등락률</TableCell>
                <TableCell>섹터</TableCell>
                <TableCell>메모</TableCell>
                <TableCell>추가일</TableCell>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box>
                          <Typography fontWeight={600}>{item.stock.ticker}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.stock.name}</Typography>
                        </Box>
                        <Chip label={item.stock.market} size="small" />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500}>
                        {formatCurrency(item.stock.price, item.stock.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        {isPositive
                          ? <TrendingUp fontSize="small" color="error" />
                          : <TrendingDown fontSize="small" color="primary" />}
                        <Typography
                          fontWeight={600}
                          sx={{ color: isPositive ? 'error.main' : 'primary.main' }}
                        >
                          {formatPercent(item.stock.changePercent)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.stock.sector || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.note || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {item.addedAt ? item.addedAt.split('T')[0] : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); removeFromWatchlist.mutate(item.id); }}
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

      <AddWatchlistDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </Container>
  );
}
