// src/components/chat/MessageItem.jsx - Чаттағы хабарламалар компоненті
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Badge,
  useTheme,
  useMediaQuery,
  Link
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  AttachFile as AttachmentIcon,
  CloudDownload as DownloadIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

/**
 * Чаттағы бір хабарламаны көрсететін компонент
 *
 * @param {Object} props - Компонент қасиеттері
 * @param {Object} props.message - Хабарлама деректері
 * @param {boolean} props.isUserMessage - Хабарлама ағымдағы пайдаланушыдан екенін көрсететін жалауша
 * @param {Function} props.onOpenAttachment - Тіркемені ашу функциясы
 * @returns {JSX.Element} - React компоненті
 */
const MessageItem = ({ message, isUserMessage, onOpenAttachment }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Хабарлама туралы деректерді алу
  const {
    content,
    created_at,
    sender = {},
    attachments = [],
    status = 'sent'
  } = message;
  
  // Жіберушінің атын анықтау
  const senderName = sender.name || 
                   sender.full_name || 
                   (sender.type === 'agent' ? 'Қолдау қызметкері' : 'Клиент');
  
  // Аватар үшін атаудың бірінші әрпін алу
  const avatarLetter = (senderName || '?').charAt(0).toUpperCase();
  
  // Жіберуші түріне байланысты аватар түсін анықтау
  const avatarColor = sender.type === 'agent' || sender.type === 'support' 
    ? theme.palette.primary.main 
    : theme.palette.secondary.main;
  
  // Тіркеме түріне байланысты иконка алу
  const getAttachmentIcon = (attachment) => {
    const filename = attachment.file_name || attachment.filename || '';
    const fileType = attachment.mime_type || attachment.content_type || '';
    
    if (fileType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
      return <ImageIcon />;
    } else if (fileType === 'application/pdf' || /\.pdf$/i.test(filename)) {
      return <PdfIcon />;
    } else {
      return <FileIcon />;
    }
  };
  
  // Хабарлама күйін көрсету
  const renderStatusIndicator = () => {
    if (!isUserMessage) return null;
    
    switch (status) {
      case 'read':
        return (
          <Tooltip title="Оқылды" arrow>
            <CheckCircleIcon 
              fontSize="small" 
              sx={{ 
                color: 'success.main',
                animation: 'fadeIn 0.5s',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 }
                }
              }} 
            />
          </Tooltip>
        );
      case 'delivered':
        return (
          <Tooltip title="Жеткізілді" arrow>
            <CheckIcon 
              fontSize="small" 
              sx={{ color: 'primary.main' }} 
            />
          </Tooltip>
        );
      case 'sending':
        return (
          <Tooltip title="Жіберілуде" arrow>
            <AccessTimeIcon 
              fontSize="small" 
              sx={{ 
                color: 'text.secondary',
                animation: 'rotating 2s linear infinite',
                '@keyframes rotating': {
                  from: { transform: 'rotate(0deg)' },
                  to: { transform: 'rotate(360deg)' }
                }
              }} 
            />
          </Tooltip>
        );
      case 'error':
        return (
          <Tooltip title="Жіберу қатесі" arrow>
            <ErrorIcon 
              fontSize="small" 
              sx={{ color: 'error.main' }} 
            />
          </Tooltip>
        );
      default:
        return (
          <Tooltip title="Жіберілді" arrow>
            <CheckIcon 
              fontSize="small" 
              sx={{ color: 'text.secondary' }} 
            />
          </Tooltip>
        );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUserMessage ? 'row-reverse' : 'row',
        mb: 1.5,
        maxWidth: '90%',
        alignSelf: isUserMessage ? 'flex-end' : 'flex-start',
      }}
    >
      {/* Жіберуші аватары */}
      {!isUserMessage && (
        <Avatar
          sx={{
            bgcolor: avatarColor,
            width: 38,
            height: 38,
            mr: 1,
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {avatarLetter}
        </Avatar>
      )}
      
      <Box sx={{ maxWidth: '100%' }}>
        {/* Жіберуші аты (тек басқалардың хабарламалары үшін көрсетіледі) */}
        {!isUserMessage && (
          <Typography 
            variant="caption" 
            sx={{ 
              ml: 1, 
              mb: 0.5, 
              fontWeight: 'medium',
              display: 'block',
              color: 'text.secondary'
            }}
          >
            {senderName}
          </Typography>
        )}
        
        {/* Хабарлама мазмұны */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: isUserMessage ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            bgcolor: isUserMessage ? 'primary.main' : 'background.default',
            color: isUserMessage ? 'white' : 'text.primary',
            maxWidth: isMobile ? '85vw' : '450px',
            boxShadow: isUserMessage 
              ? '0 4px 15px rgba(25, 118, 210, 0.2)' 
              : '0 4px 15px rgba(0, 0, 0, 0.05)',
            wordBreak: 'break-word',
            position: 'relative'
          }}
        >
          {/* Хабарлама мәтіні */}
          <Typography variant="body1">
            {content}
          </Typography>
          
          {/* Тіркемелер, егер бар болса */}
          {attachments && attachments.length > 0 && (
            <Box sx={{ mt: 1.5 }}>
              {attachments.map((attachment, index) => {
                const fileId = attachment.id || index;
                const fileName = attachment.file_name || attachment.filename || 'Файл';
                const fileUrl = attachment.url || attachment._url || '';
                
                return (
                  <Box
                    key={fileId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      mt: 1,
                      bgcolor: isUserMessage ? 'rgba(255,255,255,0.1)' : 'background.paper',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: isUserMessage ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)'
                      }
                    }}
                    onClick={() => onOpenAttachment && onOpenAttachment(attachment)}
                  >
                    {getAttachmentIcon(attachment)}
                    
                    <Box sx={{ ml: 1, flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        noWrap
                        sx={{ 
                          color: isUserMessage ? 'white' : 'text.primary',
                          maxWidth: '180px',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                      >
                        {fileName}
                      </Typography>
                    </Box>
                    
                    {fileUrl && (
                      <Tooltip title="Жүктеу" arrow>
                        <IconButton
                          size="small"
                          component="a"
                          href={fileUrl}
                          download={fileName}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          sx={{ 
                            color: isUserMessage ? 'white' : 'primary.main',
                            '&:hover': { 
                              bgcolor: isUserMessage ? 'rgba(255,255,255,0.2)' : 'rgba(25,118,210,0.1)'
                            }
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
          
          {/* Хабарлама күйі мен уақыты */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end',
              mt: 1,
              opacity: 0.8
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.7rem',
                color: isUserMessage ? 'white' : 'text.secondary',
                mr: isUserMessage ? 0.5 : 0
              }}
            >
              {formatDate(created_at, 'HH:mm')}
            </Typography>
            
            {renderStatusIndicator()}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MessageItem;