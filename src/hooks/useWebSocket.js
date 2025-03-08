// src/hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Хук для работы с WebSocket
 * @param {string} url - URL для подключения к WebSocket
 * @returns {Object} - Состояние и методы для работы с WebSocket
 */
const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  
  // Максимальная задержка для повторного подключения (в мс)
  const maxReconnectDelay = 5000;
  
  // Счетчик попыток переподключения
  const reconnectAttempts = useRef(0);

  // Функция для подключения к WebSocket
  const connect = useCallback(() => {
    try {
      // Закрываем существующее соединение, если оно есть
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Создаем новое WebSocket соединение
      wsRef.current = new WebSocket(url);

      // Обработчики событий WebSocket
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessage(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected, code:', event.code);
        setIsConnected(false);

        // Не пытаемся переподключиться, если соединение было закрыто нормально (код 1000)
        if (event.code !== 1000) {
          // Экспоненциальное увеличение задержки между попытками переподключения
          const delay = Math.min(
            Math.pow(2, reconnectAttempts.current) * 1000,
            maxReconnectDelay
          );
          
          console.log(`Attempting to reconnect in ${delay}ms`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connect();
          }, delay);
        }
      };
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setError('Failed to establish connection');
    }
  }, [url]);

  // Функция для отправки сообщения через WebSocket
  const sendMessage = useCallback((data) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [isConnected]);

  // Функция для закрытия WebSocket соединения
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  // Подключение при монтировании и отключение при размонтировании
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    message,
    error,
    sendMessage,
    connect,
    disconnect
  };
};

export default useWebSocket;