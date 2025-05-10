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
  Card,
  CardContent
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { ticketsApi } from '../../api/tickets';

// Әр қадам үшін компоненттерді импорттау
import ContactInfoStep from './form-steps/ContactInfoStep';
import TicketDetailsStep from './form-steps/TicketDetailsStep';
import AdditionalInfoStep from './form-steps/AdditionalInfoStep';
import SuccessMessage from './form-steps/SuccessMessage';

/**
 * Өтініш формасын толтыру қадамдары
 */
const FORM_STEPS = [
  { label: 'Қызметкер туралы ақпарат', key: 'contactInfo' },
  { label: 'Өтініш мәліметтері', key: 'ticketDetails' },
  { label: 'Қосымша ақпарат', key: 'additionalInfo' },
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
      console.error('Өтінішті құру кезінде қате:', error);
      
      setSnackbar({
        open: true,
        message: error?.response?.data?.error || 'Өтінішті құру мүмкін болмады. Кейінірек қайталаңыз.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Хабарландыруды жабу
   */
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /**
   * Сәтті құрылғаннан кейін жаңа өтініш бастау
   */
  const handleCreateNewTicket = () => {
    setFormData(INITIAL_FORM_STATE);
    setCurrentStep(0);
    setTicketCreated(null);
  };

  /**
   * Ағымдағы қадамға байланысты форма компонентін көрсету
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContactInfoStep 
            formData={formData} 
            onChange={handleChange} 
            errors={errors} 
          />
        );
      case 1:
        return (
          <TicketDetailsStep 
            formData={formData} 
            onChange={handleChange} 
            errors={errors} 
          />
        );
      case 2:
        return (
          <AdditionalInfoStep 
            formData={formData} 
            onChange={handleChange} 
            errors={errors} 
          />
        );
      case 3:
        return (
          <SuccessMessage 
            ticket={ticketCreated}
            email={formData.email}
            onCreateNew={handleCreateNewTicket}
            emailSent={emailSent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Өтініш құру
        </Typography>
        
        {currentStep < FORM_STEPS.length && (
          <Stepper activeStep={currentStep} sx={{ my: 4 }}>
          {FORM_STEPS.map((step, index) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Ағымдағы қадам мазмұны */}
          {renderStepContent()}
              
          {/* Қадамдар арасында навигация түймелері */}
          {currentStep < FORM_STEPS.length && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={currentStep === 0 || loading}
                onClick={handleBack}
                variant="outlined"
              >
                Артқа
              </Button>
              
              <Box>
                {currentStep === FORM_STEPS.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  >
                    {loading ? 'Жіберілуде...' : 'Өтінішті жіберу'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    Келесі
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </form>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TicketForm;