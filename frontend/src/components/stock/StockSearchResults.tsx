import { Grid } from '@mui/material';
import { StockSearchResult } from '../../types/stock';
import StockCard from './StockCard';

interface StockSearchResultsProps {
  results: StockSearchResult[];
}

export default function StockSearchResults({ results }: StockSearchResultsProps) {
  return (
    <Grid container spacing={2}>
      {results.map((stock) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${stock.market}-${stock.ticker}`}>
          <StockCard
            ticker={stock.ticker}
            name={stock.name}
            market={stock.market}
            exchange={stock.exchange}
            sector={stock.sector}
          />
        </Grid>
      ))}
    </Grid>
  );
}
