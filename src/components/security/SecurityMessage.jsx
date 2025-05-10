import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Button,
  Fade,
  Grow,
  Divider
} from '@mui/material';
import { 
  Security as SecurityIcon,
  ArrowBack as ArrowBackIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

/**
 * Компонент для отображения сообщения безопасности
 * Этот экран показывается при попытке прямого доступа к странице успешной отправки
 * 
 * @returns {JSX.Element}
 */
const SecurityMessage = () => {
  // Анимация состояния
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Задержка для плавного появления контента
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Fade in={true} timeout={800}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Декоративные элементы */}
          <Box 
            sx={{ 
              position: 'absolute', 
              top: -100, 
              right: -100, 
              width: 250, 
              height: 250, 
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #304ffe 0%, #3f51b5 100%)',
              opacity: 0.07,
              zIndex: 0
            }} 
          />

          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: -80, 
              left: -80, 
              width: 200, 
              height: 200, 
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
              opacity: 0.06,
              zIndex: 0
            }} 
          />
          
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Grow in={showContent} timeout={1000}>
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  p: 2.5,
                  mb: 3,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #304ffe 0%, #3f51b5 90%)',
                  boxShadow: '0 4px 15px rgba(63, 81, 181, 0.25)'
                }}
              >
                <SecurityIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </Grow>
            
            <Fade in={showContent} timeout={1200}>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #304ffe 30%, #536dfe 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                Сіздің пікіріңіз біз үшін маңызды
              </Typography>
            </Fade>
            
            <Fade in={showContent} timeout={1500}>
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom paragraph>
                  Біз ыңғайлы жұмыс ортасын құруға және процестерді үнемі жетілдіруге тырысамыз.
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <ShieldIcon color="primary" sx={{ fontSize: 28, mr: 1.5, opacity: 0.7 }} />
                  <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'medium' }}>
                    Сіздің деректеріңіздің қауіпсіздігі - біздің басымдығымыз
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    py: 3, 
                    px: 4, 
                    mb: 4, 
                    bgcolor: 'rgba(63, 81, 181, 0.04)', 
                    borderRadius: 2,
                    border: '1px solid rgba(63, 81, 181, 0.12)'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    paragraph 
                    align="center"
                    sx={{ mb: 0 }}
                  >
                    Қауіпсіздік мақсатында бұл бетке тікелей кіруге тыйым салынған. Өтініш жасау үшін біздің басты бетімізге өтіңіз.
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/"
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    py: 1.2,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #304ffe 30%, #536dfe 90%)',
                    boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 15px rgba(63, 81, 181, 0.4)',
                      background: 'linear-gradient(45deg, #283593 30%, #3949ab 90%)',
                    }
                  }}
                >
                  Басты бетке өту
                </Button>
              </Box>
            </Fade>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default SecurityMessage; 