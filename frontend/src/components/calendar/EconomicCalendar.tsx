import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Skeleton, Alert, Tooltip,
} from '@mui/material';
import { useEconomicCalendar } from '../../hooks/useCalendar';
import { ImpactBadge } from './ImpactBadge';
import type { EconomicEvent } from '../../types/calendar';

interface Props {
  from?: string;
  to?: string;
}

// 날짜별로 이벤트 그룹핑
function groupByDate(events: EconomicEvent[]) {
  const map = new Map<string, EconomicEvent[]>();
  for (const ev of events) {
    const list = map.get(ev.date) ?? [];
    list.push(ev);
    map.set(ev.date, list);
  }
  return map;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

function CountryFlag({ country }: { country: string }) {
  const flags: Record<string, string> = {
    US: '🇺🇸', KR: '🇰🇷', EU: '🇪🇺', JP: '🇯🇵',
    CN: '🇨🇳', GB: '🇬🇧', DE: '🇩🇪', CA: '🇨🇦',
  };
  return <span>{flags[country] ?? '🌐'} {country}</span>;
}

function ValueCell({ value, unit }: { value: number | null; unit: string }) {
  if (value === null || value === undefined) return <Typography color="text.secondary">-</Typography>;
  return <Typography>{value}{unit}</Typography>;
}

export function EconomicCalendar({ from, to }: Props) {
  const { data, isLoading, isError } = useEconomicCalendar(from, to);

  if (isLoading) {
    return (
      <Box>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">경제 캘린더 데이터를 불러오지 못했습니다.</Alert>;
  }

  if (!data || data.length === 0) {
    return (
      <Alert severity="info">
        해당 기간에 경제 이벤트가 없거나, Finnhub API 키가 설정되지 않았습니다.
      </Alert>
    );
  }

  const grouped = groupByDate(data);

  return (
    <Box>
      {[...grouped.entries()].map(([date, events]) => (
        <Box key={date} sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ mb: 1, color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}
          >
            {formatDate(date)}
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'action.hover' } }}>
                  <TableCell>시각(UTC)</TableCell>
                  <TableCell>국가</TableCell>
                  <TableCell>이벤트</TableCell>
                  <TableCell>중요도</TableCell>
                  <TableCell align="right">실제</TableCell>
                  <TableCell align="right">예상</TableCell>
                  <TableCell align="right">이전</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((ev, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    sx={{
                      borderLeft: 4,
                      borderLeftColor:
                        ev.impact === 'high'   ? 'error.main' :
                        ev.impact === 'medium' ? 'warning.main' : 'divider',
                    }}
                  >
                    <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                      {ev.time || '-'}
                    </TableCell>
                    <TableCell>
                      <CountryFlag country={ev.country} />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={ev.event} placement="top">
                        <Typography
                          variant="body2"
                          sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {ev.event}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <ImpactBadge impact={ev.impact} />
                    </TableCell>
                    <TableCell align="right">
                      <ValueCell value={ev.actual} unit={ev.unit} />
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary' }}>
                      <ValueCell value={ev.estimate} unit={ev.unit} />
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary' }}>
                      <ValueCell value={ev.previous} unit={ev.unit} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
}
