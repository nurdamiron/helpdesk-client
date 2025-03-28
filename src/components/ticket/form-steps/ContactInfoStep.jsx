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
  Radio,
  Box
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const ContactInfoStep = ({ formData, onChange, errors }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PersonIcon sx={{ mr: 1 }} />
        Информация о сотруднике
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="full_name"
            label="ФИО *"
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
            label="Корпоративный email *"
            type="email"
            value={formData.email}
            onChange={onChange}
            error={!!errors.email}
            helperText={errors.email || "Рабочий email для обратной связи"}
            placeholder="ivanov@company.ru"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="phone"
            label="Внутренний телефон"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            error={!!errors.phone}
            helperText={errors.phone}
            placeholder="доб. 123"
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
              <FormControlLabel value="messenger" control={<Radio />} label="Корп. мессенджер" />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
            <Typography variant="body2">
              Указанная информация будет использована для уточнения деталей заявки и информирования вас о ходе её выполнения.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ContactInfoStep;