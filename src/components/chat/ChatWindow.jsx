// src/components/chat/ChatWindow.jsx
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
  Badge
} from '@mui/material';
import {
  Send as SendIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';
import wsService from '../../services/WebSocketService';
import MessageItem from './MessageItem';
import AttachmentUpload from './AttachmentUpload';
import { ticketsApi } from '../../api/tickets';

/**
 * Компонент окна чата для обмена сообщениями по заявке
 * Өтінім бойынша хабарлама алмасуға арналған чат терезесінің компоненті
 * 
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
  
  // Идентификатор пользователя - в реальном приложении должен быть получен из состояния аутентификации
  // Пайдаланушы идентификаторы - нақты қолданбада аутентификация күйінен алынуы керек
  const userId = localStorage.getItem('userId') || '1'; 

  // Инициализация WebSocket при монтировании
  // Компонент монтаждау кезінде WebSocket инициализациялау
  useEffect(() => {
    // Подключаемся к WebSocket серверу
    // WebSocket серверіне қосыламыз
    wsService.init(userId, 'requester');
    
    // Подписываемся на статус соединения
    // Байланыс күйіне жазыламыз
    const unsubscribeConnection = wsService.subscribeToConnectionStatus(setWsConnected);
    
    // Подписываемся на новые сообщения
    // Жаңа хабарламаларға жазыламыз
    const unsubscribeMessages = wsService.subscribeToMessages(ticketId, (message) => {
      setMessages(prev => [...prev, message]);
      // Если сообщение не от нас, отправляем статус прочитано
      // Егер хабарлама бізден болмаса, оқылды күйін жіберу
      if (message.sender.id !== userId) {
        wsService.sendMessageStatus(message.id, 'read');
      }
    });
    
    // Подписываемся на обновления статусов сообщений
    // Хабарлама күйінің жаңартуларына жазыламыз
    const unsubscribeStatuses = wsService.subscribeToStatusUpdates(ticketId, (messageId, status) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
    });
    
    // Подписываемся на индикаторы набора текста
    // Мәтін теру индикаторларына жазыламыз
    const unsubscribeTyping = wsService.subscribeToTypingIndicators(ticketId, (userId, isTyping) => {
      setIsTyping(isTyping);
      setTypingUserId(isTyping ? userId : null);
    });
    
    // Отписываемся при размонтировании
    // Компонент өшірілгенде жазылымнан бас тартамыз
    return () => {
      unsubscribeConnection();
      unsubscribeMessages();
      unsubscribeStatuses();
      unsubscribeTyping();
      wsService.disconnect();
    };
  }, [ticketId, userId]);

  // Загружаем историю сообщений при монтировании и изменении ticketId
  // Компонент монтаждалғанда және ticketId өзгергенде хабарлама тарихын жүктейміз
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await ticketsApi.getTicketMessages(ticketId);
        
        if (response && response.messages) {
          setMessages(response.messages);
          // Отмечаем все сообщения как прочитанные
          // Барлық хабарламаларды оқылды деп белгілейміз
          ticketsApi.markMessagesAsRead(ticketId);
        }
        
        setError(null);
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
  // Хабарламалар тізімі өзгергенде соңғы хабарламаға айналдыру
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Прокрутка к последнему сообщению
   * Соңғы хабарламаға айналдыру
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Обработчик изменения текста сообщения
   * Хабарлама мәтінінің өзгеруін өңдеуші
   * 
   * @param {Event} e - Событие изменения
   */
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    
    // Отправка индикатора набора текста
    // Мәтін теру индикаторын жіберу
    if (wsConnected) {
      wsService.sendTypingStatus(ticketId, true);
      
      // Сбрасываем предыдущий таймаут и устанавливаем новый
      // Алдыңғы таймаутты тазалап, жаңасын орнатамыз
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        wsService.sendTypingStatus(ticketId, false);
      }, 3000);
    }
  };

  /**
   * Отправка сообщения
   * Хабарламаны жіберу
   * 
   * @param {Event} e - Событие отправки формы
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && files.length === 0) return;

    try {
      setSending(true);
      
      // Отменяем индикатор набора текста
      // Мәтін теру индикаторын болдырмаймыз
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      wsService.sendTypingStatus(ticketId, false);
      
      // Загружаем вложения сначала, если они есть
      // Егер тіркемелер болса, алдымен оларды жүктейміз
      const uploadedAttachments = [];
      if (files.length > 0) {
        for (const file of files) {
          try {
            const response = await ticketsApi.uploadAttachment(ticketId, file);
            if (response && response.attachment) {
              uploadedAttachments.push(response.attachment.id);
            }
          } catch (fileErr) {
            console.error('Error uploading file:', fileErr);
          }
        }
      }
      
      // Если подключен WebSocket, отправляем через него
      // Егер WebSocket қосылған болса, сол арқылы жіберу
      if (wsConnected) {
        wsService.sendChatMessage(ticketId, message.trim(), uploadedAttachments);
      } else {
        // Если WebSocket недоступен, отправляем через REST API
        // Егер WebSocket қолжетімді болмаса, REST API арқылы жіберу
        await ticketsApi.addMessage(ticketId, {
          content: message.trim(),
          attachments: uploadedAttachments
        });
      }
      
      // Очищаем форму
      // Форманы тазалаймыз
      setMessage('');
      setFiles([]);
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Не удалось отправить сообщение. Пожалуйста, попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок */}
      {/* Тақырып */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Обсуждение заявки</Typography>
        {wsConnected ? (
          <Badge color="success" variant="dot" sx={{ '& .MuiBadge-badge': { right: -4 } }}>
            <Typography variant="caption">Подключено</Typography>
          </Badge>
        ) : (
          <Badge color="error" variant="dot" sx={{ '& .MuiBadge-badge': { right: -4 } }}>
            <Typography variant="caption">Офлайн</Typography>
          </Badge>
        )}
      </Box>

      {/* Сообщение об ошибке */}
      {/* Қате туралы хабарлама */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* Область сообщений */}
      {/* Хабарламалар аймағы */}
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
              isStaff={message.sender_type === 'staff'} 
            />
          ))
        )}

        {/* Индикатор "печатает..." */}
        {/* "Теруде..." индикаторы */}
        {isTyping && (
          <Box sx={{ p: 2, alignSelf: 'flex-start' }}>
            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              Сотрудник печатает...
            </Typography>
          </Box>
        )}
        
        {/* Ссылка для автоматической прокрутки */}
        {/* Автоматты айналдыру үшін сілтеме */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Форма отправки сообщения */}
      {/* Хабарлама жіберу формасы */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSendMessage}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Прикрепление файлов */}
            {/* Файлдарды тіркеу */}
            <AttachmentUpload 
              files={files} 
              setFiles={setFiles} 
              disabled={sending} 
            />
            
            <Box sx={{ display: 'flex', mt: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Введите сообщение..."
                value={message}
                onChange={handleMessageChange}
                size="small"
                disabled={sending}
                sx={{ mr: 1 }}
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
          {userEmail && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {wsConnected ? 
                "Копия сообщения будет отправлена на ваш email" : 
                "Соединение с сервером отсутствует. Сообщения могут быть доставлены с задержкой."
              }
            </Typography>
          )}
        </form>
      </Box>
    </Paper>
  );
};

export default ChatWindow;