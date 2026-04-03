import { useState } from 'react';
import {
  Box, Container, Typography, Tabs, Tab,
  FormControl, Select, MenuItem, InputLabel,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { EconomicCalendar } from '../components/calendar/EconomicCalendar';
import { StockEventCalendar } from '../components/calendar/StockEventCalendar';

type DateRange = 'thisWeek' | 'thisMonth' | 'nextMonth';

function getDateRange(range: DateRange): { from: string; to: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (range === 'thisWeek') {
    const day = now.getDay(); // 0=일
    const mon = new Date(now);
    mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { from: fmt(mon), to: fmt(sun) };
  }
  if (range === 'thisMonth') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to   = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: fmt(from), to: fmt(to) };
  }
  // nextMonth
  const from = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const to   = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  return { from: fmt(from), to: fmt(to) };
}

const RANGE_LABELS: Record<DateRange, string> = {
  thisWeek:  '이번 주',
  thisMonth: '이번 달',
  nextMonth: '다음 달',
};

export default function CalendarPage() {
  const [tab, setTab] = useState(0);
  const [range, setRange] = useState<DateRange>('thisMonth');

  const { from, to } = getDateRange(range);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <CalendarMonthIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" fontWeight={700}>
          경제 캘린더
        </Typography>
      </Box>

      {/* 탭 */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="글로벌 매크로" />
        <Tab label="종목별 이벤트" />
      </Tabs>

      {/* 글로벌 매크로 탭 */}
      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>기간</InputLabel>
              <Select
                value={range}
                label="기간"
                onChange={e => setRange(e.target.value as DateRange)}
              >
                {(Object.keys(RANGE_LABELS) as DateRange[]).map(key => (
                  <MenuItem key={key} value={key}>{RANGE_LABELS[key]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            {from} ~ {to} · 중요도 순 정렬 · UTC 기준
          </Typography>
          <EconomicCalendar from={from} to={to} />
        </Box>
      )}

      {/* 종목별 이벤트 탭 */}
      {tab === 1 && <StockEventCalendar />}
    </Container>
  );
}
