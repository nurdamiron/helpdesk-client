// src/components/chat/ChatWindow.jsx - Анимациялары бар жақсартылған дизайн
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Alert,
  Badge,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Zoom,
  Avatar,
  Tooltip,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  SentimentSatisfiedAlt as EmojiIcon,
  ErrorOutline as ErrorIcon,
  CheckCircleOutline as CheckCircleIcon,
  SignalWifiStatusbarConnectedNoInternet4 as OfflineIcon,
  SignalWifi4Bar as OnlineIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';
import wsService from '../../services/WebSocketService';
import MessageItem from './MessageItem';
import { ticketsApi } from '../../api/tickets';
import { messagesApi } from '../../api/message';

/**
 * Өтініш бойынша хабарламалармен алмасу үшін жақсартылған UI бар чат терезесі компоненті
 * @param {Object} props - Компонент қасиеттері
 * @param {string|number} props.ticketId - Өтініш ID
 * @param {string} props.userEmail - Пайдаланушы email
 * @returns {JSX.Element} Чат терезесі компоненті
 */
const ChatWindow = ({ ticketId, userEmail, ticket }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Пайдаланушы түрін анықтау - әдепкі бойынша бұл requester (клиент)
  // Нақты қосымшада бұл аутентификация күйінен алынуы керек
  const [userType] = useState('requester');
  
  // Пайдаланушы идентификаторы - нақты қосымшада аутентификация күйінен алынуы керек
  const userId = localStorage.getItem('userId') || '1'; 

  // Монтаж кезінде WebSocket инициализациясы
  useEffect(() => {
    try {
      console.log('Өтініш үшін WebSocket байланысы инициализацияланады:', ticketId);
      wsService.init(userId, userType);
      
      // Байланыс күйіне жазылу
      const unsubscribeConnection = wsService.subscribeToConnectionStatus((connected) => {
        console.log('WebSocket байланыс күйі өзгерді:', connected);
        setWsConnected(connected);
        
        // Егер қайта қосылса, жіберілген хабарларды тексеру
        if (connected && messages.length > 0) {
          fetchLatestMessages();
        }
      });
      
      // Жаңа хабарламаларға жазылу
      const unsubscribeMessages = wsService.subscribeToMessages(ticketId, (newMessage) => {
        console.log('Жаңа хабарлама алынды:', newMessage);
        setMessages(prev => {
          // Қайталануларды болдырмау
          if (!prev.some(msg => msg.id === newMessage.id)) {
            return [...prev, newMessage];
          }
          return prev;
        });
        
        // Егер хабарлама бізден емес болса, оқылған күйін жіберу
        if (newMessage.sender.type !== userType || newMessage.sender.id !== userId) {
          wsService.sendMessageStatus(newMessage.id, 'read');
        }
      });
      
      // Күй жаңартуларына жазылу
      const unsubscribeStatuses = wsService.subscribeToStatusUpdates(ticketId, (messageId, status) => {
        console.log(`Хабарлама ${messageId} күйі жаңартылды: ${status}`);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        ));
      });
      
      // Теру индикаторларына жазылу
      const unsubscribeTyping = wsService.subscribeToTypingIndicators(ticketId, (userId, isTyping) => {
        console.log(`Пайдаланушы ${userId} теру күйі: ${isTyping}`);
        setIsTyping(isTyping);
        setTypingUserId(isTyping ? userId : null);
      });
      
      // Демонтаж кезінде тазалау
      return () => {
        try {
          unsubscribeConnection();
          unsubscribeMessages();
          unsubscribeStatuses();
          unsubscribeTyping();
          wsService.disconnect();
        } catch (err) {
          console.error('WebSocket отключения ошибка:', err);
        }
      };
    } catch (err) {
      console.error('WebSocket инициализация ошибка:', err);
      setError('Хабарламалар сервисіне қосылу мүмкін болмады');
    }
  }, [ticketId, userId, userType, messages.length]);

  // Монтаж кезінде және ticketId өзгерген кезде хабарламалар тарихын жүктеу
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ticketsApi.getTicketMessages(ticketId).catch(error => {
          console.log('Хабарламаларды алу кезінде қате, балама әдісіне өту');
          return { messages: [] };
        });
        
        if (response && response.messages) {
          setMessages(response.messages);
          // Хабарламаларды оқылған деп белгілеу
          try {
            await ticketsApi.markMessagesAsRead(ticketId);
          } catch (markError) {
            console.error('Хабарламаларды оқылған деп белгілеу кезінде қате:', markError);
          }
        } else if (response && response.status === 'success' && response.data) {
          // Балама жауап форматы
          setMessages(response.data);
        }
      } catch (err) {
        console.error('Хабарламаларды жүктеу кезінде қате:', err);
        setError('Хабарламаларды жүктеу мүмкін болмады. Кейінірек қайталап көріңіз.');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchMessages();
    }
  }, [ticketId]);

  // Хабарламалар тізімі өзгерген кезде соңғы хабарламаға жылжыту
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Хабарламаның ағымдағы пайдаланушыдан келгенін анықтау
   * @param {Object} message - Тексерілетін хабарлама
   * @returns {boolean} - Хабарлама ағымдағы пайдаланушыдан болса true
   */
  const isUserMessage = (message) => {
    // Әртүрлі мүмкін жіберуші қасиеттерін тексеру
    return (
      (message.sender?.type === userType) ||
      (message.sender_type === userType) ||
      (message.sender?.id === userId) ||
      (message.sender_id === userId)
    );
  };

  /**
   * Ең соңғы хабарламаларды жүктеу, ең өзекті деректерді қамтамасыз ету үшін
   */
  const fetchLatestMessages = async () => {
    try {
      const response = await ticketsApi.getTicketMessages(ticketId).catch(error => {
        console.log('Соңғы хабарламаларды алу кезінде қате');
        return { messages: [] };
      });
      
      if (response && response.messages && response.messages.length > messages.length) {
        setMessages(response.messages);
      }
    } catch (err) {
      console.error('Соңғы хабарламаларды жүктеу кезінде қате:', err);
    }
  };

  /**
   * Сервермен байланысты қайта орнату
   */
  const handleReconnect = () => {
    wsService.reconnect();
  };

  /**
   * Чаттың соңына жылжыту
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Хабарлама өзгерген кезде өңдеуші
   */
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    
    // Теру күйін жіберу
    if (e.target.value && !typingTimeoutRef.current) {
      wsService.sendTypingIndicator(ticketId, true);
      
      // Теру индикаторын 2 секундтан кейін тазалау
      typingTimeoutRef.current = setTimeout(() => {
        wsService.sendTypingIndicator(ticketId, false);
        typingTimeoutRef.current = null;
      }, 2000);
    } else if (!e.target.value && typingTimeoutRef.current) {
      // Егер өріс бос болса және таймер болса, таймерді тазалап, теру күйін жіберу
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      wsService.sendTypingIndicator(ticketId, false);
    }
  };

  /**
   * Файл тіркеу түймесі басылған кезде
   */
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Файл таңдаған кезде өңдеуші
   */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Үлкен файлдарды тексеру (10MB шектеуі)
    const validFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024);
    
    if (validFiles.length !== selectedFiles.length) {
      setError('10MB-дан үлкен файлдар жүктелмеді.');
      setTimeout(() => setError(null), 3000);
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    e.target.value = null; // Сол файлды қайта таңдау мүмкіндігі үшін
  };

  /**
   * Таңдалған файлды жою
   */
  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  /**
   * Хабарлама жіберу
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && files.length === 0) return;
    
    try {
      setSending(true);
      
      // Жіберілетін хабарламаны алдын-ала көрсету
      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        id: tempId,
        content: message.trim(),
        created_at: new Date().toISOString(),
        sender: { type: userType, id: userId },
        attachments: files.map(file => ({
          file_name: file.name,
          mime_type: file.type,
          size: file.size,
          _file: file, // Клиенттік жағында ғана пайдаланылады
          _url: URL.createObjectURL(file) // Алдын-ала көрсету үшін
        })),
        status: 'sending'
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // Тіркемелер (егер болса)
      const attachmentIds = [];
      if (files.length > 0) {
        for (const file of files) {
          try {
            const response = await ticketsApi.uploadAttachment(ticketId, file);
            if (response && response.id) {
              attachmentIds.push(response.id);
            }
          } catch (err) {
            console.error('Тіркемені жүктеу кезінде қате:', err);
          }
        }
      }
      
      // Хабарламаны жіберу
      const response = await messagesApi.sendMessage(ticketId, {
        content: message.trim(),
        attachment_ids: attachmentIds.length > 0 ? attachmentIds : undefined
      });
      
      // Уақытша хабарламаны нақты хабарламамен ауыстыру
      if (response && response.status === 'success') {
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...response.message, status: 'sent' } : msg
        ));
      }
      
      // Жіберілген соң өрісті тазалау
      setMessage('');
      setFiles([]);
      
    } catch (err) {
      console.error('Хабарлама жіберу кезінде қате:', err);
      setError('Хабарламаны жіберу мүмкін болмады. Кейінірек қайталап көріңіз.');
      
      // Хабарламаны қате күйіне жаңарту
      setMessages(prev => prev.map(msg => 
        msg.status === 'sending' ? { ...msg, status: 'error' } : msg
      ));
      
    } finally {
      setSending(false);
    }
  };

  /**
   * Файл түріне сәйкес иконканы алу
   */
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon />;
    } else if (file.type === 'application/pdf') {
      return <PdfIcon />;
    } else {
      return <FileIcon />;
    }
  };

  /**
   * Тіркелген файлдардың алдын-ала көрінісі
   */
  const renderFilePreview = () => {
    if (files.length === 0) return null;
    
    return (
      <Box sx={{ mt: 1, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Таңдалған файлдар: {files.length}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {files.map((file, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
              }}
            >
              {getFileIcon(file)}
              <Typography variant="body2" sx={{ ml: 1, maxWidth: 150 }} noWrap>
                {file.name}
              </Typography>
              
              <IconButton
                size="small"
                onClick={() => removeFile(index)}
                sx={{
                  p: 0.5,
                  ml: 0.5,
                  '&:hover': { color: 'error.main' }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  // Байланыс күйін көрсету (онлайн/офлайн)
  const renderConnectionStatus = () => {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 1,
          bgcolor: wsConnected ? 'success.light' : 'warning.light',
          color: wsConnected ? 'success.contrastText' : 'warning.contrastText',
          borderRadius: 1,
          mb: 2,
          opacity: 0.9,
          transition: 'all 0.3s ease'
        }}
      >
        {wsConnected ? (
          <>
            <OnlineIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Чат онлайн - хабарлар дереу жеткізіледі
            </Typography>
          </>
        ) : (
          <>
            <OfflineIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Офлайн режим - байланыс қалпына келгенде хабарлар жіберіледі
            </Typography>
            <Button 
              size="small" 
              onClick={handleReconnect} 
              sx={{ ml: 1, minWidth: 'auto', color: 'inherit' }}
            >
              <RefreshIcon fontSize="small" />
            </Button>
          </>
        )}
      </Box>
    );
  };

  // Егер жүктеу күйінде болса
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 3
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">Хабарламалар жүктелуде...</Typography>
      </Box>
    );
  }

  // Егер қате болса
  if (error && messages.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 3
        }}
      >
        <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="body1" color="error">{error}</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Қайта жүктеу
        </Button>
      </Box>
    );
  }

  // Если заявка закрыта, показываем специальное сообщение
  const isTicketClosed = ticket => {
    return ticket && ticket.status === 'closed';
  };

  // Компонент для отображения закрытой заявки
  const renderClosedTicketMessage = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 3,
          textAlign: 'center'
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
          Өтініш жабылды
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Бұл өтініш бойынша талқылау жабылды. Жаңа сұрақтар туындаса, жаңа өтініш жасаңыз.
        </Typography>
      </Box>
    );
  };

  // Теру индикаторын көрсету
  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 1,
          ml: 2, 
          mb: 1,
          maxWidth: 'fit-content',
          borderRadius: 1,
          bgcolor: 'background.paper',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Біреу хабарлама теруде
        </Typography>
        <Box
          sx={{
            display: 'flex',
            ml: 1,
            alignItems: 'center'
          }}
        >
          {[0, 1, 2].map((dot) => (
            <Box
              key={dot}
              sx={{
                width: 4,
                height: 4,
                mx: 0.2,
                borderRadius: '50%',
                bgcolor: 'text.secondary',
                animation: 'typing-dot 1.4s infinite ease-in-out both',
                animationDelay: `${dot * 0.2}s`,
                '@keyframes typing-dot': {
                  '0%, 80%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                  '40%': { opacity: 1, transform: 'scale(1)' }
                }
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  // Если заявка закрыта, показываем соответствующее сообщение
  if (ticket && ticket.status === 'closed') {
    return renderClosedTicketMessage();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Хабарламалар саны мен күйін көрсететін жоғарғы бар */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default'
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {messages.length === 0 
            ? 'Хабарлама жоқ. Жаңа хабарлама жіберіңіз.'
            : `${messages.length} хабарлама`
          }
        </Typography>
        
        {wsConnected ? (
          <Chip 
            size="small" 
            color="success" 
            label="Онлайн" 
            sx={{ height: 24 }}
          />
        ) : (
          <Chip 
            size="small" 
            color="warning" 
            label="Офлайн" 
            sx={{ height: 24 }}
          />
        )}
      </Box>
      
      {/* Қате хабарламасы, егер қате пайда болса */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ m: 2, borderRadius: 1 }}
        >
          {error}
        </Alert>
      )}
      
      {/* Хабарламалар контейнері */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.mode === 'dark' 
            ? 'background.default' 
            : 'rgba(240, 242, 245, 0.5)'
        }}
      >
        {renderConnectionStatus()}
        
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              color: 'text.secondary',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6">Әзірге хабарламалар жоқ</Typography>
            <Typography variant="body2" sx={{ mt: 1, maxWidth: 300 }}>
              Осы өтініш бойынша талқылауды бастау үшін хабарлама жіберіңіз
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((msg, index) => (
              <Fade key={msg.id || index} in={true} timeout={300}>
                <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column' }}>
                  <MessageItem
                    message={msg}
                    isUserMessage={isUserMessage(msg)}
                  />
                </Box>
              </Fade>
            ))}
            {renderTypingIndicator()}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Тіркемелер және файл алдын-ала көрінісі */}
      {renderFilePreview()}
      
      {/* Хабарлама жіберу формасы */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {/* Теру жолағы */}
        <Box sx={{ display: 'flex' }}>
          {/* Жасырын файл таңдау өрісі */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />
          
          {/* Тіркеме түймесі */}
          <IconButton 
            color="primary" 
            onClick={handleAttachmentClick}
            disabled={sending}
            sx={{ mr: 1 }}
          >
            <AttachFileIcon />
          </IconButton>
          
          {/* Хабарлама енгізу өрісі */}
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Хабарламаңызды жазыңыз..."
            value={message}
            onChange={handleMessageChange}
            variant="outlined"
            disabled={sending}
            sx={{
              mr: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          {/* Жіберу түймесі */}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={sending || (!message.trim() && files.length === 0)}
            startIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            sx={{
              minWidth: isMobile ? 'auto' : 100,
              borderRadius: 2,
              height: 56
            }}
          >
            {sending ? 'Жіберілуде...' : 'Жіберу'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;