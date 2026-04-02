import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, ToggleButton, ToggleButtonGroup, Box,
} from '@mui/material';

interface AddHoldingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { ticker: string; market: string; quantity: number; avgBuyPrice: number; boughtAt: string }) => void;
}

export default function AddHoldingModal({ open, onClose, onSubmit }: AddHoldingModalProps) {
  const [ticker, setTicker] = useState('');
  const [market, setMarket] = useState('US');
  const [quantity, setQuantity] = useState('');
  const [avgBuyPrice, setAvgBuyPrice] = useState('');
  const [boughtAt, setBoughtAt] = useState('');

  const handleSubmit = () => {
    if (!ticker || !quantity || !avgBuyPrice) return;
    onSubmit({
      ticker: ticker.toUpperCase(),
      market,
      quantity: parseFloat(quantity),
      avgBuyPrice: parseFloat(avgBuyPrice),
      boughtAt: boughtAt || new Date().toISOString().split('T')[0],
    });
    setTicker('');
    setQuantity('');
    setAvgBuyPrice('');
    setBoughtAt('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>종목 추가</DialogTitle>
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
          <TextField label="티커" value={ticker} onChange={(e) => setTicker(e.target.value)} fullWidth />
          <TextField label="수량" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} fullWidth />
          <TextField label="평균 매수가" type="number" value={avgBuyPrice} onChange={(e) => setAvgBuyPrice(e.target.value)} fullWidth />
          <TextField label="매수일" type="date" value={boughtAt} onChange={(e) => setBoughtAt(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!ticker || !quantity || !avgBuyPrice}>추가</Button>
      </DialogActions>
    </Dialog>
  );
}
