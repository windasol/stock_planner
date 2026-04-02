import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Holding } from '../../types/portfolio';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface HoldingListProps {
  holdings: Holding[];
  onDelete?: (holdingId: number) => void;
}

export default function HoldingList({ holdings, onDelete }: HoldingListProps) {
  const navigate = useNavigate();

  if (holdings.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">보유 종목이 없습니다. 종목을 추가해 주세요.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>종목</TableCell>
            <TableCell align="right">수량</TableCell>
            <TableCell align="right">평균 매수가</TableCell>
            <TableCell align="right">평가액</TableCell>
            <TableCell align="right">수익률</TableCell>
            <TableCell align="right">매수일</TableCell>
            <TableCell align="center">삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {holdings.map((holding) => (
            <TableRow
              key={holding.id}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              onClick={() => navigate(`/stock/${holding.stock.market}/${holding.stock.ticker}`)}
            >
              <TableCell>
                <Typography fontWeight={600}>{holding.stock.ticker}</Typography>
                <Typography variant="caption" color="text.secondary">{holding.stock.name}</Typography>
                <Chip label={holding.stock.market} size="small" sx={{ ml: 1 }} />
              </TableCell>
              <TableCell align="right">{holding.quantity}</TableCell>
              <TableCell align="right">{formatCurrency(holding.avgBuyPrice, holding.stock.currency)}</TableCell>
              <TableCell align="right">{formatCurrency(holding.currentValue, holding.stock.currency)}</TableCell>
              <TableCell align="right">
                <Typography sx={{ color: holding.returnPercent >= 0 ? 'error.main' : 'primary.main', fontWeight: 600 }}>
                  {formatPercent(holding.returnPercent)}
                </Typography>
              </TableCell>
              <TableCell align="right">{holding.boughtAt || '-'}</TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(holding.id);
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
