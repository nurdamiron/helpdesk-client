// src/components/chat/MessagesList.jsx
import React from 'react';
import { Box } from '@mui/material';
import MessageItem from './MessageItem';

/**
 * Компонент для отображения списка сообщений в чате
 * Чаттағы хабарламалар тізімін көрсету компоненті
 * 
 * @param {Array} messages - Массив сообщений для отображения
 * @param {string} userType - Тип текущего пользователя для определения своих/чужих сообщений
 */
const MessagesList = ({ messages, userType }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          isOwnMessage={message.sender.type === userType}
          userType={userType}
        />
      ))}
    </Box>
  );
};

export default MessagesList;