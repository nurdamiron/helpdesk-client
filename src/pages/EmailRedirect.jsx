// src/pages/EmailRedirect.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

/**
 * Component for redirecting from email links to the appropriate page
 * This handles links from email notifications and redirects to the chat page
 */
const EmailRedirect = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // We'll redirect after a small delay to show the loading indicator
    const timer = setTimeout(() => {
      if (type === 'ticket') {
        // For ticket links, redirect to the chat page
        navigate(`/chat/${id}`);
      } else {
        // Default fallback is to the ticket detail page
        navigate(`/tickets/${id}`);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [type, id, navigate]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <CircularProgress size={60} />
      </Box>
      <Typography variant="h5" gutterBottom>
        Перенаправление...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Вы будете перенаправлены на страницу чата для заявки #{id}
      </Typography>
    </Container>
  );
};

export default EmailRedirect;