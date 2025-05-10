// src/components/ticket/form-steps/SuccessMessage.jsx - Сәтті аяқталу экраны
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  Link,
  Grow,
  Zoom,
  Fade
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { formatDate } from '../../../utils/dateUtils';

/**
 * Өтініш сәтті құрылғаны туралы хабарлама компоненті
 * 
 * @param {Object} ticket - Құрылған өтініш деректері
 * @param {string} email - Растау хабарламасы жіберілген email
 * @param {Function} onCreateNew - Жаңа өтініш құру үшін өңдеуші
 * @param {boolean} emailSent - Email жіберу мәртебесі
 */
const SuccessMessage = ({ ticket, email, onCreateNew, emailSent = null }) => {
  // Анимация состояния
  const [showIcon, setShowIcon] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Последовательная анимация появления элементов
    const iconTimer = setTimeout(() => setShowIcon(true), 300);
    const contentTimer = setTimeout(() => setShowContent(true), 800);
    const buttonsTimer = setTimeout(() => setShowButtons(true), 1300);

    return () => {
      clearTimeout(iconTimer);
      clearTimeout(contentTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  // Өтінішті қарау үшін URL алу
  const ticketUrl = `/tickets/${ticket.id}`;

  // Басымдықтың аударылған мәтіндері үшін маппинг
  const getPriorityText = (priority) => {
    switch(priority) {
      case 'low': return 'Төмен';
      case 'medium': return 'Орташа';
      case 'high': return 'Жоғары';
      case 'urgent': return 'Шұғыл';
      default: return priority;
    }
  };

  // Күтілетін өңдеу уақыты үшін маппинг
  const getExpectedTimeText = (priority) => {
    switch(priority) {
      case 'urgent': return '2 сағат ішінде';
      case 'high': return 'Жұмыс күні ішінде';
      case 'medium': return '2 жұмыс күні ішінде';
      default: return '3-5 жұмыс күні ішінде';
    }
  };

  // Приоритету соответствует цвет
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low': return 'success.main';
      case 'medium': return 'info.main';
      case 'high': return 'warning.main';
      case 'urgent': return 'error.main';
      default: return 'text.primary';
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        maxWidth: 800, 
        mx: 'auto', 
        mt: 4,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Фоновый декоративный элемент */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -80, 
          right: -80, 
          width: 200, 
          height: 200, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
          opacity: 0.1,
          zIndex: 0
        }} 
      />
      
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
        <Zoom in={showIcon} timeout={800}>
          <Box sx={{ 
            display: 'inline-flex',
            p: 2,
            borderRadius: '50%',
            boxShadow: '0 0 15px rgba(0, 200, 83, 0.4)',
            background: 'linear-gradient(135deg, #00c853 0%, #00796b 100%)',
            mb: 3
          }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: 'white' }} />
          </Box>
        </Zoom>
        
        <Fade in={showIcon} timeout={1000}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            Өтініш қабылданды
          </Typography>
        </Fade>
        
        <Fade in={showIcon} timeout={1200}>
          <Typography variant="h6" color="text.secondary">
            Сіздің <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>#{ticket.id}</Box> өтінішіңіз сәтті тіркелді
          </Typography>
        </Fade>
      </Box>
      
      <Grow in={showContent} timeout={800}>
        <Box>
          {emailSent === false ? (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 4, 
                borderRadius: 2,
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 6px rgba(255, 152, 0, 0.2)'
              }}
              icon={<EmailIcon sx={{ fontSize: 28 }} />}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  Техникалық себептерге байланысты электрондық пошта хабарламасын жіберу мүмкін болмады
                </Typography>
                <Typography variant="body2">
                  Email: <strong>{email}</strong>. Бірақ сіздің өтінішіңіз сәтті тіркелді.
                </Typography>
              </Box>
            </Alert>
          ) : (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 4, 
                borderRadius: 2,
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 6px rgba(76, 175, 80, 0.2)'
              }}
              icon={<EmailIcon sx={{ fontSize: 28 }} />}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  Хабарлама сіздің email адресіңізге жіберілді
                </Typography>
                <Typography variant="body2">
                  Email: <strong>{email}</strong>
                </Typography>
              </Box>
            </Alert>
          )}
          
          <Card variant="outlined" sx={{ 
            mb: 4,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', 
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: 'text.primary'
              }}>
                Өтініш туралы ақпарат
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {ticket.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.description}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ py: 0.5 }}>
                  <Box component="span" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Өтініш нөмірі:</Box>{' '}
                  <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>#{ticket.id}</Box>
                </Typography>
                
                <Typography variant="body2" sx={{ py: 0.5 }}>
                  <Box component="span" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Құрылған күні:</Box>{' '}
                  {formatDate(ticket.created_at)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mt: 1 }}>
                <Typography variant="body2" sx={{ 
                  py: 0.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1.5,
                  borderRadius: 10,
                  bgcolor: 'info.lighter',
                  color: 'info.darker'
                }}>
                  <Box component="span" sx={{ fontWeight: 'medium' }}>Күйі:</Box>{' '}
                  <Box component="span" sx={{ ml: 0.5, fontWeight: 'bold' }}>Ашық</Box>
                </Typography>
                
                <Typography variant="body2" sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 10,
                  bgcolor: `${getPriorityColor(ticket.priority)}15`,
                  color: getPriorityColor(ticket.priority)
                }}>
                  <Box component="span" sx={{ fontWeight: 'medium' }}>Басымдық:</Box>{' '}
                  <Box component="span" sx={{ ml: 0.5, fontWeight: 'bold' }}>{getPriorityText(ticket.priority)}</Box>
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            mt: 3, 
            mb: 4,
            p: 0,
            borderRadius: 2,
            background: 'linear-gradient(120deg, #f5f7fa 0%, #e5eef9 100%)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1.5,
                borderRadius: '50%',
                bgcolor: 'warning.lighter',
                mr: 2 
              }}>
                <AccessTimeIcon sx={{ color: 'warning.main', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="text.primary">
                  Күтілетін өңдеу уақыты
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight="medium">
                  {getExpectedTimeText(ticket.priority)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grow>
      
      <Fade in={showContent} timeout={1000}>
        <Typography 
          variant="body1" 
          paragraph 
          align="center" 
          sx={{ 
            mt: 2, 
            px: 2, 
            py: 1, 
            borderRadius: 2, 
            bgcolor: 'background.paper',
            fontStyle: 'italic',
            color: 'text.secondary'
          }}
        >
          Жауапты қызметкер сіздің өтінішіңізді қарастырып, қажет болған жағдайда сізбен байланысады.
        </Typography>
      </Fade>
      
      <Grow in={showButtons} timeout={800}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2, 
          mt: 4,
          position: 'relative',
          zIndex: 1
        }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href={ticketUrl}
            startIcon={<HomeIcon />}
            sx={{ 
              py: 1.2,
              px: 3,
              borderRadius: 2,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
              boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #303f9f 30%, #1976d2 90%)',
                boxShadow: '0 6px 12px rgba(33, 150, 243, 0.4)',
              }
            }}
          >
            Өтінішке өту
          </Button>
          
          <Button
            variant="outlined"
            onClick={onCreateNew}
            startIcon={<RefreshIcon />}
            sx={{ 
              py: 1.2,
              px: 3,
              borderRadius: 2,
              fontWeight: 'bold',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                background: 'rgba(63, 81, 181, 0.04)'
              }
            }}
          >
            Жаңа өтініш құру
          </Button>
        </Box>
      </Grow>

      {/* Декоративный элемент снизу */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: -80, 
          left: -80, 
          width: 200, 
          height: 200, 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
          opacity: 0.1,
          zIndex: 0
        }} 
      />
    </Paper>
  );
};

export default SuccessMessage;