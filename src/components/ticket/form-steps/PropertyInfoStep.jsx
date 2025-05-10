// src/components/ticket/form-steps/PropertyInfoStep.jsx - Мүлік туралы ақпарат қадамы
import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

// Үй-жай түрлері
const PROPERTY_TYPES = [
  { value: 'office', label: 'Кеңсе үй-жайы' },
  { value: 'meeting_room', label: 'Келіссөз бөлмесі' },
  { value: 'restroom', label: 'Дәретхана' },
  { value: 'kitchen', label: 'Ас үй/асхана' },
  { value: 'hallway', label: 'Дәліз/холл' },
  { value: 'server_room', label: 'Сервер бөлмесі' },
  { value: 'warehouse', label: 'Қойма' },
  { value: 'other', label: 'Басқа' },
];

/**
 * Мәселенің орналасуы туралы ақпаратпен форма қадамының компоненті
 * 
 * @param {Object} formData - Форма деректері
 * @param {Function} onChange - Өрістердің өзгеруін өңдеуші
 * @param {Object} errors - Валидация қателері бар нысан
 */
const PropertyInfoStep = ({ formData, onChange, errors }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocationIcon sx={{ mr: 1 }} />
        Орналасуы
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          (Міндетті емес)
        </Typography>
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="property-type-label">Үй-жай түрі</InputLabel>
            <Select
              labelId="property-type-label"
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={onChange}
              label="Үй-жай түрі"
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
            id="property_area"
            name="property_area"
            label="Кабинет/бөлме нөірі"
            value={formData.property_area}
            onChange={onChange}
            placeholder="Мысалы: 205"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="property_address"
            name="property_address"
            label="Мекенжай немесе орналасқан жері туралы қосымша ақпарат"
            value={formData.property_address}
            onChange={onChange}
            error={!!errors.property_address}
            helperText={errors.property_address}
            placeholder="Мысалы: 2 қабат, солтүстік қанат, директор кабинетінің жанында"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
            <Typography variant="body2">
              Орналасқан жерді дәл көрсету өтінішті өңдеу процесін жеделдетуге көмектеседі. 
              Егер мәселе бірнеше жерде байқалса, мұны өтініш сипаттамасында көрсетіңіз.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PropertyInfoStep;