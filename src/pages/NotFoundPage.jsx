// src/pages/NotFoundPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Construction as ConstructionIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  // 10 секундтан кейін басты бетке автоматты түрде бағыттау
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);
    
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#f8f9fa'
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <ConstructionIcon color="warning" sx={{ fontSize: 100 }} />
        </Box>
        
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Бет табылмады
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Сіз жылжытылған немесе жоқ бетке кіруге тырысып жатқан сияқтысыз.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/"
          startIcon={<ArrowBackIcon />}
          size="large"
          sx={{ mb: 2 }}
        >
          Басты бетке оралу
        </Button>
        
        <Typography variant="body2" color="text.secondary">
          Сіз {countdown} секундтан кейін басты бетке автоматты түрде бағытталасыз.
        </Typography>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;