// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Chip,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { ticketsApi } from '../api/tickets';
import { formatDate } from '../utils/dateUtils';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [requester, setRequester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных о тикете
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ticketsApi.getTicketById(id);
        
        if (response.ticket) {
          setTicket(response.ticket);
          
          // Если есть данные о заявителе, сохраняем их
          if (response.ticket.requester) {
            setRequester(response.ticket.requester);
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке тикета:', err);
        
        if (err.status === 404) {
          setError('Заявка не найдена. Проверьте номер заявки или создайте новую.');
        } else {
          setError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchTicketData();
    }
  }, [id]);
  
  // Обработчик кнопки "Назад"
  const handleBack = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Загрузка данных...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Вернуться назад
        </Button>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="warning">
          Заявка не найдена или данные еще не загружены
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Вернуться назад
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Навигационные хлебные крошки */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/" underline="hover">
          Главная
        </Link>
        <Typography color="text.primary">Чат по заявке #{id}</Typography>
      </Breadcrumbs>
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Назад
        </Button>
        <Typography variant="h5" component="h1">
          Чат по заявке #{id}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Информация о заявителе (если есть) */}
        {requester && (
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Информация о заявителе
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    {requester.full_name}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">
                    {requester.email}
                  </Typography>
                </Box>
                
                {requester.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {requester.phone}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
            
            {/* Информация о заявке */}
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Информация о заявке
                </Typography>
                
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {ticket.subject}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  {ticket.description}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="body2" color="text.secondary">
                  <strong>Дата создания:</strong> {formatDate(ticket.created_at)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  <strong>Статус:</strong> {ticket.status === 'new' ? 'Новая' : 
                                         ticket.status === 'in_progress' ? 'В работе' : 
                                         ticket.status === 'resolved' ? 'Решена' : 
                                         ticket.status === 'closed' ? 'Закрыта' : 
                                         ticket.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Чат с поддержкой */}
        <Grid item xs={12} md={requester ? 8 : 12}>
          <ChatWindow 
            ticketId={id} 
            userEmail={requester?.email}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPage;