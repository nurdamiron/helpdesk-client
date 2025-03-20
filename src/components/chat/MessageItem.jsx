// src/components/chat/MessageItem.jsx
import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Download as DownloadIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

/**
 * Компонент для отображения отдельного сообщения в чате
 * 
 * @param {Object} props - Свойства компонента
 * @param {Object} props.message - Данные сообщения
 * @param {boolean} props.isOwnMessage - Сообщение от текущего пользователя
 * @param {string} props.userType - Тип текущего пользователя
 * @returns {JSX.Element} Компонент сообщения
 */
const MessageItem = ({ message, isOwnMessage = false, userType = 'requester' }) => {
  // Определяем, является ли сообщение от сотрудника
  const isStaffMessage = message.sender?.type === 'staff' || 
                         message.sender_type === 'staff' ||
                         (userType === 'staff' && isOwnMessage) ||
                         (userType === 'requester' && !isOwnMessage);
                         
  // Получаем текст сообщения из разных возможных источников
  const messageText = message.content || message.body || '';
  
  // Получаем имя отправителя
  const senderName = message.sender?.name || 
                    (isStaffMessage ? 'Администратор' : 'Клиент');
  
  console.log('Message render:', {
    id: message.id,
    senderType: message.sender?.type || message.sender_type,
    isStaffMessage,
    userType,
    isOwnMessage
  });
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isStaffMessage ? 'row' : 'row-reverse',
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          bgcolor: isStaffMessage ? 'primary.main' : 'secondary.main',
          mr: isStaffMessage ? 1 : 0,
          ml: isStaffMessage ? 0 : 1
        }}
      >
        {isStaffMessage ? 'C' : 'К'}
      </Avatar>
      
      <Box
        sx={{
          maxWidth: '70%',
          backgroundColor: isStaffMessage ? '#f0f0f0' : '#e3f2fd',
          p: 2,
          borderRadius: 2,
          borderTopLeftRadius: isStaffMessage ? 0 : 2,
          borderTopRightRadius: isStaffMessage ? 2 : 0,
        }}
      >
        {/* Имя отправителя */}
        <Typography variant="subtitle2" color="text.secondary">
          {senderName}
        </Typography>
        
        {/* Текст сообщения */}
        <Typography variant="body1">
          {messageText}
        </Typography>
        
        {/* Вложения */}
        {message.attachments && message.attachments.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {message.attachments.map((attachment, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  p: 1,
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                {attachment.file_type?.startsWith('image/') ? 
                  <ImageIcon fontSize="small" sx={{ mr: 1 }} /> : 
                  <FileIcon fontSize="small" sx={{ mr: 1 }} />}
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {attachment.file_name || attachment.fileName || 'Файл'}
                </Typography>
                <IconButton
                  size="small"
                  href={attachment.url || `/uploads/${attachment.file_path}`}
                  download
                  target="_blank"
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
        
        {/* Время отправки и статус */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, alignItems: 'center' }}>
          {message.status && !isStaffMessage && (
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              {message.status === 'sent' && 'Отправлено'}
              {message.status === 'delivered' && 'Доставлено'}
              {message.status === 'read' && 'Прочитано'}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {formatDate(message.created_at)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageItem;