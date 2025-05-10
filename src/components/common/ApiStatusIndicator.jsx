// src/components/common/ApiStatusIndicator.jsx
import React, { useState, useEffect } from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import apiService from '../../api/index';

const ApiStatusIndicator = () => {
  const [apiStatus, setApiStatus] = useState({
    isHealthy: undefined,
    message: 'API күйі тексерілуде...'
  });

  const checkApiStatus = async () => {
    try {
      const status = await apiService.checkApiHealth();
      setApiStatus({
        isHealthy: status.isHealthy,
        message: status.isHealthy 
          ? 'API сервері қосылған' 
          : `API сервері өшірілген: ${status.error?.message}`
      });
    } catch (error) {
      setApiStatus({
        isHealthy: false,
        message: `API күйін тексеру мүмкін болмады: ${error.message}`
      });
    }
  };

  useEffect(() => {
    checkApiStatus();
    // 30 секунд сайын тексеру
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tooltip title={apiStatus.message}>
      <IconButton size="small" onClick={checkApiStatus}>
        {apiStatus.isHealthy === undefined ? (
          <Box sx={{ width: 20, height: 20, bgcolor: 'grey.500', borderRadius: '50%' }} />
        ) : apiStatus.isHealthy ? (
          <CheckCircleIcon color="success" />
        ) : (
          <ErrorIcon color="error" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ApiStatusIndicator;