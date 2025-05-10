// src/components/ticket/CreateTicketForm.jsx - Өтініш құру формасы
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
import SuccessMessage from './form-steps/SuccessMessage';

// Құрылыс компаниясының өтініш санаттары
const TICKET_CATEGORIES = [
  { value: 'repair', label: 'Жөндеу жұмыстары' },
  { value: 'plumbing', label: 'Сантехника' },
  { value: 'electrical', label: 'Электрика' },
  { value: 'construction', label: 'Құрылыс' },
  { value: 'design', label: 'Жобалау' },
  { value: 'consultation', label: 'Кеңес беру' },
  { value: 'estimate', label: 'Смета және есептеулер' },
  { value: 'materials', label: 'Материалдар' },
  { value: 'warranty', label: 'Кепілдік жағдайы' },
  { value: 'other', label: 'Басқа' }
];

const TICKET_PRIORITIES = [
  { value: 'low', label: 'Төмен' },
  { value: 'medium', label: 'Орташа' },
  { value: 'high', label: 'Жоғары' },
  { value: 'urgent', label: 'Шұғыл' }
];

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Пәтер' },
  { value: 'house', label: 'Жеке үй' },
  { value: 'office', label: 'Кеңсе' },
  { value: 'commercial', label: 'Коммерциялық үй-жай' },
  { value: 'land', label: 'Жер телімі' },
  { value: 'other', label: 'Басқа' }
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
  const [ticketCreated, setTicketCreated] = useState(null);
  
  const steps = [
    'Байланыс ақпараты',
    'Өтініш мәліметтері',
    'Нысан туралы ақпарат'
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
      setTicketCreated(data);
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }
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
          newErrors.full_name = 'Аты-жөніңізді көрсетіңіз';
        }
        
        if (!formData.email.trim()) {
          newErrors.email = 'Байланыс үшін email көрсетіңіз';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Дұрыс email көрсетіңіз';
        }
        
        if (formData.phone.trim() && !/^\+?[0-9\s\-\(\)]{10,15}$/.test(formData.phone.trim())) {
          newErrors.phone = 'Дұрыс телефон нөірін көрсетіңіз';
        }
        break;
        
      case 1:
        if (!formData.subject.trim()) {
          newErrors.subject = 'Өтініш тақырыбын көрсетіңіз';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Мәселеңізді немесе сұрауыңызды сипаттаңыз';
        } else if (formData.description.trim().length < 10) {
          newErrors.description = 'Сипаттамада кемінде 10 таңба болуы керек';
        }
        break;
        
      case 2:
        if (formData.category !== 'consultation' && !formData.property_address.trim()) {
          newErrors.property_address = 'Нысан мекенжайын көрсетіңіз';
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
    // Предотвращаем стандартное поведение формы
    e.preventDefault();
    
    // Явная проверка, что форма отправляется по нажатию кнопки, а не автоматически
    const submitter = e.nativeEvent?.submitter;
    if (!submitter || submitter.type !== 'submit') {
      // Если форма не была отправлена нажатием кнопки "Отправить", прерываем выполнение
      return;
    }
    
    // Валидация всех шагов
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        setActiveStep(i);
        return;
      }
    }
    
    try {
      await createTicketMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Өтініш құру кезінде қате:', error);
    }
  };
  
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setActiveStep(0);
    setTicketCreated(null);
  };
  
  // Если заявка успешно создана, показываем страницу успеха
  if (createTicketMutation.isSuccess && ticketCreated) {
    return (
      <SuccessMessage 
        ticket={ticketCreated}
        email={formData.email}
        onCreateNew={resetForm}
      />
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <ConstructionIcon color="primary" />
          <Typography variant="h5" component="h2">
            Өтініш жасау
          </Typography>
        </Stack>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Төмендегі нысанды толтырыңыз, және біздің мамандар сізбен жақын арада байланысады. 
          Міндетті өрістер жұлдызшамен (*) белгіленген.
        </Typography>
        
        {/* Байланыс ақпараты */}
        {activeStep === 0 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Сіздің байланыс деректеріңіз
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="full_name"
                    label="Аты-жөніңіз *"
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
                    helperText={errors.email || "Осы мекенжайға растау хабарламасы жіберіледі"}
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
                    <FormLabel component="legend">Қалаулы байланыс әдісі</FormLabel>
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
                    Біз сіздің жеке деректеріңіздің құпиялылығына кепілдік береміз. 
                    Олар тек сіздің өтінішіңізді өңдеу үшін ғана пайдаланылады.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Өтініш мәліметтері */}
        {activeStep === 1 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="subject"
                    label="Өтініш тақырыбы *"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    placeholder="Мысалы: Жуынатын бөлмені жөндеу"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Санат</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Санат"
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
                    <InputLabel>Басымдық</InputLabel>
                    <Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      label="Басымдық"
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
                    label="Жұмыс сипаттамасы *"
                    multiline
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    error={!!errors.description}
                    helperText={errors.description}
                    placeholder="Сізге қандай жұмыстар қажет екенін толық сипаттаңыз"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Нысан туралы ақпарат */}
        {activeStep === 2 && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Нысан түрі</InputLabel>
                    <Select
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleChange}
                      label="Нысан түрі"
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
                    label="Аудан (шаршы м.)"
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
                    label="Нысан мекенжайы *"
                    value={formData.property_address}
                    onChange={handleChange}
                    error={!!errors.property_address}
                    helperText={errors.property_address || "Нысанның толық мекенжайын көрсетіңіз"}
                    placeholder="Қала, көше, үй, пәтер"
                  />
                </Grid>
              </Grid>
            </CardContent>
            </Card>
        )}
        
        {/* Қателер мен сәттілік туралы хабарламалар */}
        {createTicketMutation.isError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            Өтініш құру мүмкін болмады: {createTicketMutation.error?.message || 'Қате пайда болды'}
          </Alert>
        )}
        
        {/* Навигация түймелері */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || createTicketMutation.isLoading}
          >
            Артқа
          </Button>
          
          <Box>
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={createTicketMutation.isLoading}
              >
                Келесі
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={createTicketMutation.isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                disabled={createTicketMutation.isLoading}
              >
                {createTicketMutation.isLoading ? 'Жіберілуде...' : 'Өтініш жіберу'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreateTicketForm;