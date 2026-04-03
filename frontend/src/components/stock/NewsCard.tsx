import { Box, Chip, Link, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { NewsItem } from '../../types/news';

interface Props {
  news: NewsItem;
}

function getSentimentColor(sentiment: string | null): 'success' | 'error' | 'default' {
  if (!sentiment) return 'default';
  const s = sentiment.toLowerCase();
  if (s.includes('positive') || s.includes('bullish')) return 'success';
  if (s.includes('negative') || s.includes('bearish')) return 'error';
  return 'default';
}

function getSentimentLabel(sentiment: string | null): string {
  if (!sentiment) return '중립';
  const s = sentiment.toLowerCase();
  if (s.includes('somewhat-bullish')) return '약 긍정';
  if (s.includes('bullish')) return '긍정';
  if (s.includes('somewhat-bearish')) return '약 부정';
  if (s.includes('bearish')) return '부정';
  if (s.includes('positive')) return '긍정';
  if (s.includes('negative')) return '부정';
  return '중립';
}

export default function NewsCard({ news }: Props) {
  return (
    <Box
      sx={{
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
        <Link
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          color="text.primary"
          sx={{ fontWeight: 600, fontSize: '0.95rem', flex: 1, lineHeight: 1.4 }}
        >
          {news.title}
          <OpenInNewIcon sx={{ fontSize: 12, ml: 0.5, verticalAlign: 'middle', color: 'text.secondary' }} />
        </Link>
        {news.sentiment && (
          <Chip
            label={getSentimentLabel(news.sentiment)}
            color={getSentimentColor(news.sentiment)}
            size="small"
            sx={{ flexShrink: 0, fontSize: '0.7rem', height: 20 }}
          />
        )}
      </Box>

      {news.summary && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 0.75,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {news.summary}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        {news.source && (
          <Typography variant="caption" color="text.disabled" fontWeight={500}>
            {news.source}
          </Typography>
        )}
        <Chip
          label={news.market === 'KR' ? '한국' : '미국'}
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.65rem', height: 18 }}
        />
        {news.publishedAt && (
          <Typography variant="caption" color="text.disabled">
            {news.publishedAt}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
