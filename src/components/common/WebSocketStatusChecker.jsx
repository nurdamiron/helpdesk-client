// src/components/common/WebSocketStatusChecker.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip, Badge } from '@mui/material';
import { Sync as SyncIcon, CheckCircle, Warning } from '@mui/icons-material';
import wsService from '../../services/WebSocketService';

/**
 * Component to check and display WebSocket connection status
 * Can be used in headers or status areas to show connection state
 */
const WebSocketStatusChecker = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date());
  
  // Initialize userId - in a real app, get this from authentication
  const userId = localStorage.getItem('userId') || '1';
  
  useEffect(() => {
    // Initialize WebSocket with minimal connection to check status
    const wsInit = () => {
      wsService.init(userId, 'requester');
    };
    
    // Only initialize if not already connected
    if (!wsService.isConnected) {
      wsInit();
    }
    
    // Subscribe to connection status changes
    const unsubscribe = wsService.subscribeToConnectionStatus(status => {
      setIsConnected(status);
      setLastChecked(new Date());
    });
    
    return () => {
      unsubscribe();
      // Don't disconnect here as other components might be using the connection
    };
  }, [userId]);
  
  // Handler for manual reconnection
  const handleReconnect = () => {
    wsService.disconnect();
    setTimeout(() => {
      wsService.init(userId, 'requester');
      setLastChecked(new Date());
    }, 500);
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title={`WebSocket ${isConnected ? 'подключен' : 'отключен'}`}>
        <Badge
          color={isConnected ? 'success' : 'error'}
          variant="dot"
          sx={{ mr: 1 }}
        >
          {isConnected ? 
            <CheckCircle fontSize="small" color="success" /> : 
            <Warning fontSize="small" color="error" />
          }
        </Badge>
      </Tooltip>
      
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Typography variant="caption" color="text.secondary">
          {isConnected ? 'Онлайн' : 'Офлайн'}
        </Typography>
      </Box>
      
      <Tooltip title="Проверить соединение">
        <IconButton size="small" onClick={handleReconnect} sx={{ ml: 0.5 }}>
          <SyncIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default WebSocketStatusChecker;