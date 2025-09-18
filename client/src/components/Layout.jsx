import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, useMediaQuery } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function Layout({ children }) {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useAppTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('appTitle')}
          </Typography>
          
          <LanguageSelector />
          
          <IconButton 
            sx={{ ml: 1 }} 
            onClick={toggleDarkMode} 
            color="inherit"
            aria-label={darkMode ? t('switchToLight') : t('switchToDark')}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: isMobile ? 1 : 3,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}>
        {children}
      </Box>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          px: 3, 
          mt: 'auto',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.04)'
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {t('footer')} © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}
