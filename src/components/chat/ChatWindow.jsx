// src/components/chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  Attachment as AttachmentIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';

// This is a simplified version of the api service - you'd need to implement this
const ticketsApi = {
  getMessages: async (ticketId) => {
    // Fetch messages for the ticket
    try {
      const response = await fetch(`/api/tickets/${ticketId}/messages`);
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },
  
  sendMessage: async (ticketId, messageData) => {
    // Send a new message
    try {
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });
      const data = await response.json();
      return data.message || data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  uploadAttachment: async (ticketId, file) => {
    // Upload a file attachment
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/tickets/${ticketId}/attachments`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data.attachment || data;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  }
};

const ChatWindow = ({ ticketId, userEmail }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await ticketsApi.getMessages(ticketId);
        setMessages(Array.isArray(data) ? data : []);
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

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) return;

    try {
      setSending(true);
      
      // Upload attachments first if any
      const uploadedAttachments = [];
      if (attachments.length > 0) {
        for (const file of attachments) {
          const attachment = await ticketsApi.uploadAttachment(ticketId, file);
          uploadedAttachments.push(attachment);
        }
      }

      // Prepare message data
      const messageData = {
        content: message.trim(),
        attachments: uploadedAttachments.map(a => a.id),
        // Include email notification flag
        notify_email: true
      };

      // Send the message
      const response = await ticketsApi.sendMessage(ticketId, messageData);
      
      // Update messages state
      if (response) {
        setMessages(prev => [...prev, {
          id: response.id || Date.now(),
          content: message.trim(),
          sender_type: 'requester',
          created_at: new Date().toISOString(),
          attachments: uploadedAttachments
        }]);
      }
      
      // Clear form
      setMessage('');
      setAttachments([]);
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Не удалось отправить сообщение. Пожалуйста, попробуйте позже.');
    } finally {
      setSending(false);
    }
  };

  // Handle file attachment
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
    e.target.value = null; // Reset to allow selecting the same file again
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Determine message sender type
  const isMessageFromStaff = (senderType) => {
    return senderType === 'staff';
  };

  // Render a message
  const renderMessage = (message, index) => {
    const isStaff = isMessageFromStaff(message.sender_type);
    
    return (
      <Box
        key={message.id || index}
        sx={{
          display: 'flex',
          flexDirection: isStaff ? 'row' : 'row-reverse',
          mb: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: isStaff ? 'primary.main' : 'secondary.main',
            mr: isStaff ? 1 : 0,
            ml: isStaff ? 0 : 1
          }}
        >
          {isStaff ? 'S' : 'Я'}
        </Avatar>
        
        <Box
          sx={{
            maxWidth: '70%',
            backgroundColor: isStaff ? '#f0f0f0' : '#e3f2fd',
            p: 2,
            borderRadius: 2,
            borderTopLeftRadius: isStaff ? 0 : 2,
            borderTopRightRadius: isStaff ? 2 : 0,
          }}
        >
          <Typography variant="body1">
            {message.content || message.body}
          </Typography>
          
          {/* Render attachments if any */}
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
                    {attachment.file_name || attachment.fileName}
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
          
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1, textAlign: 'right' }}
          >
            {formatDate(message.created_at)}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">Обсуждение заявки</Typography>
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
          bgcolor: '#f9f9f9'
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
          messages.map((message, index) => renderMessage(message, index))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <Box sx={{ p: 2, bgcolor: '#f0f0f0' }}>
          <Typography variant="subtitle2" gutterBottom>
            Прикрепленные файлы ({attachments.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {attachments.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'white',
                  borderRadius: 1,
                  p: 0.5,
                  pl: 1
                }}
              >
                {file.type.startsWith('image') ? (
                  <ImageIcon fontSize="small" sx={{ mr: 0.5 }} />
                ) : (
                  <FileIcon fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography variant="caption" sx={{ maxWidth: '120px' }} noWrap>
                  {file.name}
                </Typography>
                <IconButton size="small" onClick={() => removeAttachment(index)}>
                  <Typography variant="caption" color="error">✕</Typography>
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Input area */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSendMessage}>
          <Box sx={{ display: 'flex' }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              multiple
            />
            <IconButton
              color="primary"
              onClick={handleAttachmentClick}
              disabled={sending}
            >
              <AttachmentIcon />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Введите сообщение..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              size="small"
              disabled={sending}
              sx={{ mx: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={sending || (!message.trim() && attachments.length === 0)}
              endIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            >
              {sending ? "Отправка..." : "Отправить"}
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {userEmail && "Копия сообщения будет отправлена на ваш email"}
          </Typography>
        </form>
      </Box>
    </Paper>
  );
};

export default ChatWindow;