import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/DashboardPage';
import StockDetailPage from './pages/StockDetailPage';
import SearchPage from './pages/SearchPage';
import PortfolioPage from './pages/PortfolioPage';
import WatchlistPage from './pages/WatchlistPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'stock/:market/:ticker', element: <StockDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'watchlist', element: <WatchlistPage /> },
    ],
  },
]);
