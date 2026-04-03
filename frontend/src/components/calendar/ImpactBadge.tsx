import { Chip } from '@mui/material';

interface ImpactBadgeProps {
  impact: string;
}

const IMPACT_CONFIG: Record<string, { label: string; color: 'error' | 'warning' | 'default' }> = {
  high:   { label: '고위험', color: 'error' },
  medium: { label: '중위험', color: 'warning' },
  low:    { label: '저위험', color: 'default' },
};

export function ImpactBadge({ impact }: ImpactBadgeProps) {
  const cfg = IMPACT_CONFIG[impact?.toLowerCase()] ?? { label: impact ?? '-', color: 'default' };
  return (
    <Chip
      label={cfg.label}
      color={cfg.color}
      size="small"
      sx={{ fontWeight: 600, minWidth: 60 }}
    />
  );
}
