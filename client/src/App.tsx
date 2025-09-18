import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider as ThemeContextProvider, useTheme } from './contexts/ThemeContext';
import { lightTheme, darkTheme } from './theme';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import Layout from './components/Layout';
import { useMemo } from 'react';
import './i18n';

// Wrapper component to provide the MUI theme based on dark mode
const AppContent = () => {
  const { darkMode } = useTheme();
  
  // Memoize the theme to prevent unnecessary re-renders
  const theme = useMemo(() => {
    return darkMode ? darkTheme : lightTheme;
  }, [darkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Layout>
      </Router>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}

export default App;
