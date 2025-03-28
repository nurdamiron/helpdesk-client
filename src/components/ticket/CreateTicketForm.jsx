// src/components/ticket/CreateTicketForm.jsx
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
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Send as SendIcon,
  Construction as ConstructionIcon
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
  { value: 'other', label: 'Другое' }
];

const TICKET_PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' }
];

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Частный дом' },
  { value: 'office', label: 'Офис' },
  { value: 'commercial', label: 'Коммерческое помещение' },
  { value: 'land', label: 'Земельный участок' },
  { value: 'other', label: 'Другое' }
];

const INITIAL_FORM_STATE = {
  full_name: '',
  email: '',
  phone: '',
  preferred_contact: 'email',
  
  subject: '',
  description: '',
  category: 'repair',
  priority: 'medium',
  
  property_type: 'apartment',
  property_address: '',
  property_area: ''
};

const CreateTicketForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    'Контактная информация',
    'Детали заявки',
    'Информация об объекте'
  ];
  
  const createTicketMutation = useMutation({
    mutationFn: (data) => {
      const conversationData = {
        subject: data.subject,
        type: 'ticket',
        status: 'new',
        category: data.category,
        priority: data.priority,
        metadata: {
          requester: {
            email: data.email,
            full_name: data.full_name,
            phone: data.phone,
            preferred_contact: data.preferred_contact
          },
          property: {
            type: data.property_type,
            address: data.property_address,
            area: data.property_area
          }
        },
        messages: [
          {
            sender_id: 999,
            body: data.description,
            content_type: 'text'
          }
        ]
      };
      
      return chatApi.createConversation(conversationData);
    },
    onSuccess: (data) => {
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }
      resetForm();
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!formData.full_name.trim()) {
          newErrors.full_name = 'Укажите ваше имя';
        }
        
        if (!formData.email.trim()) {
          newErrors.email = 'Укажите email для связи';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Укажите корректный email';
        }
        
        if (formData.phone.trim() && !/^\+?[0-9\s\-\(\)]{10,15}$/.test(formData.phone.trim())) {
          newErrors.phone = 'Укажите корректный номер телефона';
        }
        break;
        
      case 1:
        if (!formData.subject.trim()) {
          newErrors.subject = 'Укажите тему обращения';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Опишите вашу проблему или запрос';
        } else if (formData.description.trim().length < 10) {
          newErrors.description = 'Описание должно содержать минимум 10 символов';
        }
        break;
        
      case 2:
        if (formData.category !== 'consultation' && !formData.property_address.trim()) {
          newErrors.property_address = 'Укажите адрес объекта';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => Math.max(0, prevStep - 1));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        setActiveStep(i);
        return;
      }
    }
    
    try {
      await createTicketMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
    }
  };
  
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setActiveStep(0);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <ConstructionIcon color="primary" />
          <Typography variant="h5" component="h2">
            Подать заявку
          </Typography>
        </Stack>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Заполните форму ниже, и наши специалисты свяжутся с вами в ближайшее время. 
          Обязательные поля отмечены звездочкой (*).
        </Typography>
        
        {/* Контактная информация */}
        {activeStep === 0 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Ваши контактные данные
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="full_name"
                    label="Ваше полное имя *"
                    value={formData.full_name}
                    onChange={handleChange}
                    error={!!errors.full_name}
                    helperText={errors.full_name}
                    placeholder="Иванов Иван Иванович"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email || "На этот адрес будет отправлено подтверждение"}
                    placeholder="example@mail.com"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Телефон"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    placeholder="+7 (___) ___-__-__"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Предпочтительный способ связи</FormLabel>
                    <RadioGroup
                      row
                      name="preferred_contact"
                      value={formData.preferred_contact}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="email" control={<Radio />} label="Email" />
                      <FormControlLabel value="phone" control={<Radio />} label="Телефон" />
                      <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Мы гарантируем конфиденциальность ваших персональных данных. 
                    Они будут использованы только для обработки вашей заявки.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Детали заявки */}
        {activeStep === 1 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="subject"
                    label="Тема заявки *"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    placeholder="Например: Ремонт ванной комнаты"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Категория</InputLabel>
                    <Select
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
                  <FormControl fullWidth>
                    <InputLabel>Приоритет</InputLabel>
                    <Select
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
                    required
                    fullWidth
                    name="description"
                    label="Описание работ *"
                    multiline
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    error={!!errors.description}
                    helperText={errors.description}
                    placeholder="Подробно опишите, какие работы вам необходимы"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Информация об объекте */}
        {activeStep === 2 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Тип объекта</InputLabel>
                    <Select
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
                    fullWidth
                    name="property_area"
                    label="Площадь (кв.м)"
                    type="number"
                    value={formData.property_area}
                    onChange={handleChange}
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required={formData.category !== 'consultation'}
                    fullWidth
                    name="property_address"
                    label="Адрес объекта *"
                    value={formData.property_address}
                    onChange={handleChange}
                    error={!!errors.property_address}
                    helperText={errors.property_address || "Укажите полный адрес объекта"}
                    placeholder="Город, улица, дом, квартира"
                  />
                </Grid>
              </Grid>
            </CardContent>
            </Card>
        )}
        
        {/* Уведомления об ошибках и успехе */}
        {createTicketMutation.isError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            Не удалось создать заявку: {createTicketMutation.error?.message || 'Произошла ошибка'}
          </Alert>
        )}
        
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