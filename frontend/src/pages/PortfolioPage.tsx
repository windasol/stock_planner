import { useState } from 'react';
import {
  Container, Box, Typography, Button, List, ListItemButton, ListItemText,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Divider, IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import {
  usePortfolios, usePortfolio, useCreatePortfolio,
  useDeletePortfolio, useAddHolding, useDeleteHolding,
} from '../hooks/usePortfolio';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import PortfolioChart from '../components/portfolio/PortfolioChart';
import HoldingList from '../components/portfolio/HoldingList';
import AddHoldingModal from '../components/portfolio/AddHoldingModal';

function CreatePortfolioDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const createPortfolio = useCreatePortfolio();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await createPortfolio.mutateAsync({ name: name.trim() });
    setName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>새 포트폴리오 만들기</DialogTitle>
      <DialogContent>
        <TextField
          label="포트폴리오 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          autoFocus
          sx={{ mt: 1 }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim() || createPortfolio.isPending}
        >
          만들기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function PortfolioDetail({ portfolioId }: { portfolioId: number }) {
  const [addHoldingOpen, setAddHoldingOpen] = useState(false);
  const { data: portfolio, isLoading } = usePortfolio(portfolioId);
  const addHolding = useAddHolding(portfolioId);
  const deleteHolding = useDeleteHolding(portfolioId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!portfolio) return null;

  return (
    <Box>
      <PortfolioSummary portfolio={portfolio} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddHoldingOpen(true)}
        >
          종목 추가
        </Button>
      </Box>
      <HoldingList
        holdings={portfolio.holdings}
        onDelete={(holdingId) => deleteHolding.mutate(holdingId)}
      />
      <PortfolioChart holdings={portfolio.holdings} />
      <AddHoldingModal
        open={addHoldingOpen}
        onClose={() => setAddHoldingOpen(false)}
        onSubmit={(data) => addHolding.mutate(data)}
      />
    </Box>
  );
}

export default function PortfolioPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { data: portfolios, isLoading } = usePortfolios();
  const deletePortfolio = useDeletePortfolio();

  const handleDeletePortfolio = (id: number) => {
    deletePortfolio.mutate(id);
    if (selectedId === id) setSelectedId(null);
  };

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
        <Typography variant="h5" fontWeight={700}>포트폴리오</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}>
          새 포트폴리오
        </Button>
      </Box>

      {!portfolios || portfolios.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            포트폴리오가 없습니다
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            새 포트폴리오를 만들어 투자 현황을 관리하세요.
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}>
            첫 포트폴리오 만들기
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Paper sx={{ width: 220, flexShrink: 0 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ px: 2, pt: 2, pb: 1 }}>
              내 포트폴리오
            </Typography>
            <Divider />
            <List dense disablePadding>
              {portfolios.map((p) => (
                <ListItemButton
                  key={p.id}
                  selected={selectedId === p.id}
                  onClick={() => setSelectedId(p.id)}
                  sx={{ pr: 1 }}
                >
                  <ListItemText
                    primary={p.name}
                    secondary={`${p.holdings.length}종목`}
                    primaryTypographyProps={{ noWrap: true, fontSize: 14, fontWeight: selectedId === p.id ? 700 : 400 }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleDeletePortfolio(p.id); }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {selectedId ? (
              <PortfolioDetail portfolioId={selectedId} />
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  왼쪽에서 포트폴리오를 선택하세요.
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      )}

      <CreatePortfolioDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Container>
  );
}
