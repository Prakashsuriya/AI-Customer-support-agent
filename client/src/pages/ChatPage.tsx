import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  TextField, 
  Button, 
  Paper, 
  Avatar, 
  CircularProgress, 
  Container,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { 
  Send as SendIcon, 
  Logout as LogoutIcon, 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon,
  HelpOutline as HelpIcon,
  Person as PersonIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface Message {
  _id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

// Type guard to check if an object is a valid Message
const isMessage = (obj: any): obj is Message => {
  return (
    obj &&
    typeof obj._id === 'string' &&
    typeof obj.content === 'string' &&
    (obj.sender === 'user' || obj.sender === 'ai') &&
    typeof obj.timestamp === 'string'
  );
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { darkMode, toggleDarkMode } = useTheme();

  // Fetch chat history on component mount
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo?.token) {
        setUsername(userInfo.username || 'User');
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get<Message[] | { message: string }>(
          `${import.meta.env.VITE_API_URL}/api/chat/history`,
          config
        );
        
        if (Array.isArray(data)) {
          // Validate each message in the array
          const validMessages = data.filter(isMessage);
          if (validMessages.length !== data.length) {
            console.warn('Some messages were filtered out due to invalid format');
          }
          setMessages(validMessages);
        } else {
          console.error('Unexpected response format:', data);
          throw new Error(data?.message || 'Failed to load chat history');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to fetch chat history', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchHistory();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    handleScroll();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        timeout: 30000, // 30 second timeout
        validateStatus: (status: number) => status < 500, // Don't throw for 4xx errors
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/send`,
        { message: input },
        config
      );

      if (response.status === 429) {
        const retryTime = response.data?.retryAfter || 30;
        const rateLimitMessage = {
          _id: `rate-limit-${Date.now()}`,
          content: response.data?.message || `I'm getting too many requests. Please try again in ${retryTime} seconds.`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, rateLimitMessage]);
        return;
      }

      if (isMessage(response.data)) {
        setMessages(prev => [...prev, response.data]);
      } else {
        console.error('Invalid message format received:', response.data);
        throw new Error('Invalid message format received from server');
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);

      let errorContent = 'Failed to get response from the AI. Please try again.';
      if (error.code === 'ECONNABORTED') {
        errorContent = 'Request timed out. The server is taking too long to respond.';
      } else if (error.response?.status === 401) {
        errorContent = 'Session expired. Please log in again.';
        navigate('/login');
      } else if (error.response?.data?.message) {
        errorContent = error.response.data.message;
      }

      const errorMessage: Message = {
        _id: `error-${Date.now()}`,
        content: errorContent,
        sender: 'ai', // Explicitly setting as 'ai' to match the type
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message: Message) => (
    <motion.div
      key={message._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: 16,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 1,
          maxWidth: '80%',
          alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
        }}
      >
        <Avatar 
          sx={{
            bgcolor: message.sender === 'user' 
              ? muiTheme.palette.primary.main 
              : muiTheme.palette.secondary.main,
            width: 36,
            height: 36,
          }}
        >
          {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
        </Avatar>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: message.sender === 'user'
              ? muiTheme.palette.primary.main
              : muiTheme.palette.background.paper,
            color: message.sender === 'user' 
              ? muiTheme.palette.primary.contrastText 
              : muiTheme.palette.text.primary,
            borderTopLeftRadius: message.sender === 'user' ? 12 : 2,
            borderTopRightRadius: message.sender === 'user' ? 2 : 12,
            maxWidth: '100%',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          <Typography variant="body1">{message.content}</Typography>
          <Typography 
            variant="caption" 
            sx={{
              display: 'block',
              textAlign: 'right',
              mt: 0.5,
              opacity: 0.7,
              color: message.sender === 'user' 
                ? 'rgba(255, 255, 255, 0.7)' 
                : 'text.secondary',
            }}
          >
            {format(new Date(message.timestamp), 'h:mm a')}
          </Typography>
        </Paper>
      </Box>
    </motion.div>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: muiTheme.palette.background.default,
    }}>
      {/* App Bar */}
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <BotIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {t('app.name')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={darkMode ? t('actions.lightMode') : t('actions.darkMode')}>
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                size={isMobile ? 'small' : 'medium'}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title={t('actions.help')}>
              <IconButton 
                color="inherit"
                size={isMobile ? 'small' : 'medium'}
                onClick={() => window.open('https://help.example.com', '_blank')}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={t('actions.logout')}>
              <IconButton 
                color="inherit" 
                onClick={() => {
                  localStorage.removeItem('userInfo');
                  navigate('/login');
                }}
                size={isMobile ? 'small' : 'medium'}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Chat Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
            color: 'text.secondary',
            p: 2,
          }}>
            <BotIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              {t('chat.welcome', { username })}
            </Typography>
            <Typography variant="body1">
              {t('chat.getStarted')}
            </Typography>
          </Box>
        ) : (
          <Container maxWidth="md" sx={{ pb: 12 }}>
            <AnimatePresence>
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </AnimatePresence>
            {loading && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-start',
                mb: 2,
                ml: 6,
              }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: i * 0.15,
                      }}
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: muiTheme.palette.primary.main,
                        borderRadius: '50%',
                        display: 'inline-block',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Container>
        )}
      </Box>

      {/* Input Area */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          borderTop: `1px solid ${muiTheme.palette.divider}`,
          backgroundColor: muiTheme.palette.background.paper,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('chat.typeMessage')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              inputRef={inputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              multiline
              maxRows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  backgroundColor: muiTheme.palette.background.default,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!input.trim() || loading}
              sx={{
                minWidth: 56,
                height: 56,
                minHeight: 56,
                borderRadius: '50%',
                p: 0,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SendIcon />
              )}
            </Button>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: 'center', 
              mt: 1,
              color: 'text.secondary',
            }}
          >
            {t('chat.pressEnter')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ChatPage;
