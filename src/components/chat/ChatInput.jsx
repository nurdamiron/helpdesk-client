// src/components/chat/ChatInput.jsx
import React, { useRef } from 'react';
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
  Attachment as AttachmentIcon
} from '@mui/icons-material';

/**
 * Компонент для ввода и отправки сообщений в чате
 */
const ChatInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  onAttachmentSelect, 
  sending = false, 
  isConnected = true,
  userEmail,
  disabled = false
}) => {
  const fileInputRef = useRef(null);

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box 
      component="form" 
      onSubmit={onSubmit} 
      sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0', 
        bgcolor: 'background.paper' 
      }}
    >
      <Box sx={{ display: 'flex' }}>
        {/* Скрытый input для выбора файлов */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onAttachmentSelect}
          multiple
          disabled={disabled || sending}
        />
        
        {/* Кнопка выбора вложений */}
        <IconButton
          color="primary"
          onClick={handleAttachmentClick}
          disabled={disabled || sending}
          sx={{ alignSelf: 'flex-end' }}
        >
          <AttachmentIcon />
        </IconButton>
        
        {/* Поле ввода сообщения */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Введите сообщение..."
          value={value}
          onChange={onChange}
          multiline
          maxRows={4}
          disabled={disabled || sending}
          sx={{ 
            mx: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        
        {/* Кнопка отправки */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={disabled || sending || !value.trim()}
          endIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          sx={{ alignSelf: 'flex-end', borderRadius: 2, height: 56 }}
        >
          {sending ? "Отправка..." : "Отправить"}
        </Button>
      </Box>
      
      {/* Информация о соединении */}
      {!isConnected && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          Нет соединения с сервером. Сообщения будут отправлены при восстановлении связи.
        </Typography>
      )}
      
      {/* Информация о почтовых уведомлениях */}
      {userEmail && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Копия сообщения будет отправлена на ваш email: {userEmail}
        </Typography>
      )}
    </Box>
  );
};

export default ChatInput;