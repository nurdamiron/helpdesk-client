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

const ContactInfoStep = ({ formData, onChange, errors }) => {
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Подать заявку
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Заполните форму ниже, и наши специалисты свяжутся с вами в ближайшее время. Обязательные поля отмечены звездочкой (*).
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="full_name"
            label="Ваше полное имя *"
            value={formData.full_name}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
              onChange={onChange}
            >
              <FormControlLabel value="email" control={<Radio />} label="Email" />
              <FormControlLabel value="phone" control={<Radio />} label="Телефон" />
              <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Мы гарантируем конфиденциальность ваших персональных данных. Они будут использованы только для обработки вашей заявки.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default ContactInfoStep;