import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';

const EmailRedirect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to ticket page after a brief delay
    const timer = setTimeout(() => {
      navigate(`/tickets/${id}`);
    }, 1500);

    return () => clearTimeout(timer);
  }, [id, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <CircularProgress />
      <Typography variant="h6" mt={2}>
        Перенаправление к заявке #{id}...
      </Typography>
    </Box>
  );
};

export default EmailRedirect;