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

// Импорт подкомпонентов для каждого шага формы
import ContactInfoStep from './form-steps/ContactInfoStep';
import TicketDetailsStep from './form-steps/TicketDetailsStep';
import PropertyInfoStep from './form-steps/PropertyInfoStep';
import AttachmentsStep from './form-steps/AttachmentsStep';
import SuccessMessage from './form-steps/SuccessMessage';

/**
 * Шаги заполнения формы заявки
 * Өтінім формасын толтыру қадамдары
 */
const FORM_STEPS = [
  { label: 'Контактная информация', key: 'contactInfo' },
  { label: 'Детали заявки', key: 'ticketDetails' },
  { label: 'Информация об объекте', key: 'propertyInfo' },
];

/**
 * Начальное состояние формы
 * Форманың бастапқы күйі
 */
const INITIAL_FORM_STATE = {
  // Контактная информация
  full_name: '',
  email: '',
  phone: '',
  preferred_contact: 'email',
  
  // Информация о заявке
  subject: '',
  description: '',
  category: 'repair',
  priority: 'medium',
  
  // Информация об объекте
  property_type: 'apartment',
  property_address: '',
  property_area: ''
};

/**
 * Компонент формы создания заявки
 * Өтінім жасау формасының компоненті
 * 
 * @param {Function} onSubmitSuccess - Функция, вызываемая после успешного создания заявки
 */
const TicketForm = ({ onSubmitSuccess }) => {
  // Состояние формы и управление шагами
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [ticketCreated, setTicketCreated] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  /**
   * Обработчик изменения полей формы
   * Форма өрістерінің өзгеруін өңдеуші
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Обработчик изменения загруженных файлов
   * Жүктелген файлдардың өзгеруін өңдеуші
   */
  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  /**
   * Проверка текущего шага формы
   * Форманың ағымдағы қадамын тексеру
   */
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Проверка контактной информации
        if (!formData.full_name.trim()) {
          newErrors.full_name = 'Укажите ваше имя';
        }
        
        if (!formData.email.trim()) {
          newErrors.email = 'Укажите email для связи';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Укажите корректный email';
        }
        
        // Проверка телефона, только если он указан
        if (formData.phone.trim() && !/^\+?[0-9\s\-\(\)]{10,15}$/.test(formData.phone.trim())) {
          newErrors.phone = 'Укажите корректный номер телефона';
        }
        break;
        
      case 1: // Проверка информации о заявке
        if (!formData.subject.trim()) {
          newErrors.subject = 'Укажите тему обращения';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Опишите вашу проблему или запрос';
        } else if (formData.description.trim().length < 10) {
          newErrors.description = 'Описание должно содержать минимум 10 символов';
        }
        break;
        
      case 2: // Проверка информации об объекте
        // Адрес обязателен только если категория не "консультация"
        if (formData.category !== 'consultation' && !formData.property_address.trim()) {
          newErrors.property_address = 'Укажите адрес объекта';
        }
        break;
        
      case 3: // Проверка вложений - нет обязательных полей
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Переход к следующему шагу
   * Келесі қадамға өту
   */
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      setSnackbar({
        open: true,
        message: 'Пожалуйста, заполните все обязательные поля',
        severity: 'error'
      });
    }
  };

  /**
   * Переход к предыдущему шагу
   * Алдыңғы қадамға өту
   */
  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  /**
   * Отправка формы и создание заявки
   * Форманы жіберу және өтінім жасау
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка всех шагов формы
    for (let i = 0; i < FORM_STEPS.length; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        setSnackbar({
          open: true,
          message: 'Пожалуйста, заполните все обязательные поля',
          severity: 'error'
        });
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Подготовка данных для отправки
      const ticketData = {
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        
        // Информация о клиенте в metadata
        metadata: {
          requester: {
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone || null,
            preferred_contact: formData.preferred_contact
          },
          property: {
            type: formData.property_type,
            address: formData.property_address,
            area: formData.property_area ? parseFloat(formData.property_area) : null
          }
        }
      };
      
      console.log('Отправка данных заявки:', ticketData);
      
      // Отправка данных на сервер
      const response = await ticketsApi.createTicket(ticketData);
      
      // Загрузка файлов, если они есть
      if (files.length > 0) {
        for (const file of files) {
          try {
            await ticketsApi.uploadAttachment(response.ticket.id, file);
          } catch (fileErr) {
            console.error('Ошибка загрузки файла:', fileErr);
          }
        }
      }
      
      // Сохранение информации о созданной заявке
      setTicketCreated(response.ticket);
      
      // Показать сообщение об успехе
      setSnackbar({
        open: true,
        message: `Ваша заявка #${response.ticket.id} успешно отправлена!`,
        severity: 'success'
      });
      
      // Сброс формы
      setFormData(INITIAL_FORM_STATE);
      setFiles([]);
      
      // Вызов обработчика успешного создания заявки
      if (onSubmitSuccess) {
        onSubmitSuccess(response.ticket);
      }
      
    } catch (err) {
      console.error('Ошибка создания заявки:', err);
      
      setSnackbar({
        open: true,
        message: err.message || 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Закрытие уведомления
   * Хабарламаны жабу
   */
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /**
   * Создание новой заявки после успешного создания
   * Сәтті жасалғаннан кейін жаңа өтінім жасау
   */
  const handleCreateNewTicket = () => {
    setTicketCreated(null);
    setCurrentStep(0);
  };

  // Если заявка создана, показываем экран успеха
  if (ticketCreated) {
    return (
      <SuccessMessage 
        ticket={ticketCreated}
        email={formData.email}
        onCreateNew={handleCreateNewTicket}
      />
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, my: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Подать заявку
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Заполните форму ниже, и наши специалисты свяжутся с вами в ближайшее время.
          Обязательные поля отмечены звездочкой (*).
        </Typography>
        
        {/* Шаги формы */}
        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {FORM_STEPS.map((step, index) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Содержимое текущего шага */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              {currentStep === 0 && (
                <ContactInfoStep 
                  formData={formData}
                  onChange={handleChange}
                  errors={errors}
                />
              )}
              
              {currentStep === 1 && (
                <TicketDetailsStep 
                  formData={formData}
                  onChange={handleChange}
                  errors={errors}
                />
              )}
              
              {currentStep === 2 && (
                <PropertyInfoStep 
                  formData={formData}
                  onChange={handleChange}
                  errors={errors}
                />
              )}
              
              {/* {currentStep === 3 && (
                <AttachmentsStep 
                  files={files}
                  onFilesChange={handleFilesChange}
                />
              )} */}
            </CardContent>
          </Card>
          
          {/* Кнопки навигации */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
            >
              Назад
            </Button>
            
            {currentStep < FORM_STEPS.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                Далее
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              >
                {loading ? 'Отправка...' : 'Отправить заявку'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Уведомление */}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TicketForm;