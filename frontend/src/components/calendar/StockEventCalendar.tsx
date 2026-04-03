import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Chip, Divider,
  List, ListItem, ListItemText, Skeleton, Alert, Paper,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import { useStockEvents } from '../../hooks/useCalendar';
import type { StockEvent } from '../../types/calendar';

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  EARNINGS: { label: '실적 발표', icon: <BarChartIcon fontSize="small" />, color: '#1976d2' },
  DIVIDEND: { label: '배당',     icon: <AttachMoneyIcon fontSize="small" />, color: '#2e7d32' },
  SPLIT:    { label: '주식분할', icon: <CallSplitIcon fontSize="small" />,  color: '#ed6c02' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

function EarningsDetail({ ev }: { ev: StockEvent }) {
  return (
    <Box sx={{ mt: 0.5 }}>
      {ev.epsEstimate !== null && (
        <Typography variant="caption" color="text.secondary">
          EPS 예상 {ev.epsEstimate?.toFixed(2)}
          {ev.epsActual !== null ? ` → 실제 ${ev.epsActual?.toFixed(2)}` : ''}
        </Typography>
      )}
      {ev.revenueEstimate !== null && (
        <Typography variant="caption" color="text.secondary" display="block">
          매출 예상 ${((ev.revenueEstimate ?? 0) / 1e9).toFixed(1)}B
          {ev.revenueActual !== null ? ` → 실제 $${((ev.revenueActual ?? 0) / 1e9).toFixed(1)}B` : ''}
        </Typography>
      )}
    </Box>
  );
}

function DividendDetail({ ev }: { ev: StockEvent }) {
  return (
    <Box sx={{ mt: 0.5 }}>
      <Typography variant="caption" color="text.secondary">
        배당금 {ev.dividendAmount?.toFixed(4)} {ev.currency}
        {ev.payDate ? ` · 지급일 ${ev.payDate}` : ''}
        {ev.recordDate ? ` · 기록일 ${ev.recordDate}` : ''}
      </Typography>
    </Box>
  );
}

interface EventListProps {
  symbol: string;
}

function EventList({ symbol }: EventListProps) {
  const { data, isLoading, isError } = useStockEvents(symbol);

  if (isLoading) {
    return (
      <Box sx={{ mt: 2 }}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error" sx={{ mt: 2 }}>이벤트 데이터를 불러오지 못했습니다.</Alert>;
  }

  if (!data || data.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        해당 종목의 예정된 이벤트가 없습니다. (US 종목만 지원됩니다)
      </Alert>
    );
  }

  return (
    <List sx={{ mt: 1 }} disablePadding>
      {data.map((ev, idx) => {
        const cfg = TYPE_CONFIG[ev.type] ?? { label: ev.type, icon: null, color: '#555' };
        return (
          <Box key={idx}>
            <ListItem
              alignItems="flex-start"
              sx={{
                pl: 0,
                borderLeft: 4,
                borderLeftColor: cfg.color,
                pl: 1.5,
                mb: 0.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {formatDate(ev.date)}
                    </Typography>
                    <Chip
                      icon={cfg.icon as React.ReactElement}
                      label={cfg.label}
                      size="small"
                      sx={{ bgcolor: cfg.color, color: '#fff', fontWeight: 600 }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {ev.description}
                    </Typography>
                    {ev.type === 'EARNINGS' && <EarningsDetail ev={ev} />}
                    {ev.type === 'DIVIDEND' && <DividendDetail ev={ev} />}
                  </>
                }
              />
            </ListItem>
            {idx < data.length - 1 && <Divider />}
          </Box>
        );
      })}
    </List>
  );
}

export function StockEventCalendar() {
  const [input, setInput] = useState('');
  const [symbol, setSymbol] = useState('');

  const handleSearch = () => {
    const trimmed = input.trim().toUpperCase();
    if (trimmed) setSymbol(trimmed);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="종목 코드 입력 (예: AAPL, TSLA)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" onClick={handleSearch} disabled={!input.trim()}>
          조회
        </Button>
      </Box>

      {symbol && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            {symbol} — 이벤트 캘린더
          </Typography>
          <Typography variant="caption" color="text.secondary">
            오늘 기준 과거 30일 ~ 향후 90일 이벤트 · US 종목만 지원
          </Typography>
          <EventList symbol={symbol} />
        </Paper>
      )}

      {!symbol && (
        <Alert severity="info">
          종목 코드를 입력하면 실적 발표, 배당, 주식분할 일정을 확인할 수 있습니다.
        </Alert>
      )}
    </Box>
  );
}
