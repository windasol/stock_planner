import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <TextField
      size="small"
      placeholder="종목명 또는 티커 검색..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      sx={{ width: 300, bgcolor: 'white', borderRadius: 1 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSearch} size="small">
              <Search />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
