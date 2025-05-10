// src/components/chat/MessagesList.jsx - Хабарламалар тізімі компоненті
import React from 'react';
import { Box } from '@mui/material';
import MessageItem from './MessageItem';

/**
 * Чаттағы хабарламалар тізімін көрсету компоненті
 * 
 * @param {Array} messages - Көрсетілетін хабарламалар массиві
 * @param {string} userType - Өз/басқа хабарламаларын анықтау үшін ағымдағы пайдаланушы түрі
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