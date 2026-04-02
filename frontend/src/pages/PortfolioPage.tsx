import { useState } from 'react';
import {
  Container, Typography, Box, Button, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Alert, IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import HoldingList from '../components/portfolio/HoldingList';
import PortfolioChart from '../components/portfolio/PortfolioChart';
import AddHoldingModal from '../components/portfolio/AddHoldingModal';
import {
  usePortfolios, usePortfolio, useCreatePortfolio,
  useAddHolding, useDeleteHolding, useDeletePortfolio,
} from '../hooks/usePortfolio';

export default function PortfolioPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [addHoldingOpen, setAddHoldingOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  const { data: portfolios, isLoading, isError } = usePortfolios();
  const selectedId = portfolios?.[selectedIndex]?.id ?? 0;
  const { data: portfolio } = usePortfolio(selectedId);

  const createPortfolio = useCreatePortfolio();
  const addHolding = useAddHolding(selectedId);
  const deleteHolding = useDeleteHolding(selectedId);
  const deletePortfolio = useDeletePortfolio();

  const handleCreatePortfolio = () => {
    if (!newPortfolioName.trim()) return;
    createPortfolio.mutate({ name: newPortfolioName.trim() }, {
      onSuccess: () => {
        setNewPortfolioName('');
        setCreateOpen(false);
      },
    });
  };

  const handleDeletePortfolio = () => {
    if (!selectedId) return;
    if (!confirm(`"${portfolio?.name}" 포트폴리오를 삭제하시겠습니까?`)) return;
    deletePortfolio.mutate(selectedId, {
      onSuccess: () => setSelectedIndex(0),
    });
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
        <Alert severity="error">포트폴리오를 불러오는 데 실패했습니다.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>포트폴리오</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}>
          포트폴리오 생성
        </Button>
      </Box>

      {!portfolios || portfolios.length === 0 ? (
        <Alert severity="info">
          포트폴리오가 없습니다. 새 포트폴리오를 생성해 주세요.
        </Alert>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={selectedIndex}
              onChange={(_, v) => setSelectedIndex(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ flex: 1 }}
            >
              {portfolios.map((p) => (
                <Tab key={p.id} label={p.name} />
              ))}
            </Tabs>
            <IconButton
              onClick={handleDeletePortfolio}
              color="error"
              size="small"
              sx={{ ml: 1 }}
              title="포트폴리오 삭제"
            >
              <Delete />
            </IconButton>
          </Box>

          {portfolio ? (
            <>
              <PortfolioSummary portfolio={portfolio} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="outlined" startIcon={<Add />} onClick={() => setAddHoldingOpen(true)}>
                  종목 추가
                </Button>
              </Box>

              <HoldingList
                holdings={portfolio.holdings}
                onDelete={(holdingId) => deleteHolding.mutate(holdingId)}
              />

              <PortfolioChart holdings={portfolio.holdings} />
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </>
      )}

      {/* 포트폴리오 생성 다이얼로그 */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>새 포트폴리오 생성</DialogTitle>
        <DialogContent>
          <TextField
            label="포트폴리오 이름"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && handleCreatePortfolio()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>취소</Button>
          <Button
            onClick={handleCreatePortfolio}
            variant="contained"
            disabled={!newPortfolioName.trim() || createPortfolio.isPending}
          >
            생성
          </Button>
        </DialogActions>
      </Dialog>

      {/* 종목 추가 모달 */}
      <AddHoldingModal
        open={addHoldingOpen}
        onClose={() => setAddHoldingOpen(false)}
        onSubmit={(data) => addHolding.mutate(data)}
      />
    </Container>
  );
}
