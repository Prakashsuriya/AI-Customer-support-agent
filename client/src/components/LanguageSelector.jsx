import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिंदी' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
    localStorage.setItem('i18nextLng', event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, mr: 2 }}>
      <FormControl fullWidth size="small" variant="outlined">
        <Select
          value={i18n.language}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select language' }}
          sx={{
            color: 'inherit',
            '& .MuiSelect-icon': {
              color: 'inherit',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
            },
          }}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
