import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import { LockOutlined, EmailOutlined, ArrowForward } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  background: theme.palette.background.paper,
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    minHeight: '60vh',
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-7c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 0.1,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
}));

const StyledAvatar = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  width: 100,
  height: 100,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: '50%',
    border: `2px dashed ${theme.palette.primary.main}`,
    animation: 'spin 20s linear infinite',
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  },
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/chat');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || t('errors.unexpected'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Fade in={true} timeout={800}>
        <StyledPaper elevation={3}>
          <LeftPanel>
            <StyledAvatar>
              <LockOutlined style={{ fontSize: 50, color: theme.palette.common.white }} />
            </StyledAvatar>
            <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 700, position: 'relative', zIndex: 1 }}>
              {t('login.welcome')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, position: 'relative', zIndex: 1 }}>
              {t('login.subtitle')}
            </Typography>
            <Box sx={{ display: 'flex', mt: 2, position: 'relative', zIndex: 1 }}>
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    mx: 0.5,
                    animation: 'bounce 1.5s infinite',
                    animationDelay: `${i * 0.2}s`,
                    '@keyframes bounce': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-8px)' },
                    },
                  }}
                />
              ))}
            </Box>
          </LeftPanel>

          <RightPanel>
            <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
              {t('login.title')}
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>{t('errors.error')}</AlertTitle>
                {error}
              </Alert>
            )}

            <StyledForm onSubmit={handleSubmit} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('login.email')}
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <EmailOutlined 
                      sx={{ 
                        color: 'action.active', 
                        mr: 1, 
                        my: 0.5 
                      }} 
                    />
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('login.password')}
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <LockOutlined 
                      sx={{ 
                        color: 'action.active', 
                        mr: 1, 
                        my: 0.5 
                      }} 
                    />
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                endIcon={!loading && <ArrowForward />}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t('login.loggingIn')}
                  </Box>
                ) : (
                  t('login.submit')
                )}
              </SubmitButton>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('login.noAccount')}{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {t('login.signUp')}
                  </Link>
                </Typography>
              </Box>
            </StyledForm>
          </RightPanel>
        </StyledPaper>
      </Fade>
    </Container>
  );
};

export default LoginPage;
