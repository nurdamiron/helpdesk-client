// src/pages/TicketDetailPage.jsx
import { useState, useEffect } from 'react';
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
  HomeRepairService as RepairIcon,
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  AspectRatio as AreaIcon
} from '@mui/icons-material';
import { ticketsApi } from '../api/tickets';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';
import { isTicketActionable } from '../utils/validationUtils';
// Import formatter utilities or create them inline
const formatPropertyType = (propertyType) => {
  const propertyTypeMap = {
    'apartment': 'Квартира',
    'house': 'Частный дом',
    'office': 'Офис',
    'commercial': 'Коммерческое помещение',
    'land': 'Земельный участок',
    'other': 'Другое'
  };
  
  return propertyTypeMap[propertyType] || propertyType;
};
import ChatWindow from '../components/chat/ChatWindow';

const TicketDetailPage = () => {
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

  // Функция для получения текста статуса на русском языке
  const getStatusText = (status) => {
    const statusMap = {
      'new': 'Новая',
      'open': 'Открыта',
      'in_progress': 'В работе',
      'pending': 'Ожидает ответа',
      'resolved': 'Решена',
      'closed': 'Закрыта'
    };
    return statusMap[status] || status;
  };

  // Функция для получения цвета статуса
  const getStatusColor = (status) => {
    const colorMap = {
      'new': 'info',
      'open': 'primary',
      'in_progress': 'secondary',
      'pending': 'warning',
      'resolved': 'success',
      'closed': 'default'
    };
    return colorMap[status] || 'default';
  };

  // Функция для получения текста приоритета на русском языке
  const getPriorityText = (priority) => {
    const priorityMap = {
      'low': 'Низкий',
      'medium': 'Средний',
      'high': 'Высокий',
      'urgent': 'Срочный'
    };
    return priorityMap[priority] || priority;
  };

  // Функция для получения текста категории на русском языке
  const getCategoryText = (category) => {
    const categoryMap = {
      'repair': 'Ремонт',
      'construction': 'Строительство',
      'design': 'Проектирование',
      'consultation': 'Консультация',
      'other': 'Другое'
    };
    return categoryMap[category] || category;
  };
  
  // Обработчик кнопки "Назад"
  const handleBack = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  // Обработчик закрытия заявки
  const handleCloseTicket = async () => {
    if (!ticket || !isTicketActionable(ticket.status)) return;
    
    try {
      await ticketsApi.updateTicketStatus(id, 'closed');
      
      // Обновляем состояние тикета
      setTicket(prev => ({
        ...prev,
        status: 'closed',
        updated_at: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Ошибка при закрытии заявки:', err);
      alert('Не удалось закрыть заявку. Пожалуйста, попробуйте позже.');
    }
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

  // Извлечение данных о свойстве объекта
  const propertyInfo = ticket.metadata?.property || {
    type: ticket.property_type,
    address: ticket.property_address,
    area: ticket.property_area
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Навигационные хлебные крошки */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/" underline="hover">
          Главная
        </Link>
        <Link color="inherit" href="/tickets" underline="hover">
          Заявки
        </Link>
        <Typography color="text.primary">Заявка #{id}</Typography>
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
          Заявка #{id}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Информация о заявке */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Информация о заявке
              </Typography>
              <Chip 
                label={getStatusText(ticket.status)} 
                color={getStatusColor(ticket.status)}
              />
            </Box>
            
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              {ticket.subject}
            </Typography>
            
            <Typography variant="body2" paragraph>
              {ticket.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Категория:
                </Typography>
                <Typography variant="body1">
                  {getCategoryText(ticket.category)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Приоритет:
                </Typography>
                <Typography variant="body1">
                  {getPriorityText(ticket.priority)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Дата создания:
                </Typography>
                <Typography variant="body1">
                  {formatDate(ticket.created_at)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Последнее обновление:
                </Typography>
                <Typography variant="body1">
                  {ticket.updated_at ? formatDate(ticket.updated_at) : 'Нет обновлений'}
                </Typography>
              </Grid>
            </Grid>
            
            {isTicketActionable(ticket.status) && (
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleCloseTicket}
                  fullWidth
                >
                  Закрыть заявку
                </Button>
              </Box>
            )}
          </Paper>
          
          {/* Информация о заявителе и объекте */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Информация о заявителе */}
            {requester && (
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
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
              </Grid>
            )}
            
            {/* Информация об объекте */}
            <Grid item xs={12} sm={requester ? 6 : 12}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    Информация об объекте
                  </Typography>
                  
                  {propertyInfo.type && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        Тип: {formatPropertyType(propertyInfo.type)}
                      </Typography>
                    </Box>
                  )}
                  
                  {propertyInfo.address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        Адрес: {propertyInfo.address}
                      </Typography>
                    </Box>
                  )}
                  
                  {propertyInfo.area && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AreaIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        Площадь: {propertyInfo.area} м²
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Дополнительная информация */}
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Сроки обработки заявок:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2">
                  Первичная обработка: до 24 часов
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2">
                  Консультации: 1-2 рабочих дня
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2">
                  Сложные запросы: до 5 рабочих дней
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Чат с поддержкой */}
        <Grid item xs={12} md={7}>
          <ChatWindow 
            ticketId={id} 
            userEmail={requester?.email}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TicketDetailPage;