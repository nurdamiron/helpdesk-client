// src/components/ticket/TicketForm.jsx
import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Card,
  CardContent,
  styled,
  alpha
} from '@mui/material';
import { 
  Send as SendIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon, 
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { ticketsApi } from '../../api/tickets';

// Әр қадам үшін компоненттерді импорттау
import ContactInfoStep from './form-steps/ContactInfoStep';
import TicketDetailsStep from './form-steps/TicketDetailsStep';
import AdditionalInfoStep from './form-steps/AdditionalInfoStep';
import SuccessMessage from './form-steps/SuccessMessage';

// Стилизованный степпер
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-root`]: {
    top: 24,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)',
  },
  [`&.MuiStepConnector-active`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
    },
  },
  [`&.MuiStepConnector-completed`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
    },
  },
  [`& .MuiStepConnector-line`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

// Стилизованный кружок для иконки шага
const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'flex',
  height: 50,
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  ...(ownerState.completed && {
    color: theme.palette.primary.main,
  }),
}));

// Стилизованная иконка для шагов
const CustomStepIcon = (props) => {
  const { active, completed, className, icon } = props;

  const icons = {
    1: <PersonIcon />,
    2: <DescriptionIcon />,
    3: <InfoIcon />,
  };

  return (
    <StepIconRoot ownerState={{ active, completed }} className={className}>
      <Box
        sx={{
          borderRadius: '50%',
          width: 50,
          height: 50,
          backgroundColor: active || completed 
            ? active 
              ? 'primary.main' 
              : 'primary.dark'
            : 'grey.300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: active || completed ? '0 4px 10px rgba(0, 0, 0, 0.15)' : 0,
          transition: 'all 0.3s ease',
          transform: active ? 'scale(1.1)' : 'scale(1)',
          zIndex: active ? 2 : 1,
          border: completed && !active ? '2px solid' : 'none',
          borderColor: completed && !active ? 'primary.main' : 'transparent'
        }}
      >
        {completed ? <CheckCircleIcon fontSize="large" /> : icons[String(icon)]}
      </Box>
    </StepIconRoot>
  );
};

// Стилизованная кнопка
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  padding: '10px 24px',
  fontWeight: 500,
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-3px)',
  },
  transition: 'all 0.3s ease',
  textTransform: 'none',
  fontFamily: 'var(--font-family)',
}));

// Анимированная кнопка для формы
const AnimatedFormButton = styled(StyledButton)(({ theme, direction }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: direction === 'left' ? '-100%' : '100%',
    background: `linear-gradient(to ${direction === 'left' ? 'right' : 'left'}, transparent, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
    transition: 'transform 0.6s ease-out',
  },
  '&:hover::after': {
    transform: `translateX(${direction === 'left' ? '200%' : '-200%'})`,
  }
}));

/**
 * Өтініш формасын толтыру қадамдары
 */
const FORM_STEPS = [
  { label: 'Қызметкер туралы ақпарат', key: 'contactInfo', icon: <PersonIcon /> },
  { label: 'Өтініш мәліметтері', key: 'ticketDetails', icon: <DescriptionIcon /> },
  { label: 'Қосымша ақпарат', key: 'additionalInfo', icon: <InfoIcon /> },
];

/**
 * Форманың бастапқы күйі
 */
const INITIAL_FORM_STATE = {
  // Байланыс ақпараты
  full_name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  preferred_contact: 'email',
  
  // Өтініш туралы ақпарат
  subject: '',
  description: '',
  type: 'request',
  category: 'it',
  priority: 'medium',
  
  // Қосымша ақпарат
  comments: ''
};

/**
 * Ішкі өтініш құру формасының компоненті
 * 
 * @param {Function} onSubmitSuccess - Өтінішті сәтті құрылғаннан кейін шақырылатын функция
 */
const TicketForm = ({ onSubmitSuccess }) => {
  // Форма күйі және қадамдарды басқару
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [ticketCreated, setTicketCreated] = useState(null);
  const [emailSent, setEmailSent] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  /**
   * Форма өрістерінің өзгерісін өңдеуші
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Өріс өзгерген кезде қателерді тазалау
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Ағымдағы форма қадамын тексеру
   */
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Байланыс ақпаратын тексеру
        if (!formData.full_name.trim()) {
          newErrors.full_name = 'Атыңызды көрсетіңіз';
        }
        
        if (!formData.email.trim()) {
          newErrors.email = 'Корпоративтік email көрсетіңіз';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Дұрыс email көрсетіңіз';
        }
        
        if (!formData.department.trim()) {
          newErrors.department = 'Бөлімшеңізді көрсетіңіз';
        }
        
        // Телефон нөірін тексеру, егер көрсетілген болса
        if (formData.phone.trim() && !/^\+?[0-9\s\-\(\)]{10,15}$/.test(formData.phone.trim())) {
          newErrors.phone = 'Дұрыс телефон нөмірін көрсетіңіз';
        }
        break;
        
      case 1: // Өтініш ақпаратын тексеру
        if (!formData.subject.trim()) {
          newErrors.subject = 'Өтініш тақырыбын көрсетіңіз';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Мәселеңізді немесе сұрауыңызды сипаттаңыз';
        } else if (formData.description.trim().length < 10) {
          newErrors.description = 'Сипаттамада кемінде 10 таңба болуы керек';
        }
        
        if (!formData.type) {
          newErrors.type = 'Өтініш түрін таңдаңыз';
        }
        break;
        
      case 2: // Қосымша ақпаратты тексеру - барлық өрістер міндетті емес
        // Міндетті тексерулерсіз қалдыруға болады
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Келесі қадамға өту
   */
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      setSnackbar({
        open: true,
        message: 'Барлық міндетті өрістерді толтырыңыз',
        severity: 'error'
      });
    }
  };

  /**
   * Алдыңғы қадамға оралу
   */
  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  /**
   * Форманы жіберу және өтініш құру
   */
  const handleSubmit = async (e) => {
    // Если функция вызвана как обработчик события, предотвращаем стандартное поведение
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Проверяем, что текущий шаг - последний
    if (currentStep !== FORM_STEPS.length - 1) {
      return;
    }
    
    // Барлық форма қадамдарын тексеру
    for (let i = 0; i < FORM_STEPS.length; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        setSnackbar({
          open: true,
          message: 'Барлық міндетті өрістерді толтырыңыз',
          severity: 'error'
        });
        return;
      }
    }
    
    // Если все проверки пройдены, отправляем данные
    setLoading(true);
    
    try {
      // Жіберуге арналған деректерді дайындау
      const ticketData = {
        subject: formData.subject,
        description: formData.description,
        type: formData.type,
        priority: formData.priority,
        category: formData.category,
        
        // Қызметкер туралы ақпарат metadata өрісінде
        metadata: {
          employee: {
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone || null,
            department: formData.department,
            position: formData.position,
            preferred_contact: formData.preferred_contact
          },
          additional: {
            comments: formData.comments
          }
        }
      };
      
      // Өтініш құру сұранысын жіберу
      const response = await ticketsApi.createTicket(ticketData);
      
      // Сохраняем статус отправки email
      setEmailSent(response.email_sent);
      
      // Құрылған өтінішті сақтау
      setTicketCreated(response.ticket);
      setCurrentStep(FORM_STEPS.length); // Сәттілік экранына өту
      
      setSnackbar({
        open: true,
        message: 'Өтініш сәтті құрылды!',
        severity: 'success'
      });
      
      // Сәтті құру туралы callback-функциясын шақыру
      if (onSubmitSuccess) {
        // Добавляем статус отправки email в объект тикета для передачи в callback
        const ticketWithEmailStatus = {
          ...response.ticket,
          email_sent: response.email_sent
        };
        onSubmitSuccess(ticketWithEmailStatus);
      }
    } catch (error) {
      console.error('Ticket creation error:', error);
      
      setSnackbar({
        open: true,
        message: 'Өтініш құру кезінде қате орын алды. Қайтадан көріңіз.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Snackbar-ді жабу
   */
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  /**
   * Жаңа өтініш жасау
   */
  const handleCreateNewTicket = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTicketCreated(null);
    setEmailSent(null);
    setCurrentStep(0);
  };

  /**
   * Ағымдағы қадам компонентін көрсету
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContactInfoStep 
            formData={formData} 
            errors={errors} 
            onChange={handleChange} 
          />
        );
      case 1:
        return (
          <TicketDetailsStep 
            formData={formData} 
            errors={errors} 
            onChange={handleChange} 
          />
        );
      case 2:
        return (
          <AdditionalInfoStep 
            formData={formData} 
            errors={errors} 
            onChange={handleChange} 
          />
        );
      case FORM_STEPS.length:
        return (
          <SuccessMessage 
            ticket={ticketCreated} 
            email={formData.email}
            emailSent={emailSent}
            onCreateNew={handleCreateNewTicket} 
          />
        );
      default:
        return <div>Қадам табылмады</div>;
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ width: '100%' }}>
      {/* Заголовок и степпер */}
      {currentStep < FORM_STEPS.length && (
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 'var(--font-weight-semibold)',
              mb: 4,
              background: 'linear-gradient(45deg, #1976d2, #0d47a1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Өтініш құру
          </Typography>
          
          <Box sx={{ 
            py: 2, 
            px: { xs: 0, md: 4 },
            background: 'linear-gradient(to right, rgba(240,240,240,0), rgba(240,240,240,0.8), rgba(240,240,240,0))',
            borderRadius: 2
          }}>
            <Stepper 
              activeStep={currentStep} 
              alternativeLabel 
              connector={<CustomStepConnector />}
            >
              {FORM_STEPS.map((step, index) => (
                <Step key={step.key}>
                  <StepLabel 
                    StepIconComponent={(props) => 
                      <CustomStepIcon 
                        {...props} 
                        icon={index + 1} 
                      />
                    }
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: currentStep === index ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                        color: currentStep === index ? 'primary.main' : 'text.secondary',
                        mt: 1.5,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>
      )}
      
      {/* Ағымдағы қадам мазмұны */}
      <Card 
        elevation={currentStep < FORM_STEPS.length ? 3 : 1}
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          overflow: 'visible',
          transition: 'all 0.3s ease',
          transform: loading ? 'scale(0.98)' : 'scale(1)',
          border: currentStep === FORM_STEPS.length ? '1px solid' : 'none',
          borderColor: 'primary.light',
          bgcolor: currentStep === FORM_STEPS.length ? 'background.default' : 'background.paper'
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          {renderStepContent()}
        </CardContent>
      </Card>
      
      {/* Навигация кнопкалары */}
      {currentStep < FORM_STEPS.length && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -20,
              left: 0,
              right: 0,
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)',
            }
          }}
        >
          <AnimatedFormButton
            variant="outlined"
            color="primary"
            onClick={handleBack}
            disabled={currentStep === 0}
            startIcon={<ArrowBackIcon />}
            direction="left"
            sx={{
              opacity: currentStep === 0 ? 0.5 : 1,
              pointerEvents: currentStep === 0 ? 'none' : 'auto'
            }}
          >
            Артқа
          </AnimatedFormButton>
          
          {currentStep === FORM_STEPS.length - 1 ? (
            <AnimatedFormButton
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              disableElevation={loading}
              direction="right"
            >
              {loading ? 'Жіберуде...' : 'Өтінішті жіберу'}
            </AnimatedFormButton>
          ) : (
            <AnimatedFormButton
              variant="contained"
              color="primary"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              direction="right"
            >
              Келесі
            </AnimatedFormButton>
          )}
        </Box>
      )}
      
      {/* Snackbar хабарламалар */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TicketForm;