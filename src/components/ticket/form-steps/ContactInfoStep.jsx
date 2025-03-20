// src/components/ticket/form-steps/ContactInfoStep.jsx
import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

/**
 * Компонент шага формы с контактной информацией
 * Байланыс ақпараты бар форма қадамының компоненті
 * 
 * @param {Object} formData - Данные формы
 * @param {Function} onChange - Обработчик изменения полей
 * @param {Object} errors - Объект с ошибками валидации
 */
const ContactInfoStep = ({ formData, onChange, errors }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PersonIcon sx={{ mr: 1 }} />
        Ваши контактные данные
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="full_name"
            name="full_name"
            label="Ваше полное имя"
            value={formData.full_name}
            onChange={onChange}
            error={!!errors.full_name}
            helperText={errors.full_name}
            placeholder="Иванов Иван Иванович"
            // Комментарий на казахском
            // Пайдаланушы толық аты-жөнін енгізетін өріс
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={onChange}
            error={!!errors.email}
            helperText={errors.email || "На этот адрес будет отправлено подтверждение"}
            placeholder="example@mail.com"
            // Комментарий на казахском
            // Пайдаланушының электрондық поштасы, растау хаты жіберіледі
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Телефон"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            error={!!errors.phone}
            helperText={errors.phone}
            placeholder="+7 (___) ___-__-__"
            // Комментарий на казахском
            // Пайдаланушының телефон нөмірі, міндетті емес
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Предпочтительный способ связи</FormLabel>
            <RadioGroup
              row
              id="preferred_contact"
              name="preferred_contact"
              value={formData.preferred_contact}
              onChange={onChange}
              // Комментарий на казахском
              // Қалаған байланыс әдісі
            >
              <FormControlLabel value="email" control={<Radio />} label="Email" />
              <FormControlLabel value="phone" control={<Radio />} label="Телефон" />
              <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Мы гарантируем конфиденциальность ваших персональных данных.
        Они будут использованы только для обработки вашей заявки.
        {/* Комментарий на казахском */}
        {/* Біз сіздің жеке деректеріңіздің құпиялылығына кепілдік береміз. 
        Олар тек сіздің өтініміңізді өңдеу үшін пайдаланылады. */}
      </Typography>
    </>
  );
};

export default ContactInfoStep;