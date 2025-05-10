// src/pages/TicketDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Link,
  useTheme,
  useMediaQuery,
  IconButton,
  Badge,
  Fade,
  Slide,
  Grow,
  Modal,
  Tooltip
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
  AspectRatio as AreaIcon,
  AccessTime as TimeIcon,
  Info as InfoIcon,
  Speed as SpeedIcon,
  Category as CategoryIcon,
  AutorenewRounded as RefreshIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon
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

// Функция для получения типов недвижимости на казахском
const formatPropertyTypeKz = (propertyType) => {
  const propertyTypeMap = {
    'apartment': 'Пәтер',
    'house': 'Жеке үй',
    'office': 'Кеңсе',
    'commercial': 'Коммерциялық үй-жай',
    'land': 'Жер учаскесі',
    'other': 'Басқа'
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
  const [refreshing, setRefreshing] = useState(false);
  const [openRequesterModal, setOpenRequesterModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

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

  // Функция для обновления данных о тикете
  const refreshTicketData = async () => {
    if (refreshing) return;
    
    try {
      setRefreshing(true);
      const response = await ticketsApi.getTicketById(id);
      
      if (response.ticket) {
        setTicket(response.ticket);
        
        if (response.ticket.requester) {
          setRequester(response.ticket.requester);
        }
      }
    } catch (err) {
      console.error('Ошибка при обновлении данных тикета:', err);
    } finally {
      setRefreshing(false);
    }
  };

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

  // Функция для получения цвета приоритета
  const getPriorityColor = (priority) => {
    const colorMap = {
      'low': '#4caf50',
      'medium': '#2196f3',
      'high': '#ff9800',
      'urgent': '#f44336'
    };
    return colorMap[priority] || '#757575';
  };

  // Функция для получения текста категории на русском языке
  const getCategoryText = (category) => {
    const categoryMap = {
      'repair': 'Ремонт',
      'construction': 'Строительство',
      'design': 'Проектирование',
      'consultation': 'Консультация',
      'other': 'Другое',
      'it': 'IT поддержка'
    };
    return categoryMap[category] || category;
  };
  
  // Функция для получения текста статуса на казахском языке
  const getStatusTextKz = (status) => {
    const statusMap = {
      'new': 'Жаңа',
      'open': 'Ашық',
      'in_progress': 'Жұмыс барысында',
      'pending': 'Жауап күтуде',
      'resolved': 'Шешілді',
      'closed': 'Жабылған'
    };
    return statusMap[status] || status;
  };

  // Функция для получения текста приоритета на казахском языке
  const getPriorityTextKz = (priority) => {
    const priorityMap = {
      'low': 'Төмен',
      'medium': 'Орташа',
      'high': 'Жоғары',
      'urgent': 'Шұғыл'
    };
    return priorityMap[priority] || priority;
  };

  // Функция для получения текста категории на казахском языке
  const getCategoryTextKz = (category) => {
    const categoryMap = {
      'repair': 'Жөндеу',
      'construction': 'Құрылыс',
      'design': 'Жобалау',
      'consultation': 'Кеңес беру',
      'other': 'Басқа',
      'it': 'IT қолдау'
    };
    return categoryMap[category] || category;
  };
  
  // Обработчик кнопки "Назад"
  const handleBack = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  // Обработчики для модального окна с информацией о заявителе
  const handleOpenRequesterModal = () => {
    setOpenRequesterModal(true);
  };

  const handleCloseRequesterModal = () => {
    setOpenRequesterModal(false);
  };

  // Обработчик закрытия заявки на казахском
  // Өтінішті жабу үшін өңдеуші
  const handleCloseTicket = async () => {
    if (!ticket) {
      alert('Өтініш табылмады!');
      return;
    }
    
    if (!isTicketActionable(ticket.status)) {
      alert('Бұл өтінішті жабу мүмкін емес. Оның статусы: ' + getStatusTextKz(ticket.status));
      return;
    }
    
    try {
      // Жаңартылған API әдісін пайдаланамыз
      const response = await ticketsApi.updateTicketStatus(id, 'closed');
      
      if (response && response.status === 'success') {
        // Обновляем состояние тикета немедленно
        // Өтініш күйін бірден жаңартамыз
        setTicket(prev => ({
          ...prev,
          status: 'closed',
          updated_at: new Date().toISOString()
        }));
        
        // Показываем уведомление об успешном закрытии с более заметным стилем
        // Сәтті жабылғаны туралы көрнекті хабарлама көрсетеміз
        const successMessage = 'ӨТІНІШ СӘТТІ ЖАБЫЛДЫ! Статус: ' + getStatusTextKz('closed');
        alert(successMessage);
        
        // Сразу обновляем данные с сервера
        refreshTicketData();
      } else {
        throw new Error('API статусы: ' + (response?.status || 'белгісіз'));
      }
    } catch (err) {
      console.error('Өтінішті жабу кезінде қате шықты:', err);
      alert('Өтінішті жабу мүмкін болмады. Кейінірек қайталап көріңіз: ' + (err.message || err));
    }
  };

  if (loading) {
    return (
      <Container sx={{ 
        py: 5, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '50vh' 
      }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress size={80} thickness={4} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" component="div" color="text.secondary">
              #{id}
            </Typography>
          </Box>
        </Box>
        <Fade in={true} style={{ transitionDelay: '500ms' }}>
          <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
            Өтініш деректерін жүктеу...
        </Typography>
        </Fade>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
          {error || 'Қате орын алды. Қайталап көріңіз.'}
        </Alert>
        </Slide>
        <Fade in={true} style={{ transitionDelay: '300ms' }}>
        <Button 
            variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
            sx={{ 
              mt: 2,
              borderRadius: 2,
              boxShadow: 2,
              py: 1,
              px: 3
            }}
        >
          Артқа қайту
        </Button>
        </Fade>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container sx={{ py: 5 }}>
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
          Өтініш табылмады немесе деректер әлі жүктелмеген
        </Alert>
        </Slide>
        <Fade in={true} style={{ transitionDelay: '300ms' }}>
        <Button 
            variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
            sx={{ 
              mt: 2,
              borderRadius: 2,
              boxShadow: 2,
              py: 1,
              px: 3
            }}
        >
          Артқа қайту
        </Button>
        </Fade>
      </Container>
    );
  }

  // Нысан туралы деректерді алу (Извлечение данных о свойстве объекта)
  const propertyInfo = ticket.metadata?.property || {
    type: ticket.property_type,
    address: ticket.property_address,
    area: ticket.property_area
  };

  // Өтініш беруші туралы ақпаратты көрсететін модальдық терезе
  const requesterModalContent = (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '90%' : 500,
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: '16px',
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
        <PersonIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
        Өтініш беруші туралы ақпарат
      </Typography>
      
      <IconButton
        aria-label="жабу"
        onClick={handleCloseRequesterModal}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'grey.500',
        }}
      >
        <CloseIcon />
      </IconButton>
      
      <Divider sx={{ mb: 3 }} />
      
      {ticket.metadata?.employee && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.light',
                  color: 'white',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  mr: 2,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <PersonIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Толық аты
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {ticket.metadata.employee.full_name || 'Көрсетілмеген'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'info.light',
                  color: 'white',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  mr: 2,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <EmailIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {ticket.metadata.employee.email || 'Көрсетілмеген'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {ticket.metadata.employee.phone && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'success.light',
                    color: 'white',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    mr: 2,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  <PhoneIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Телефон
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {ticket.metadata.employee.phone}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {ticket.metadata.employee.department && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'warning.light',
                    color: 'white',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    mr: 2,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  <HomeIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Бөлім
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {ticket.metadata.employee.department}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {ticket.metadata.employee.position && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'secondary.light',
                    color: 'white',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    mr: 2,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Лауазымы
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {ticket.metadata.employee.position}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {ticket.metadata.employee.preferred_contact && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Таңдаулы байланыс тәсілі: 
                <Box 
                  component="span" 
                  sx={{ 
                    fontWeight: 'bold', 
                    ml: 1,
                    color: 'primary.main' 
                  }}
                >
                  {ticket.metadata.employee.preferred_contact === 'email' ? 'Email' : 'Телефон'}
                </Box>
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Навигационные хлебные крошки */}
      <Breadcrumbs 
        separator={<ChevronRightIcon fontSize="small" />} 
        sx={{ 
          mb: 4, 
          color: 'text.secondary',
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5
          }
        }}
      >
        <Link 
          component={RouterLink} 
          to="/" 
          color="inherit" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Басты бет
        </Link>
        <Link 
          component={RouterLink} 
          to="/" 
          color="inherit"
          sx={{ 
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          Өтініштер
        </Link>
        <Typography color="text.primary">Өтініш №{id}</Typography>
      </Breadcrumbs>
      
      {/* Яркий статус заявки в верхней части страницы */}
      {ticket && ticket.status === 'closed' && (
        <Fade in={true} timeout={800}>
          <Alert 
            severity="success" 
            variant="filled"
            sx={{ 
              mb: 3, 
              borderRadius: 2, 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
            }}
          >
            ӨТІНІШ ЖАБЫЛҒАН | {getStatusTextKz(ticket.status)} | {formatDate(ticket.updated_at)}
          </Alert>
        </Fade>
      )}
      
      {/* Дополнительная информация о закрытой заявке */}
      {ticket && ticket.status === 'closed' && (
        <Grow in={true} timeout={1000}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: '16px',
              borderLeft: '8px solid #4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.08)',
              borderColor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                  Өтініш сәтті жабылды
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Жабылған күні: {formatDate(ticket.updated_at)}
                </Typography>
              </Box>
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary"
              component={RouterLink}
              to="/"
              sx={{ 
                borderRadius: '12px',
                px: 3,
                py: 1
              }}
            >
              Жаңа өтініш құру
            </Button>
          </Paper>
        </Grow>
      )}
      
      {/* Верхняя панель с навигацией и заголовком */}
      <Slide direction="down" in={true} timeout={500}>
        <Box 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
              sx={{ 
                mr: 2,
                borderRadius: '12px',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateX(-5px)',
                  boxShadow: 1
                }
              }}
        >
          Артқа
        </Button>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="h1"
              sx={{ fontWeight: 600 }}
            >
          Өтініш #{id}
        </Typography>
      </Box>
      
          <IconButton 
            color="primary" 
            onClick={refreshTicketData}
            sx={{ 
              borderRadius: '12px',
              p: 1,
              transition: 'transform 0.3s',
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
            disabled={refreshing}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Slide>
      
      {/* Основной контент */}
      <Grid container spacing={3}>
        {/* Информация о заявке */}
        <Grid item xs={12} md={5}>
          <Fade in={true} timeout={800}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: '16px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
                }
              }}
            >
              {/* Фоновый декоративный элемент → Сәндік фондық элемент */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -30, 
                  right: -30, 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(25,118,210,0.08) 0%, rgba(33,150,243,0) 70%)',
                  zIndex: 0
                }} 
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, position: 'relative', zIndex: 1 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ mr: 1, color: 'primary.main', fontSize: 24 }} />
                Өтініш туралы ақпарат
              </Typography>
              <Chip 
                label={getStatusTextKz(ticket.status)} 
                color={getStatusColor(ticket.status)}
                  sx={{ 
                    fontWeight: 'bold',
                    px: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    animation: ticket.status === 'in_progress' ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0.4)' },
                      '70%': { boxShadow: '0 0 0 10px rgba(156, 39, 176, 0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0)' }
                    }
                  }}
              />
            </Box>
            
              <Divider sx={{ mb: 2 }} />
              
              <Typography 
                variant="h5" 
                component="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  position: 'relative',
                  zIndex: 1
                }}
              >
              {ticket.subject}
            </Typography>
            
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  color: 'text.secondary',
                  position: 'relative',
                  zIndex: 1
                }}
              >
              {ticket.description}
            </Typography>
            
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Chip 
                  icon={<CategoryIcon fontSize="small" />} 
                  label={getCategoryTextKz(ticket.category)} 
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    color: 'primary.main',
                    '& .MuiChip-icon': {
                      color: 'primary.main'
                    }
                  }}
                />
                
                <Chip 
                  icon={<SpeedIcon fontSize="small" />} 
                  label={getPriorityTextKz(ticket.priority)}
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: `${getPriorityColor(ticket.priority)}1A`,
                    color: getPriorityColor(ticket.priority),
                    '& .MuiChip-icon': {
                      color: getPriorityColor(ticket.priority)
                    }
                  }}
                />
              </Box>
              
              <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                    <TimeIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                    <Box component="span" sx={{ fontWeight: 'bold' }}>Құрылған күні:</Box>
                </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {formatDate(ticket.created_at)}
                </Typography>
              </Grid>
                
                <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                    <ScheduleIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                    <Box component="span" sx={{ fontWeight: 'bold' }}>Соңғы жаңарту:</Box>
                </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {formatDate(ticket.updated_at)}
                </Typography>
              </Grid>
                
                {ticket.metadata?.assignee && (
                  <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                      <PersonIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                      <Box component="span" sx={{ fontWeight: 'bold' }}>Тағайындалған:</Box>
                </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {ticket.metadata.assignee.name || ticket.metadata.assignee.email}
                </Typography>
                  </Grid>
                )}
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Басымдылыққа негізделген күтілетін шешу уақыты */}
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                borderRadius: '12px', 
                bgcolor: 'background.default',
                position: 'relative',
                zIndex: 1
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  <ScheduleIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                  Күтілетін өңдеу уақыты:
                </Typography>
                
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'medium' }}>
                  {(() => {
                    switch(ticket.priority) {
                      case 'urgent': return '2 сағат ішінде';
                      case 'high': return 'Жұмыс күні ішінде';
                      case 'medium': return '2 жұмыс күніне дейін';
                      case 'low': return '3-5 жұмыс күні';
                      default: return 'Мәселенің күрделілігіне байланысты';
                    }
                  })()}
                </Typography>
              </Box>
            
              {ticket.status !== 'closed' && (
                <Grow in={true} timeout={1000}>
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleCloseTicket}
                      disabled={!isTicketActionable(ticket.status)}
                      sx={{ 
                        borderRadius: '12px',
                        px: 3,
                        py: 1,
                        transition: 'all 0.3s',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'white',
                          borderColor: 'error.light'
                        }
                      }}
                >
                  Өтінішті жабу
                </Button>
              </Box>
                </Grow>
              )}

              {/* Фоновый декоративный элемент внизу → Төменгі сәндік фондық элемент */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -30, 
                  left: -30, 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(25,118,210,0.08) 0%, rgba(33,150,243,0) 70%)',
                  zIndex: 0
                }} 
              />
            </Paper>
          </Fade>
 
          {/* Өтініштерді өңдеу мерзімдері блогы */}
          <Slide direction="up" in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
            <Paper
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: '16px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1, color: 'primary.main', fontSize: 24 }} />
                Өтініштерді өңдеу мерзімдері:
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'primary.light',
                    color: 'white',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    mr: 2,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(25,118,210,0.4)'
                  }}
                >
                  <TimeIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.primary">
                    Алғашқы өңдеу: 24 сағатқа дейін
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Сіздің өтінішіңіз тексеріліп, маманға тағайындалады
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'secondary.light',
                    color: 'white',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    mr: 2,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(156,39,176,0.4)'
                  }}
                >
                  <TimeIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.primary">
                    Кеңес беру: 1-2 жұмыс күні
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Сіздің сұрағыңыз бойынша кеңес беру қолдауы
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'warning.light',
                    color: 'white',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    mr: 2,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(255,152,0,0.4)'
                  }}
                >
                  <TimeIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.primary">
                    Күрделі сұраулар: 5 жұмыс күніне дейін
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Терең талдау немесе әзірлеуді қажет ететін сұраулар
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Slide>
        </Grid>
        
        {/* Пайдаланушы туралы ақпарат және өтінішті талқылау чаты */}
        <Grid item xs={12} md={7}>
          {/* Чат және өтінішті талқылау */}
          <Grow in={true} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: '16px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  position: 'relative'
                }}
              >
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  Өтінішті талқылау #{id}
                  <Badge 
                    color="error" 
                    variant="dot" 
                    invisible={false}
                    sx={{ 
                      ml: 2,
                      '.MuiBadge-dot': {
                        animation: 'pulse 1.5s infinite'
                      }
                    }}
                  >
                    <Chip 
                      label={ticket.status === 'open' ? 'Онлайн' : 'Офлайн'} 
                      size="small" 
                      sx={{ 
                        backgroundColor: ticket.status === 'open' ? 'success.main' : 'grey.500',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        height: 24
                      }} 
                    />
                  </Badge>
                </Typography>
                
                {ticket.metadata?.employee && (
                  <Tooltip title="Өтініш беруші туралы ақпарат">
                    <IconButton
                      color="inherit"
                      onClick={handleOpenRequesterModal}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          transform: 'scale(1.1)'
                        },
                        transition: 'transform 0.2s, background-color 0.2s',
                        animation: 'pulse-light 1.5s infinite',
                        '@keyframes pulse-light': {
                          '0%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)' },
                          '70%': { boxShadow: '0 0 0 8px rgba(255, 255, 255, 0)' },
                          '100%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' }
                        }
                      }}
                    >
                      <PersonIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <ChatWindow 
                  ticketId={id} 
                  userEmail={ticket.requester_email || ticket.metadata?.employee?.email || ''} 
                />
              </Box>
            </Paper>
          </Grow>

          {propertyInfo && (propertyInfo.type || propertyInfo.address) && (
            <Fade in={true} timeout={1200} style={{ transitionDelay: '600ms' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mt: 3,
                  borderRadius: '16px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1, color: 'primary.main', fontSize: 24 }} />
                    Нысан туралы ақпарат
                  </Typography>
                  
                <Grid container spacing={2}>
                  {propertyInfo.type && (
                    <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'primary.light',
                            color: 'white',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          <HomeIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Нысан түрі
                          </Typography>
                      <Typography variant="body1">
                            {formatPropertyTypeKz(propertyInfo.type)}
                      </Typography>
                    </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {propertyInfo.address && (
                    <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'info.light',
                            color: 'white',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          <LocationIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Мекенжай
                          </Typography>
                      <Typography variant="body1">
                            {propertyInfo.address}
                      </Typography>
                    </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  {propertyInfo.area && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'success.light',
                            color: 'white',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          <AreaIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Аумағы
                          </Typography>
                      <Typography variant="body1">
                            {propertyInfo.area} м²
                      </Typography>
                    </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Fade>
          )}
        </Grid>
      </Grid>
      
      {/* Модальное окно с информацией о заявителе */}
      <Modal
        open={openRequesterModal}
        onClose={handleCloseRequesterModal}
        aria-labelledby="requester-modal-title"
        aria-describedby="requester-modal-description"
      >
        {requesterModalContent}
      </Modal>
    </Container>
  );
};

export default TicketDetailPage;