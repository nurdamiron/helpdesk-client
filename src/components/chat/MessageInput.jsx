// src/components/chat/MessageInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import AttachmentsList from './AttachmentsList';

/**
 * Компонент формы ввода сообщения
 * Хабарлама енгізу формасының компоненті
 * 
 * @param {Function} onSendMessage - Функция отправки сообщения
 * @param {Function} onTypingChange - Функция обработки набора текста
 * @param {string} userEmail - Email пользователя для отображения информации
 * @param {boolean} disabled - Флаг отключения формы ввода
 */
const MessageInput = ({ onSendMessage, onTypingChange, userEmail, disabled = false }) => {
  // Состояния
  // Күйлер
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Реф для input загрузки файлов
  // Файлдарды жүктеуге арналған input рефі
  const fileInputRef = useRef(null);

  /**
   * Обработчик изменения текста сообщения
   * Хабарлама мәтінінің өзгеруін өңдеуші
   */
  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Обработка индикатора набора текста
    // Мәтін теру индикаторын өңдеу
    const newIsTyping = value.length > 0;
    
    // Отправляем событие только при изменении состояния
    // Күй өзгерген кезде ғана оқиғаны жібереміз
    if (newIsTyping !== isTyping) {
      setIsTyping(newIsTyping);
      onTypingChange(newIsTyping);
    }
    
    // Сбрасываем таймер предыдущей отправки
    // Алдыңғы жіберу таймерін сбросттаймыз
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Устанавливаем новый таймер для отправки "прекращение набора"
    // "Теруді тоқтату" жіберу үшін жаңа таймер орнатамыз
    const timeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTypingChange(false);
      }
    }, 3000);
    
    setTypingTimeout(timeout);
  };

  /**
   * Очистка таймера при размонтировании компонента
   * Компонент өшірілгенде таймерді тазалау
   */
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Отправляем событие прекращения набора при размонтировании
      // Компонент өшірілгенде теруді тоқтату оқиғасын жіберу
      if (isTyping) {
        onTypingChange(false);
      }
    };
  }, [typingTimeout, isTyping, onTypingChange]);

  /**
   * Обработчик отправки сообщения
   * Хабарлама жіберуді өңдеуші
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (disabled || (!message.trim() && attachments.length === 0)) return;
    
    try {
      setSending(true);
      
      // Отправляем сообщение
      // Хабарламаны жіберу
      const success = await onSendMessage(message, attachments);
      
      if (success) {
        // Очищаем поля ввода после успешной отправки
        // Сәтті жіберуден кейін енгізу өрістерін тазалаймыз
        setMessage('');
        setAttachments([]);
      }
    } finally {
      setSending(false);
    }
  };

  /**
   * Обработчик клика по кнопке вложения
   * Тіркеме түймесін басуды өңдеуші
   */
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Обработчик выбора файлов
   * Файлдарды таңдауды өңдеуші
   */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Проверка размера файлов (макс. 5MB на файл)
    // Файл өлшемін тексеру (файл басына макс. 5MB)
    const maxSize = 5 * 1024 * 1024;
    const validFiles = selectedFiles.filter(file => file.size <= maxSize);
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Некоторые файлы не были добавлены, так как их размер превышает 5 МБ');
      alert('Кейбір файлдар қосылмады, себебі олардың өлшемі 5 МБ-тан асады');
    }
    
    setAttachments(prev => [...prev, ...validFiles]);
    
    // Сбрасываем input для возможности повторного выбора тех же файлов
    // Сол файлдарды қайта таңдау мүмкіндігі үшін input-ты сбросттаймыз
    e.target.value = '';
  };

  /**
   * Удаление файла из списка вложений
   * Тіркемелер тізімінен файлды жою
   */
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit}>
        {/* Список вложений */}
        {attachments.length > 0 && (
          <AttachmentsList 
            attachments={attachments} 
            onRemove={removeAttachment} 
          />
        )}
        
        {/* Форма ввода */}
        <Box sx={{ display: 'flex' }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
            disabled={disabled || sending}
          />
          
          <IconButton
            color="primary"
            onClick={handleAttachmentClick}
            disabled={disabled || sending}
            title="Прикрепить файл"
            aria-label="Прикрепить файл"
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
            disabled={disabled || sending}
            sx={{ mx: 1 }}
          />
          
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={disabled || sending || (!message.trim() && attachments.length === 0)}
            endIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          >
            {sending ? "Отправка..." : "Отправить"}
          </Button>
        </Box>
        
        {/* Подпись с информацией */}
        {userEmail && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {userEmail && "Копия сообщения будет отправлена на ваш email"}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default MessageInput;