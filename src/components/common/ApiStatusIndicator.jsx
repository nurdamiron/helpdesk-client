// src/components/common/ApiStatusIndicator.jsx
import React, { useState, useEffect } from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import apiService from '../../api/index';

const ApiStatusIndicator = () => {
  const [apiStatus, setApiStatus] = useState({
    isHealthy: undefined,
    message: 'Checking API status...'
  });

  const checkApiStatus = async () => {
    try {
      const status = await apiService.checkApiHealth();
      setApiStatus({
        isHealthy: status.isHealthy,
        message: status.isHealthy 
          ? 'API server is online' 
          : `API server is offline: ${status.error?.message}`
      });
    } catch (error) {
      setApiStatus({
        isHealthy: false,
        message: `Failed to check API status: ${error.message}`
      });
    }
  };

  useEffect(() => {
    checkApiStatus();
    // Check every 30 seconds
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