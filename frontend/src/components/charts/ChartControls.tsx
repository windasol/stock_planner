import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { CHART_INTERVALS } from '../../utils/constants';
import type { ChartInterval } from '../../types/chart';

interface ChartControlsProps {
  selected: ChartInterval;
  onChange: (interval: ChartInterval) => void;
}

export default function ChartControls({ selected, onChange }: ChartControlsProps) {
  return (
    <ToggleButtonGroup
      value={selected}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      size="small"
      sx={{ mb: 1 }}
    >
      {CHART_INTERVALS.map((item) => (
        <ToggleButton key={item.value} value={item.value} sx={{ px: 2 }}>
          {item.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
