// src/components/ticket/form-steps/ContactInfoStep.jsx - Байланыс ақпаратының қадамы
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
  Box,
  InputAdornment
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

/**
 * Байланыс ақпаратын енгізу қадамы компоненті
 *
 * @param {Object} formData - Форма деректері
 * @param {Function} onChange - Өзгерісті өңдеу функциясы
 * @param {Object} errors - Валидация қателіктері
 */
const ContactInfoStep = ({ formData, onChange, errors }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Байланыс ақпараты
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Өз байланыс деректеріңізді көрсетіңіз
      </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
          <TextField
            fullWidth
          label="Аты-жөні"
            name="full_name"
            value={formData.full_name}
            onChange={onChange}
          required
            error={!!errors.full_name}
            helperText={errors.full_name}
            placeholder="Иванов Иван Иванович"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
          label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
          required
            error={!!errors.email}
          helperText={errors.email}
          placeholder="аты@компания.kz"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Бөлім"
          name="department"
          value={formData.department}
          onChange={onChange}
          required
          error={!!errors.department}
          helperText={errors.department}
          placeholder="Бөлім атауы"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Лауазымы"
          name="position"
          value={formData.position}
          onChange={onChange}
          placeholder="Сіздің лауазымыңыз"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIcon />
              </InputAdornment>
            ),
          }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
          label="Телефон"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            error={!!errors.phone}
            helperText={errors.phone}
          placeholder="+7 (XXX) XXX-XX-XX"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon />
              </InputAdornment>
            ),
          }}
          />
        </Grid>
        
      <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
          <FormLabel component="legend">Қалаулы байланыс әдісі</FormLabel>
            <RadioGroup
              row
              name="preferred_contact"
              value={formData.preferred_contact}
              onChange={onChange}
            >
              <FormControlLabel value="email" control={<Radio />} label="Email" />
              <FormControlLabel value="phone" control={<Radio />} label="Телефон" />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
            <Typography variant="body2">
            Көрсетілген ақпарат өтініштің мәліметтерін нақтылау және оның орындалу барысы туралы сізге хабарлау үшін пайдаланылады.
            </Typography>
          </Box>
        </Grid>
      </Grid>
  );
};

export default ContactInfoStep;