import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  MenuItem, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Typography, 
  Paper,
  Divider,
  Alert,
  Grid,
  InputLabel,
  Select,
  CircularProgress,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Construction as ConstructionIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { chatApi } from '../../api/chat';

// Категории заявок для строительной компании
const TICKET_CATEGORIES = [
  { value: 'repair', label: 'Ремонтные работы' },
  { value: 'plumbing', label: 'Сантехника' },
  { value: 'electrical', label: 'Электрика' },
  { value: 'construction', label: 'Строительство' },
  { value: 'design', label: 'Проектирование' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'estimate', label: 'Смета и расчеты' },
  { value: 'materials', label: 'Материалы' },
  { value: 'warranty', label: 'Гарантийный случай' },
  { value: 'other', label: 'Другое' },
];

// Приоритеты заявок
const TICKET_PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' },
];

// Типы объектов
const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Частный дом' },
  { value: 'office', label: 'Офис' },
  { value: 'commercial', label: 'Коммерческое помещение' },
  { value: 'land', label: 'Земельный участок' },
  { value: 'other', label: 'Другое' },
];

// Услуги строительной компании
const SERVICES = [
  { value: 'construction', label: 'Строительство' },
  { value: 'renovation', label: 'Ремонт' },
  { value: 'design', label: 'Проектирование' },
  { value: 'maintenance', label: 'Обслуживание' },
  { value: 'consultation', label: 'Консультация' },
];

const INITIAL_FORM_STATE = {
  // Информация о клиенте
  name: '',
  email: '',
  phone: '',
  preferred_contact: 'phone',
  
  // Информация о заявке
  subject: '',
  description: '',
  category: 'repair',
  priority: 'medium',
  
  // Информация об объекте
  property_type: 'apartment',
  property_address: '',
  property_area: '',
  
  // Дополнительная информация
  desired_date: '',
  budget: '',
  service_type: 'renovation'
};

const CreateTicketForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  
  // Шаги формы
  const steps = [
    'Ваши данные',
    'Информация о заявке',
    'Детали объекта',
    'Дополнительно'
  ];
  
  // Мутация для создания заявки
  const createTicketMutation = useMutation({
    mutationFn: (data) => {
      // Преобразуем данные формы в структуру для API
      const conversationData = {
        subject: data.subject,
        type: 'ticket',
        status: 'new',
        category: data.category,
        priority: data.priority,
        metadata: {
          requester: {
            email: data.email,
            full_name: data.name,
            phone: data.phone,
            preferred_contact: data.preferred_contact
          },
          property: {
            type: data.property_type,
            address: data.property_address,
            area: data.property_area
          },
          additional: {
            desired_date: data.desired_date,
            budget: data.budget,
            service_type: data.service_type
          }
        },
        messages: [
          {
            sender_id: 999, // ID для заявителя
            body: data.description,
            content_type: 'text'
          }
        ]
      };
      
      return chatApi.createConversation(conversationData);
    },
    onSuccess: (data) => {
      // Вызываем callback при успешном создании заявки
      if (onSuccess) {
        onSuccess(data);
      }
      // Сбрасываем форму
      resetForm();
    }
  });
  
  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку поля при изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Обработчик выбора файлов
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Проверяем размер файлов (макс. 5 МБ на файл)
    const validFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Некоторые файлы не были добавлены, так как их размер превышает 5 МБ');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    
    // Сбрасываем input для возможности повторного выбора тех же файлов
    e.target.value = '';
  };
  
  // Удаление файла из списка
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  // Проверка текущего шага формы
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Проверка личных данных
        if (!formData.name.trim()) {
          newErrors.name = 'Введите ваше имя';
        }
        
        if (!formData.email.trim()) {
          newErrors.email = 'Введите ваш email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Введите корректный email';
        }
        
        if (!formData.phone.trim()) {
          newErrors.phone = 'Введите ваш номер телефона';
        } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone.replace(/[^0-9+]/g, ''))) {
          newErrors.phone = 'Введите корректный номер телефона';
        }
        break;
        
      case 1: // Проверка информации о заявке
        if (!formData.subject.trim()) {
          newErrors.subject = 'Введите тему заявки';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Введите описание проблемы';
        } else if (formData.description.trim().length < 10) {
          newErrors.description = 'Описание должно содержать минимум 10 символов';
        }
        break;
        
      case 2: // Проверка информации об объекте
        if (!formData.property_address.trim()) {
          newErrors.property_address = 'Введите адрес объекта';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Переход к следующему шагу
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  // Переход к предыдущему шагу
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Проверка всей формы перед отправкой
  const validateForm = () => {
    let isValid = true;
    
    // Проверяем все шаги
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        isValid = false;
        setActiveStep(i);
        break;
      }
    }
    
    return isValid;
  };
  
  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      createTicketMutation.mutate(formData);
    }
  };
  
  // Сброс формы
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setFiles([]);
    setErrors({});
    setActiveStep(0);
  };
  
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <ConstructionIcon color="primary" />
          <Typography variant="h5" component="h2">
            Создание заявки на строительные работы
          </Typography>
        </Stack>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Заполните форму, чтобы отправить заявку в нашу строительную компанию. Чем подробнее вы опишете задачу,
          тем точнее мы сможем оценить стоимость и сроки работ.
        </Typography>
        
        {/* Шаги заполнения формы */}
        <Stepper activeStep={activeStep} sx={{ my: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Шаг 1: Информация о клиенте */}
        {activeStep === 0 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6">
                  Ваши контактные данные
                </Typography>
              </Stack>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="name"
                    label="Имя и фамилия"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="phone"
                    label="Телефон"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.phone}
                    helperText={errors.phone}
                    placeholder="+7 (___) ___-__-__"
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Предпочтительный способ связи</FormLabel>
                    <RadioGroup
                      row
                      name="preferred_contact"
                      value={formData.preferred_contact}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="phone" control={<Radio />} label="Телефон" />
                      <FormControlLabel value="email" control={<Radio />} label="Email" />
                      <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Шаг 2: Информация о заявке */}
        {activeStep === 1 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <CategoryIcon color="primary" />
                <Typography variant="h6">
                  Детали заявки
                </Typography>
              </Stack>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="subject"
                    label="Тема заявки"
                    value={formData.subject}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.subject}
                    helperText={errors.subject}
                    placeholder="Например: Ремонт ванной комнаты"
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Категория</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Категория"
                    >
                      {TICKET_CATEGORIES.map(category => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="priority-label">Приоритет</InputLabel>
                    <Select
                      labelId="priority-label"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      label="Приоритет"
                    >
                      {TICKET_PRIORITIES.map(priority => (
                        <MenuItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Описание работ"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    rows={5}
                    error={!!errors.description}
                    helperText={errors.description}
                    placeholder="Опишите подробно, какие работы вам необходимы"
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Шаг 3: Информация об объекте */}
        {activeStep === 2 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <HomeIcon color="primary" />
                <Typography variant="h6">
                  Информация об объекте
                </Typography>
              </Stack>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="property-type-label">Тип объекта</InputLabel>
                    <Select
                      labelId="property-type-label"
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleChange}
                      label="Тип объекта"
                    >
                      {PROPERTY_TYPES.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="property_area"
                    label="Площадь (кв.м)"
                    type="number"
                    value={formData.property_area}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="property_address"
                    label="Адрес объекта"
                    value={formData.property_address}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.property_address}
                    helperText={errors.property_address}
                    margin="normal"
                    placeholder="Укажите полный адрес объекта"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Шаг 4: Дополнительная информация */}
        {activeStep === 3 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <ConstructionIcon color="primary" />
                <Typography variant="h6">
                  Дополнительная информация
                </Typography>
              </Stack>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="desired_date"
                    label="Желаемая дата начала работ"
                    type="date"
                    value={formData.desired_date}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="budget"
                    label="Предполагаемый бюджет (₽)"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="service-type-label">Тип услуги</InputLabel>
                    <Select
                      labelId="service-type-label"
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleChange}
                      label="Тип услуги"
                    >
                      {SERVICES.map(service => (
                        <MenuItem key={service.value} value={service.value}>
                          {service.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Приложение файлов */}
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    sx={{ mt: 2 }}
                  >
                    Прикрепить файл
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleFileChange}
                    />
                  </Button>
                  
                  {files.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Прикрепленные файлы:
                      </Typography>
                      <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {files.map((file, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 1,
                              mb: 1,
                              bgcolor: 'action.hover',
                              borderRadius: 1
                            }}
                          >
                            <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>
                              {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </Typography>
                            <Tooltip title="Удалить файл">
                              <IconButton
                                size="small"
                                onClick={() => removeFile(index)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Отображение ошибки API */}
        {createTicketMutation.isError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            Не удалось создать заявку: {createTicketMutation.error?.message || 'Произошла ошибка'}
          </Alert>
        )}
        
        {/* Отображение успешного результата */}
        {createTicketMutation.isSuccess && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Заявка успешно создана! Мы свяжемся с вами в ближайшее время.
          </Alert>
        )}
        
        {/* Кнопки навигации */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || createTicketMutation.isLoading}
          >
            Назад
          </Button>
          
          <Box>
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={createTicketMutation.isLoading}
              >
                Далее
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={createTicketMutation.isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                disabled={createTicketMutation.isLoading}
              >
                {createTicketMutation.isLoading ? 'Отправка...' : 'Отправить заявку'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreateTicketForm;