import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Box, Alert, Tab, Tabs } from '@mui/material';
import StockInfo from '../components/stock/StockInfo';
import CandlestickChart from '../components/charts/CandlestickChart';
import VolumeChart from '../components/charts/VolumeChart';
import ChartControls from '../components/charts/ChartControls';
import StockNews from '../components/stock/StockNews';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useStock, useChartData } from '../hooks/useStock';
import { ChartInterval } from '../types/chart';
import dayjs from 'dayjs';

function getDateRange(interval: ChartInterval): { from: string; to: string } {
  const to = dayjs().format('YYYY-MM-DD');
  switch (interval) {
    case '1D': return { from: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), to };
    case '1W': return { from: dayjs().subtract(1, 'week').format('YYYY-MM-DD'), to };
    case '1M': return { from: dayjs().subtract(1, 'month').format('YYYY-MM-DD'), to };
    case '3M': return { from: dayjs().subtract(3, 'month').format('YYYY-MM-DD'), to };
    case '1Y': return { from: dayjs().subtract(1, 'year').format('YYYY-MM-DD'), to };
    case 'ALL': return { from: '2000-01-01', to };
    default: return { from: dayjs().subtract(3, 'month').format('YYYY-MM-DD'), to };
  }
}

export default function StockDetailPage() {
  const { market = 'US', ticker = '' } = useParams<{ market: string; ticker: string }>();
  const [interval, setInterval] = useState<ChartInterval>('3M');
  const [tab, setTab] = useState(0);

  const { from, to } = getDateRange(interval);
  const { data: stock, isLoading: stockLoading, error: stockError } = useStock(market, ticker);
  const { data: chartData, isLoading: chartLoading } = useChartData(market, ticker, '1d', from, to);

  if (stockLoading) return <LoadingSpinner message="종목 정보를 불러오는 중..." />;
  if (stockError) return <Container sx={{ py: 4 }}><Alert severity="error">종목 정보를 불러올 수 없습니다.</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {stock && <StockInfo stock={stock} />}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="차트" />
          <Tab label="뉴스" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <ChartControls selected={interval} onChange={setInterval} />
              </Box>
              {chartLoading ? (
                <LoadingSpinner message="차트 데이터 로딩 중..." />
              ) : chartData && chartData.length > 0 ? (
                <>
                  <CandlestickChart data={chartData} />
                  <VolumeChart data={chartData} />
                </>
              ) : (
                <Alert severity="info">차트 데이터가 없습니다.</Alert>
              )}
            </>
          )}

          {tab === 1 && (
            <StockNews ticker={ticker} market={market} stockName={stock?.name} />
          )}
        </Box>
      </Paper>
    </Container>
  );
}
