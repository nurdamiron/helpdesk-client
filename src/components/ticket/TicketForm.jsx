// src/components/ticket/TicketForm.jsx
import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { ticketsApi } from '../../api/tickets';

const CATEGORIES = [
  { value: 'repair', label: 'Ремонт' },
  { value: 'construction', label: 'Строительство' },
  { value: 'design', label: 'Проектирование' },
  { value: 'consultation', label: 'Консультация' },
  { value: 'plumbing', label: 'Сантехника' },
  { value: 'electrical', label: 'Электрика' },
  { value: 'estimate', label: 'Смета и расчеты' },
  { value: 'materials', label: 'Материалы' },
  { value: 'warranty', label: 'Гарантийный случай' },
  { value: 'other', label: 'Другое' }
];

const PRIORITIES = [
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
  { value: 'other', label: 'Другое' },
];

const CONTACT_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Телефон' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const TicketForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'repair',
    priority: 'medium',
    email: '',
    full_name: '',
    phone: '',
    preferred_contact: 'email',
    property_type: 'apartment',
    property_address: '',
    property_area: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [ticketCreated, setTicketCreated] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (error[name]) {
      setError(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Валидация полей заявки
    if (!formData.subject.trim()) {
      errors.subject = 'Укажите тему обращения';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Опишите вашу проблему или запрос';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Описание должно содержать минимум 10 символов';
    }
    
    // Валидация контактных данных
    if (!formData.email.trim()) {
      errors.email = 'Укажите email для связи';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Укажите корректный email';
    }
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Укажите ваше имя';
    }
    
    // Валидация телефона только если он указан
    if (formData.phone.trim() && !/^\+?[0-9\s\-\(\)]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Укажите корректный номер телефона';
    }
    
    // Валидация адреса объекта, если это не консультация
    if (formData.category !== 'consultation' && !formData.property_address.trim()) {
      errors.property_address = 'Укажите адрес объекта';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setSnackbar({
        open: true,
        message: 'Пожалуйста, заполните все обязательные поля',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    setError({});
    
    try {
      // Подготавливаем данные для отправки
      const ticketData = {
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        
        // Добавляем информацию о заявителе в metadata
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
            area: formData.property_area
          }
        },
        
        // Добавляем первое сообщение
        messages: [
          {
            body: formData.description,
            sender_id: 999, // Временный ID для клиента
            content_type: 'text'
          }
        ]
      };
      
      console.log('Отправка данных заявки:', ticketData);
      
      // Отправляем данные на сервер
      const response = await ticketsApi.createTicket(ticketData);
      
      // Сохраняем данные о созданном тикете
      setTicketCreated(response.ticket);
      
      // Показываем сообщение об успехе
      setSnackbar({
        open: true,
        message: `Ваша заявка #${response.ticket.id} успешно отправлена! Мы отправили подтверждение на ваш email.`,
        severity: 'success'
      });
      
      // Сбрасываем форму
      setFormData({
        subject: '',
        description: '',
        category: 'repair',
        priority: 'medium',
        email: '',
        full_name: '',
        phone: '',
        preferred_contact: 'email',
        property_type: 'apartment',
        property_address: '',
        property_area: '',
      });
      
      // Уведомляем родительский компонент об успешном создании тикета
      if (onSubmitSuccess) {
        onSubmitSuccess(response.ticket);
      }
      
    } catch (err) {
      console.error('Ошибка при создании заявки:', err);
      
      setSnackbar({
        open: true,
        message: err.message || 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      {ticketCreated ? (
        // Показываем информацию о созданной заявке
        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'success.main' }}>
            Заявка успешно отправлена!
          </Typography>
          
          <Alert severity="success" sx={{ mb: 3 }}>
            Ваша заявка #{ticketCreated.id} принята в обработку. Наши специалисты свяжутся с вами в ближайшее время.
            Мы отправили подтверждение на указанный email: <strong>{formData.email}</strong>
          </Alert>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setTicketCreated(null)}
              sx={{ mr: 2 }}
            >
              Создать новую заявку
            </Button>
            
            <Button 
              variant="outlined"
              onClick={() => window.location.href = `/tickets/${ticketCreated.id}`}
            >
              Перейти к заявке
            </Button>
          </Box>
        </Box>
      ) : (
        // Показываем форму создания заявки
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Подать заявку
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Заполните форму ниже, и наши специалисты свяжутся с вами в ближайшее время.
            Обязательные поля отмечены звездочкой (*).
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              {/* Информация о заявителе */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Контактная информация
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Ваше имя"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  error={!!error.full_name}
                  helperText={error.full_name}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!error.email}
                  helperText={error.email || "На этот адрес будет отправлено подтверждение"}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Телефон"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                  error={!!error.phone}
                  helperText={error.phone}
                />
              </Grid>
              
          
              {/* Данные заявки */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
                  Информация о заявке
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Тема"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  error={!!error.subject}
                  helperText={error.subject}
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
                    {CATEGORIES.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
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
                    {PRIORITIES.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Описание"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  error={!!error.description}
                  helperText={error.description || 'Пожалуйста, подробно опишите вашу проблему или запрос'}
                />
              </Grid>
              
              {/* Информация об объекте */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
                  Информация об объекте {formData.category === 'consultation' && '(опционально)'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Тип объекта</InputLabel>
                  <Select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    label="Тип объекта"
                  >
                    {PROPERTY_TYPES.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Площадь (м²)"
                  name="property_area"
                  type="number"
                  value={formData.property_area}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required={formData.category !== 'consultation'}
                  fullWidth
                  label="Адрес объекта"
                  name="property_address"
                  value={formData.property_address}
                  onChange={handleChange}
                  error={!!error.property_address}
                  helperText={error.property_address}
                  placeholder="Укажите полный адрес объекта"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
      
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
    </Paper>
  );
};

export default TicketForm;