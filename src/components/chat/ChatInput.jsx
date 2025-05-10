// src/components/chat/ChatInput.jsx - Чат хабарламаларын енгізу компоненті
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
 * Чатта хабарламаларды енгізу және жіберу компоненті
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
        {/* Файлдарды таңдауға арналған жасырын input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onAttachmentSelect}
          multiple
          disabled={disabled || sending}
        />
        
        {/* Тіркемелерді таңдау түймесі */}
        <IconButton
          color="primary"
          onClick={handleAttachmentClick}
          disabled={disabled || sending}
          sx={{ alignSelf: 'flex-end' }}
        >
          <AttachmentIcon />
        </IconButton>
        
        {/* Хабарлама енгізу өрісі */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Хабарламаңызды жазыңыз..."
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
        
        {/* Жіберу түймесі */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={disabled || sending || !value.trim()}
          endIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          sx={{ alignSelf: 'flex-end', borderRadius: 2, height: 56 }}
        >
          {sending ? "Жіберілуде..." : "Жіберу"}
        </Button>
      </Box>
      
      {/* Байланыс туралы ақпарат */}
      {!isConnected && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          Сервермен байланыс жоқ. Байланыс қалпына келтірілгенде хабарламалар жіберіледі.
        </Typography>
      )}
      
      {/* Email хабарландырулары туралы ақпарат */}
      {userEmail && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Хабарламаның көшірмесі сіздің email-ге жіберіледі: {userEmail}
        </Typography>
      )}
    </Box>
  );
};

export default ChatInput;