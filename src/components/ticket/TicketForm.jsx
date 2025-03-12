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
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Card,
  CardContent
} from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { ticketsApi } from '../../api/tickets';

// Categories for construction company tickets
const CATEGORIES = [
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

// Ticket priorities
const PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' }
];

// Property types
const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Частный дом' },
  { value: 'office', label: 'Офис' },
  { value: 'commercial', label: 'Коммерческое помещение' },
  { value: 'land', label: 'Земельный участок' },
  { value: 'other', label: 'Другое' },
];

// Contact methods
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
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [files, setFiles] = useState([]);
  const [ticketCreated, setTicketCreated] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check file size (max 5MB per file)
    const validFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== selectedFiles.length) {
      setSnackbar({
        open: true,
        message: 'Некоторые файлы не были добавлены, так как их размер превышает 5 МБ',
        severity: 'warning'
      });
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate ticket fields
    if (!formData.subject.trim()) {
      newErrors.subject = 'Укажите тему обращения';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Опишите вашу проблему или запрос';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    }
    
    // Validate contact details
    if (!formData.email.trim()) {
      newErrors.email = 'Укажите email для связи';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Укажите корректный email';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Укажите ваше имя';
    }
    
    // Validate phone only if provided
    if (formData.phone.trim() && !/^\+?[0-9\s\-\(\)]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Укажите корректный номер телефона';
    }
    
    // Validate property address unless it's a consultation
    if (formData.category !== 'consultation' && !formData.property_address.trim()) {
      newErrors.property_address = 'Укажите адрес объекта';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Пожалуйста, заполните все обязательные поля',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API
      const ticketData = {
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        
        // Add requester info in metadata
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
      
      console.log('Submitting ticket data:', ticketData);
      
      // Send data to server
      const response = await ticketsApi.createTicket(ticketData);
      
      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          try {
            await ticketsApi.uploadAttachment(response.ticket.id, file);
          } catch (fileErr) {
            console.error('Error uploading file:', fileErr);
            // Continue with other files even if one fails
          }
        }
      }
      
      // Save created ticket data
      setTicketCreated(response.ticket);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Ваша заявка #${response.ticket.id} успешно отправлена! Мы отправили подтверждение на ваш email.`,
        severity: 'success'
      });
      
      // Reset form
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
      setFiles([]);
      
      // Notify parent component
      if (onSubmitSuccess) {
        onSubmitSuccess(response.ticket);
      }
      
    } catch (err) {
      console.error('Error creating ticket:', err);
      
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
        // Show created ticket info
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
        // Show ticket creation form
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
              {/* Requester Information */}
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
                  error={!!errors.full_name}
                  helperText={errors.full_name}
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
                  error={!!errors.email}
                  helperText={errors.email || "На этот адрес будет отправлено подтверждение"}
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
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
              

          
              {/* Ticket Information */}
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
                  error={!!errors.subject}
                  helperText={errors.subject}
                  placeholder="Например: Ремонт ванной комнаты"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Категория</InputLabel>
                  <Select
                    labelId="category-label"
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
                  <InputLabel id="priority-label">Приоритет</InputLabel>
                  <Select
                    labelId="priority-label"
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
                  error={!!errors.description}
                  helperText={errors.description || 'Пожалуйста, подробно опишите вашу проблему или запрос'}
                />
              </Grid>
              
              {/* Property Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
                  Информация об объекте {formData.category === 'consultation' && '(опционально)'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="property-type-label">Тип объекта</InputLabel>
                  <Select
                    labelId="property-type-label"
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
                  error={!!errors.property_address}
                  helperText={errors.property_address}
                  placeholder="Укажите полный адрес объекта"
                />
              </Grid>

              {/* File Attachments */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
                  Прикрепить файлы (опционально)
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                >
                  Выбрать файлы
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
                
                {files.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Выбрано файлов: {files.length}
                    </Typography>
                    <Card variant="outlined" sx={{ mt: 1 }}>
                      <CardContent sx={{ py: 1 }}>
                        {files.map((file, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              py: 1,
                              borderBottom: index < files.length - 1 ? '1px solid #eee' : 'none'
                            }}
                          >
                            <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>
                              {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </Typography>
                            <Button 
                              color="error" 
                              size="small" 
                              onClick={() => removeFile(index)}
                            >
                              Удалить
                            </Button>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Box>
                )}
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
                  fullWidth
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