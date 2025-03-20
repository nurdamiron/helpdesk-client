// src/components/chat/ChatWindow.jsx - Fix for userType error
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
  IconButton
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';
import wsService from '../../services/WebSocketService';
import MessageItem from './MessageItem';
import { ticketsApi } from '../../api/tickets';
import { messagesApi } from '../../api/message';

/**
 * Компонент окна чата для обмена сообщениями по заявке
 * @param {Object} props - Свойства компонента
 * @param {string|number} props.ticketId - ID заявки
 * @param {string} props.userEmail - Email пользователя
 * @returns {JSX.Element} Компонент окна чата
 */
const ChatWindow = ({ ticketId, userEmail }) => {
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
  
  // Определяем тип пользователя - по умолчанию это requester (клиент)
  // В реальном приложении это должно быть получено из состояния аутентификации
  const [userType] = useState('requester');
  
  // Идентификатор пользователя - в реальном приложении должен быть получен из состояния аутентификации
  const userId = localStorage.getItem('userId') || '1'; 

  // Инициализация WebSocket при монтировании
  useEffect(() => {
    console.log('Initializing WebSocket connection for ticket:', ticketId);
    wsService.init(userId, userType);
    
    // Subscribe to connection status
    const unsubscribeConnection = wsService.subscribeToConnectionStatus((connected) => {
      console.log('WebSocket connection status changed:', connected);
      setWsConnected(connected);
      
      // If reconnected, check for missed messages
      if (connected && messages.length > 0) {
        fetchLatestMessages();
      }
    });
    
    // Subscribe to new messages
    const unsubscribeMessages = wsService.subscribeToMessages(ticketId, (newMessage) => {
      console.log('New message received:', newMessage);
      setMessages(prev => {
        // Avoid duplicates
        if (!prev.some(msg => msg.id === newMessage.id)) {
          return [...prev, newMessage];
        }
        return prev;
      });
      
      // If message is not from us, send read status
      if (newMessage.sender.type !== userType || newMessage.sender.id !== userId) {
        wsService.sendMessageStatus(newMessage.id, 'read');
      }
    });
    
    // Subscribe to status updates
    const unsubscribeStatuses = wsService.subscribeToStatusUpdates(ticketId, (messageId, status) => {
      console.log(`Message ${messageId} status updated to: ${status}`);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
    });
    
    // Subscribe to typing indicators
    const unsubscribeTyping = wsService.subscribeToTypingIndicators(ticketId, (userId, isTyping) => {
      console.log(`User ${userId} typing status: ${isTyping}`);
      setIsTyping(isTyping);
      setTypingUserId(isTyping ? userId : null);
    });
    
    // Cleanup on unmount
    return () => {
      unsubscribeConnection();
      unsubscribeMessages();
      unsubscribeStatuses();
      unsubscribeTyping();
      wsService.disconnect();
    };
  }, [ticketId, userId, userType, messages.length]);

  // Загружаем историю сообщений при монтировании и изменении ticketId
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ticketsApi.getTicketMessages(ticketId).catch(error => {
          console.log('Error getting messages, falling back to alternative method');
          return { messages: [] };
        });
        
        if (response && response.messages) {
          setMessages(response.messages);
          // Trying to mark messages as read
          try {
            await ticketsApi.markMessagesAsRead(ticketId);
          } catch (markError) {
            console.error('Error marking messages as read:', markError);
          }
        } else if (response && response.status === 'success' && response.data) {
          // Alternative response format
          setMessages(response.data);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Не удалось загрузить сообщения. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchMessages();
    }
  }, [ticketId]);

  // Прокрутка к последнему сообщению при изменении списка сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Determine if a message is from the current user
   * @param {Object} message - The message to check
   * @returns {boolean} - True if the message is from the current user
   */
  const isUserMessage = (message) => {
    // Check various possible sender properties
    return (
      (message.sender?.type === userType) ||
      (message.sender_type === userType) ||
      (message.sender?.id === userId) ||
      (message.sender_id === userId)
    );
  };

  /**
   * Fetch the latest messages to ensure we have the most recent data
   */
  const fetchLatestMessages = async () => {
    try {
      const response = await ticketsApi.getTicketMessages(ticketId).catch(error => {
        console.log('Error getting latest messages');
        return { messages: [] };
      });
      
      if (response && response.messages && response.messages.length > messages.length) {
        setMessages(response.messages);
      }
    } catch (err) {
      console.error('Error fetching latest messages:', err);
    }
  };

  /**
   * Force reconnection to WebSocket
   */
  const handleReconnect = () => {
    wsService.disconnect();
    setTimeout(() => {
      wsService.init(userId, userType);
    }, 500);
  };

  /**
   * Прокрутка к последнему сообщению
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Обработчик изменения текста сообщения
   * @param {Event} e - Событие изменения
   */
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    
    // Отправка индикатора набора текста
    if (wsConnected) {
      wsService.sendTypingStatus(ticketId, true);
      
      // Сбрасываем предыдущий таймаут и устанавливаем новый
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        wsService.sendTypingStatus(ticketId, false);
      }, 3000);
    }
  };

  /**
   * Handle file button click
   */
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Handle file selection
   */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check file size limit (max 5MB per file)
    const validFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Некоторые файлы не были добавлены, так как их размер превышает 5 МБ');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    e.target.value = '';
  };

  /**
   * Remove file from attachments list
   */
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  /**
   * Отправка сообщения
   * @param {Event} e - Событие отправки формы
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && files.length === 0) return;

    try {
      setSending(true);
      
      // Cancel typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (wsConnected) {
        wsService.sendTypingStatus(ticketId, false);
      }
      
      // Upload attachments first, if any
      const uploadedAttachments = [];
      if (files.length > 0) {
        for (const file of files) {
          try {
            const response = await ticketsApi.uploadAttachment(ticketId, file);
            
            if (response && (response.attachment?.id || response.id)) {
              uploadedAttachments.push(response.attachment?.id || response.id);
            }
          } catch (fileErr) {
            console.error('Error uploading file:', fileErr);
          }
        }
      }
      
      // Try to send the message via WebSocket first
      let messageSent = false;
      if (wsConnected) {
        messageSent = wsService.sendChatMessage(ticketId, message.trim(), uploadedAttachments);
      }
      
      // If WebSocket fails, use REST API as fallback
      if (!messageSent) {
        await ticketsApi.addMessage(ticketId, {
          body: message.trim(),
          attachments: uploadedAttachments,
          sender_type: userType,
          sender_id: userId
        });
      }
      
      // Update UI optimistically with a temporary message
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: message.trim(),
        sender: {
          id: userId,
          type: userType,
          name: userType === 'requester' ? 'Вы' : 'Администратор'
        },
        created_at: new Date().toISOString(),
        status: 'sending'
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // Clear form
      setMessage('');
      setFiles([]);
      setError(null);
      
      // Fetch latest messages after a short delay
      setTimeout(() => {
        fetchLatestMessages();
      }, 1000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Не удалось отправить сообщение. Пожалуйста, попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Обсуждение заявки #{ticketId}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {wsConnected ? (
            <Badge color="success" variant="dot" sx={{ '& .MuiBadge-badge': { right: -4 } }}>
              <Typography variant="caption">Подключено</Typography>
            </Badge>
          ) : (
            <>
              <Badge color="error" variant="dot" sx={{ '& .MuiBadge-badge': { right: -4 } }}>
                <Typography variant="caption" sx={{ mr: 1 }}>Офлайн</Typography>
              </Badge>
              <IconButton size="small" color="inherit" onClick={handleReconnect}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* Messages area */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          maxHeight: '500px',
          bgcolor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography color="text.secondary">
              Начните обсуждение вашей заявки!
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <MessageItem 
              key={message.id || index} 
              message={message} 
              isOwnMessage={isUserMessage(message)}
              userType={userType} 
            />
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <Box sx={{ p: 2, alignSelf: 'flex-start' }}>
            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              {userType === 'requester' ? 'Администратор печатает...' : 'Клиент печатает...'}
            </Typography>
          </Box>
        )}
        
        {/* Reference for auto-scroll */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message input form */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSendMessage}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* File attachments */}
            <Box sx={{ mb: 1 }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                multiple
              />
              
              {files.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" gutterBottom>
                    Вложения ({files.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {files.map((file, idx) => (
                      <Chip 
                        key={idx}
                        label={`${file.name} (${(file.size / 1024).toFixed(0)} KB)`}
                        onDelete={() => removeFile(idx)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex' }}>
              <IconButton 
                color="primary" 
                onClick={handleAttachmentClick}
                disabled={sending}
              >
                <AttachFileIcon />
              </IconButton>
              
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Введите сообщение..."
                value={message}
                onChange={handleMessageChange}
                size="small"
                disabled={sending}
                sx={{ mx: 1 }}
                multiline
                maxRows={4}
              />
              
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={sending || (!message.trim() && files.length === 0)}
                endIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              >
                {sending ? "Отправка..." : "Отправить"}
              </Button>
            </Box>
          </Box>
          
          {/* Connection status & email info */}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              {wsConnected ? 
                "Соединение установлено" : 
                "Работа в автономном режиме. Сообщения будут отправлены при восстановлении соединения."
              }
            </Typography>
            
            {userEmail && (
              <Typography variant="caption" color="text.secondary">
                Копия на: {userEmail}
              </Typography>
            )}
          </Box>
        </form>
      </Box>
    </Paper>
  );
};

export default ChatWindow;