// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper,
  useMediaQuery,
  TextField,
  Stack,
  Divider,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  SupportAgent as SupportIcon,
  Feedback as FeedbackIcon,
  Lightbulb as IdeaIcon,
  ChatBubble as ChatIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Send as SendIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import TicketForm from '../components/ticket/TicketForm';
import AnimatedCard from '../components/common/AnimatedCard';
import AnimatedContainer from '../components/common/AnimatedContainer';
import AnimatedButton from '../components/common/AnimatedButton';
import { getSequentialDelay, animatedStyles } from '../utils/animations';

// Компонент с принципами работы
const PrincipleItem = ({ title, description, delay }) => {
  return (
    <AnimatedContainer animation="fade" delay={delay} variant="default">
      <Box 
        sx={{ 
          textAlign: 'center',
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 6px 25px rgba(0,0,0,0.09)',
          }
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontFamily: 'var(--font-family)',
            fontWeight: 'var(--font-weight-semibold)',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: 'primary.main'
            }
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 3,
            fontFamily: 'var(--font-family)',
            fontWeight: 'var(--font-weight-regular)'
          }}
        >
          {description}
        </Typography>
      </Box>
    </AnimatedContainer>
  );
};

// Компонент для карточек категорий работы
const WorkCategoryCard = ({ title, description, delay = 0 }) => {
  return (
    <AnimatedContainer animation="fade" delay={delay} variant="default">
      <Box 
        sx={{ 
          textAlign: 'center', 
          p: 3,
          height: '100%',
          transition: 'all 0.3s ease',
          borderBottom: '3px solid',
          borderColor: 'primary.main',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-5px)',
          }
        }}
      >
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'var(--font-family)',
            mb: 2,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: '30px',
              height: '2px',
              backgroundColor: 'primary.main',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)'
            }
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            fontFamily: 'var(--font-family)',
            fontWeight: 'var(--font-weight-regular)'
          }}
        >
          {description}
        </Typography>
      </Box>
    </AnimatedContainer>
  );
};

const HomePage = () => {
  const [showTicketForm, setShowTicketForm] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [ticketIdError, setTicketIdError] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0 - Создать заявку, 1 - Найти заявку
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Анимация появления элементов при загрузке
  useEffect(() => {
    setIsVisible(true);
    // Убедимся, что форма отображается при загрузке страницы
    setShowTicketForm(true);
  }, []);

  // Плавный скролл к форме
  const scrollToForm = () => {
    // Если форма уже отображается, просто скроллим к ней
    if (!showTicketForm) {
      setShowTicketForm(true);
    }
    setTimeout(() => {
      const formElement = document.getElementById('ticket-form-section');
      if (formElement) {
        formElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Обработчик успешной отправки заявки
  const handleSubmitSuccess = (ticket) => {
    // Перенаправляем на страницу успеха с данными о заявке
    navigate(`/success/${ticket.id}`, { 
      state: { 
        ticket,
        authorized: true,
        emailSent: ticket.email_sent 
      }
    });
  };

  // Обработчик поиска заявки по ID
  const handleFindTicket = () => {
    if (!ticketId.trim()) {
      setTicketIdError('Введите ID заявки');
      return;
    }
    
    // Проверяем, что ID состоит только из цифр
    if (!/^\d+$/.test(ticketId)) {
      setTicketIdError('ID заявки должен содержать только цифры');
      return;
    }
    
    setTicketIdError('');
    navigate(`/tickets/${ticketId}`);
  };

  // Обработчик изменения ID заявки
  const handleTicketIdChange = (e) => {
    setTicketId(e.target.value);
    if (ticketIdError) setTicketIdError('');
  };

  // Обработчик переключения вкладок
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Данные для карточек сервисов
  const serviceCards = [
    {
      title: "Сұраныстар",
      description: "Ақпарат алу, қол жеткізу, көмеk немесе басқа ресурстар бойынша сұраныстар.",
      icon: <SupportIcon sx={{ fontSize: 40 }} />
    },
    {
      title: "Шағымдар",
      description: "Жұмыс мәселелері бойынша проблемалар немесе қанағаттанбаушылық туралы хабарлау.",
      icon: <FeedbackIcon sx={{ fontSize: 40 }} />
    },
    {
      title: "Ұсыныстар",
      description: "Жұмыс процестері мен еңбек жағдайларын жақсарту бойынша идеялар.",
      icon: <IdeaIcon sx={{ fontSize: 40 }} />
    },
    {
      title: "Кері байланыс",
      description: "Пікір алмасу және компания басшылығына арналған хабарламалар.",
      icon: <ChatIcon sx={{ fontSize: 40 }} />
    }
  ];

  return (
    <Box>
      {/* Hero Section с градиентным фоном и анимацией */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'primary.contrastText',
          py: { xs: 6, md: 10 },
          mb: 6,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <AnimatedContainer animation="fade" variant="default">
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'var(--font-weight-bold)',
                fontFamily: 'var(--font-family)',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } 
              }}
            >
              Ішкі өтініштер порталы
            </Typography>
          </AnimatedContainer>

          <AnimatedContainer animation="fade" delay={200} variant="default">
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontFamily: 'var(--font-family)',
                fontWeight: 'var(--font-weight-medium)',
                fontSize: { xs: '1.2rem', md: '1.5rem' } 
              }}
            >
              Өтініштер, ұсыныстар және кері байланыс жүйесі
            </Typography>
          </AnimatedContainer>

          <AnimatedContainer animation="fade" delay={400} variant="default">
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ 
                mb: 4, 
                maxWidth: 700, 
                mx: 'auto',
                px: { xs: 2, md: 0 },
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontFamily: 'var(--font-family)',
                fontWeight: 'var(--font-weight-regular)'
              }}
            >
              Мұнда сіз компания жұмысын жақсарту бойынша кез келген сұрақты, шағымды немесе ұсынысты жібере аласыз.
              Сіздің өтінішіңізбен жауапты қызметкерлер айналысады.
            </Typography>
          </AnimatedContainer>

          <AnimatedButton 
            color="secondary" 
            size={isMobile ? "medium" : "large"}
            onClick={scrollToForm}
            delay={600}
            animation="zoom"
            endIcon={<SendIcon />}
            glowEffect={true}
            sx={{ 
              px: { xs: 3, md: 4 }, 
              py: { xs: 1, md: 1.5 }, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              fontWeight: 'var(--font-weight-bold)',
              fontFamily: 'var(--font-family)'
            }}
          >
            Өтініш жасау
          </AnimatedButton>
        </Container>       
      </Box>

      {/* Өтініш түрлері */}
      <Container sx={{ mb: 8 }}>
        <AnimatedContainer animation="fade" variant="default">
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{
              fontWeight: 'var(--font-weight-semibold)',
              fontFamily: 'var(--font-family)',
              position: 'relative',
              mb: 5,
              ...animatedStyles.titledSection
            }}
          >
            Өтініш түрлері
          </Typography>
        </AnimatedContainer>
        
        <Grid container spacing={isTablet ? 2 : 3}>
          {serviceCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <AnimatedCard
                title={card.title}
                content={card.description}
                icon={card.icon}
                delay={getSequentialDelay(index, 150)}
                animation="grow"
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Форма заявки и переключение */}
      <Container maxWidth="md" sx={{ mb: 8 }} id="ticket-form-section">
        <AnimatedContainer animation="fade" variant="default">
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            {/* Переключатель */}
            <Box 
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              }}
            >
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                  '& .MuiTab-root': {
                    py: 2,
                    fontFamily: 'var(--font-family)',
                    fontWeight: 'var(--font-weight-medium)',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    '&.Mui-selected': {
                      fontWeight: 'var(--font-weight-semibold)',
                      color: theme.palette.primary.main
                    }
                  }
                }}
              >
                <Tab 
                  icon={<AddIcon />} 
                  iconPosition="start" 
                  label="Өтініш жасау" 
                  key="create-ticket"
                />
                <Tab 
                  icon={<SearchIcon />} 
                  iconPosition="start" 
                  label="Өтінішті қарау" 
                  key="search-ticket"
                />
              </Tabs>
            </Box>
            
            {/* Содержимое в зависимости от выбранной вкладки */}
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              {activeTab === 0 ? (
                /* Форма создания заявки */
                <TicketForm onSubmitSuccess={handleSubmitSuccess} />
              ) : (
                /* Форма поиска заявки */
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      mb: 3, 
                      fontFamily: 'var(--font-family)',
                      fontWeight: 'var(--font-weight-semibold)'
                    }}
                  >
                    Өтінішті іздеу
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 4, 
                      maxWidth: 500, 
                      mx: 'auto',
                      color: 'text.secondary',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    Өтінішіңізді қарау үшін идентификаторын енгізіңіз
                  </Typography>
                  
                  <Box sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Өтініш ID"
                      placeholder="Мысалы: 12345"
                      variant="outlined"
                      value={ticketId}
                      onChange={handleTicketIdChange}
                      error={!!ticketIdError}
                      helperText={ticketIdError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: '12px',
                        }
                      }}
                    />
                  </Box>
                  
                  <AnimatedButton
                    color="secondary"
                    size="large"
                    onClick={handleFindTicket}
                    endIcon={<SearchIcon />}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: '30px',
                      minWidth: 200
                    }}
                  >
                    Қарау
                  </AnimatedButton>
                </Box>
              )}
            </Box>
          </Paper>
        </AnimatedContainer>
      </Container>

      {/* Біздің жұмыс қағидаттарымыз */}
      <Container sx={{ mb: 10, textAlign: 'center' }}>
        <AnimatedContainer animation="fade" variant="default">
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{
              fontWeight: 'var(--font-weight-semibold)',
              fontFamily: 'var(--font-family)',
              position: 'relative',
              mb: 5,
              ...animatedStyles.titledSection
            }}
          >
            Біздің жұмыс қағидаттарымыз
          </Typography>
        </AnimatedContainer>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6">Құпиялылық</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" paragraph sx={{ textAlign: 'center' }}>
                  Барлық өтініштер ақпараттың құпиялылығын сақтай отырып өңделеді
                </Typography>
                <Box sx={{ width: '40px', height: '3px', bgcolor: 'primary.light', mx: 'auto', my: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Сіз өз деректеріңіздің қауіпсіздігіне сенімді бола аласыз
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.main', color: 'white' }}>
                <Typography variant="h6">Жеделділік</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" paragraph sx={{ textAlign: 'center' }}>
                  Біз әр өтінішті ең қысқа мерзімде қарастырамыз
                </Typography>
                <Box sx={{ width: '40px', height: '3px', bgcolor: 'secondary.light', mx: 'auto', my: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Біз ар өтінішті белгіленген уақыт аралығында қарастырамыз
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
                <Typography variant="h6">Айқындылық</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" paragraph sx={{ textAlign: 'center' }}>
                  Сіз өз өтінішіңіздің мәртебесін нақты уақыт режимінде қадағалай аласыз
                </Typography>
                <Box sx={{ width: '40px', height: '3px', bgcolor: 'info.light', mx: 'auto', my: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Сіз өтініш мәртебесінің өзгерістері туралы хабарландырулар аласыз
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;