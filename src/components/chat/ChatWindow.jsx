// src/components/chat/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { chatApi } from '../../api/chat';
import { formatDate } from '../../utils/dateUtils';
import useWebSocket from '../../hooks/useWebSocket';

// Компонент для отображения одного сообщения
const MessageItem = ({ message, isCurrentUser }) => {
  return (
    <ListItem
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
        padding: 1
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          maxWidth: '80%'
        }}
      >
        <Avatar
          sx={{
            bgcolor: isCurrentUser ? 'primary.main' : 'secondary.main',
            width: 36,
            height: 36,
            mx: 1
          }}
        >
          {isCurrentUser ? 'Вы' : 'СП'}
        </Avatar>
        
        <Paper
          elevation={1}
          sx={{
            p: 2,
            backgroundColor: isCurrentUser ? 'primary.light' : 'grey.100',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          <Typography variant="body1">
            {message.body}
          </Typography>
          
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1, textAlign: 'right' }}
          >
            {formatDate(message.created_at, true)}
          </Typography>
        </Paper>
      </Box>
    </ListItem>
  );
};

// Основной компонент чата
const ChatWindow = ({ ticketId, userEmail }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // WebSocket для получения обновлений в реальном времени
  const wsUrl = import.meta.env.VITE_WS_URL || 'wss://helpdesk-backend-ycoo.onrender.com/ws';
  const { isConnected, message: wsMessage } = useWebSocket(wsUrl);

  // Загрузка истории сообщений при монтировании или изменении ticketId
  useEffect(() => {
    const fetchMessages = async () => {
      if (!ticketId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await chatApi.getConversation(ticketId);
        if (response.conversation?.messages) {
          setMessages(response.conversation.messages);
        }
      } catch (err) {
        console.error('Ошибка при загрузке сообщений:', err);
        setError('Не удалось загрузить историю сообщений. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [ticketId]);

  // Обработка новых сообщений через WebSocket
  useEffect(() => {
    if (wsMessage && wsMessage.type === 'message' && wsMessage.conversationId === ticketId) {
      setMessages(prev => [...prev, wsMessage.message]);
    }
  }, [wsMessage, ticketId]);

  // Прокрутка к последнему сообщению при добавлении новых
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Обработка отправки сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !ticketId) return;
    
    try {
      // Формируем данные сообщения
      const messageData = {
        body: newMessage.trim(),
        sender_id: 999, // Временный ID для анонимного пользователя
        content_type: 'text'
      };
      
      // Отправляем сообщение через API
      await chatApi.sendMessage({
        conversationId: ticketId,
        messageData
      });
      
      // Очищаем поле ввода
      setNewMessage('');
      
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      setError('Не удалось отправить сообщение. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок чата */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          Чат с поддержкой
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isConnected ? (
            <Box component="span" sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
              <Box 
                component="span" 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'success.main', 
                  display: 'inline-block',
                  mr: 1 
                }} 
              />
              Подключено
            </Box>
          ) : (
            <Box component="span" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
              <Box 
                component="span" 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'grey.500', 
                  display: 'inline-block',
                  mr: 1 
                }} 
              />
              Отключено
            </Box>
          )}
        </Typography>
      </Box>

      {/* Список сообщений */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : messages.length > 0 ? (
          <List>
            {messages.map((msg, index) => (
              <MessageItem 
                key={msg.id || index}
                message={msg}
                isCurrentUser={msg.sender_id === 999 || (userEmail && msg.sender_email === userEmail)}
              />
            ))}
            <div ref={messagesEndRef} />
          </List>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Нет сообщений. Напишите нам, и мы ответим в ближайшее время!
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Форма отправки сообщения */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          backgroundColor: 'background.default',
          display: 'flex'
        }}
      >
        <TextField
          fullWidth
          placeholder="Введите ваше сообщение..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          variant="outlined"
          sx={{ mr: 1 }}
          disabled={!ticketId || !isConnected}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          disabled={!newMessage.trim() || !ticketId || !isConnected}
        >
          Отправить
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatWindow;