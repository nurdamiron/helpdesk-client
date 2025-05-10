// src/hooks/useChatWebSocket.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Хук для управления WebSocket соединением в чате
 * @param {number|string} ticketId - ID тикета для чата
 * @param {object} userInfo - Информация о пользователе {id, email, type}
 * @returns {object} - Методы и состояние WebSocket соединения
 */
const useChatWebSocket = (ticketId, userInfo = { type: 'requester' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const pingIntervalRef = useRef(null);
  
  // Максимальная задержка между попытками переподключения
  const maxReconnectDelay = 10000; // 10 секунд
  
  // Конфигурация WebSocket URL
  const getWebSocketUrl = useCallback(() => {
    // Определяем базовый URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_WS_URL || 
                window.location.host || 
                'localhost:5002';
    
    // Параметры подключения
    const userId = userInfo.id || 'anonymous';
    const userType = userInfo.type || 'requester';
    
    return `${protocol}//${host}/ws?userId=${userId}&userType=${userType}&ticketId=${ticketId}`;
  }, [ticketId, userInfo]);
  
  /**
   * Обработчик входящих сообщений от WebSocket
   */
  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket received:', data);
      
      switch (data.type) {
        case 'new_message':
          // Добавляем новое сообщение в чат
          setMessages(prev => {
            // Проверяем, что сообщение не дублируется
            if (!prev.some(msg => msg.id === data.message.id)) {
              return [...prev, data.message];
            }
            return prev;
          });
          
          // Обновляем статус сообщения на "доставлено"
          if (data.message.sender.type !== userInfo.type) {
            sendMessageStatus(data.message.id, 'delivered');
          }
          break;
          
        case 'message_sent':
          // Обновляем статус нашего сообщения
          setMessages(prev => 
            prev.map(msg => 
              msg.id === data.message_id 
                ? { ...msg, status: 'sent', sent_at: data.timestamp } 
                : msg
            )
          );
          break;
          
        case 'status_update':
          // Обновляем статус сообщения
          setMessages(prev => 
            prev.map(msg => 
              msg.id === data.message_id 
                ? { ...msg, status: data.status, [`${data.status}_at`]: data.timestamp } 
                : msg
            )
          );
          break;
          
        case 'typing_indicator':
          // Показываем/скрываем индикатор набора текста
          if (data.user_type !== userInfo.type) {
            setTypingStatus(data.isTyping);
            
            // Автоматически убираем индикатор через 5 секунд, если нет обновлений
            if (data.isTyping) {
              setTimeout(() => {
                setTypingStatus(false);
              }, 5000);
            }
          }
          break;
          
        case 'pong':
          // Пинг-понг для поддержания соединения
          console.log('Pong received at', data.timestamp);
          break;
          
        case 'connection_established':
          console.log('WebSocket connection confirmed:', data);
          break;
          
        default:
          console.log('Unhandled WebSocket message type:', data.type);
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  }, [ticketId, userInfo.type]);
  
  /**
   * Инициализация WebSocket соединения
   */
  const connectWebSocket = useCallback(() => {
    // Закрываем существующее соединение, если есть
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    
    try {
      const url = getWebSocketUrl();
      console.log('Connecting to WebSocket:', url);
      
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        // Устанавливаем интервал для ping, чтобы соединение не закрылось
        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ 
              type: 'ping',
              ticket_id: ticketId,
              timestamp: new Date().toISOString()
            }));
          }
        }, 30000); // Каждые 30 секунд
      };
      
      wsRef.current.onmessage = handleMessage;
      
      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Ошибка соединения с сервером');
      };
      
      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected, code:', event.code);
        setIsConnected(false);
        
        // Очищаем интервал ping
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        
        // Не переподключаемся, если закрытие было запланированным (код 1000)
        if (event.code !== 1000) {
          // Экспоненциальное увеличение времени между попытками
          const delay = Math.min(
            Math.pow(1.5, reconnectAttemptsRef.current) * 1000,
            maxReconnectDelay
          );
          
          console.log(`Attempting to reconnect in ${delay}ms`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connectWebSocket();
          }, delay);
        }
      };
    } catch (err) {
      console.error('Error initializing WebSocket:', err);
      setError('Failed to initialize WebSocket connection');
    }
  }, [getWebSocketUrl, handleMessage, ticketId]);
  
  /**
   * Закрытие WebSocket соединения
   */
  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
  }, []);
  
  /**
   * Отправка сообщения через WebSocket
   */
  const sendMessage = useCallback((content, attachmentIds = []) => {
    if (!isConnected || !wsRef.current) {
      console.error('Cannot send message: WebSocket not connected');
      return false;
    }
    
    const messageData = {
      type: 'chat_message',
      ticket_id: ticketId,
      content,
      attachments: attachmentIds,
      sender_id: userInfo.id || 'anonymous',
      sender_type: userInfo.type || 'requester'
    };
    
    try {
      wsRef.current.send(JSON.stringify(messageData));
      setLastMessageTimestamp(new Date().toISOString());
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  }, [isConnected, ticketId, userInfo.id, userInfo.type]);
  
  /**
   * Отправка статуса сообщения (прочитано/доставлено)
   */
  const sendMessageStatus = useCallback((messageId, status) => {
    if (!isConnected || !wsRef.current) {
      console.error('Cannot send status: WebSocket not connected');
      return false;
    }
    
    const statusData = {
      type: 'message_status',
      message_id: messageId,
      status,
      timestamp: new Date().toISOString()
    };
    
    try {
      wsRef.current.send(JSON.stringify(statusData));
      return true;
    } catch (err) {
      console.error('Error sending message status:', err);
      return false;
    }
  }, [isConnected]);
  
  /**
   * Отправка индикатора набора текста
   */
  const sendTypingIndicator = useCallback((isTyping) => {
    if (!isConnected || !wsRef.current) {
      return false;
    }
    
    const typingData = {
      type: 'typing',
      ticket_id: ticketId,
      sender_id: userInfo.id || 'anonymous',
      sender_type: userInfo.type || 'requester',
      isTyping
    };
    
    try {
      wsRef.current.send(JSON.stringify(typingData));
      return true;
    } catch (err) {
      console.error('Error sending typing indicator:', err);
      return false;
    }
  }, [isConnected, ticketId, userInfo.id, userInfo.type]);
  
  // Подключаемся при монтировании и отключаемся при размонтировании
  useEffect(() => {
    if (ticketId) {
      connectWebSocket();
    }
    
    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket, ticketId]);
  
  // Обновляем соединение при изменении ticketId или userInfo
  useEffect(() => {
    if (isConnected && wsRef.current) {
      // Переподключаемся с новыми параметрами
      disconnectWebSocket();
      connectWebSocket();
    }
  }, [ticketId, userInfo.id, userInfo.type, connectWebSocket, disconnectWebSocket, isConnected]);
  
  return {
    isConnected,
    messages,
    typingStatus,
    error,
    sendMessage,
    sendMessageStatus,
    sendTypingIndicator,
    connectWebSocket,
    disconnectWebSocket,
    lastMessageTimestamp
  };
};

export default useChatWebSocket;