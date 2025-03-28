// src/components/ticket/form-steps/PropertyInfoStep.jsx
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

// Типы помещений
const PROPERTY_TYPES = [
  { value: 'office', label: 'Офисное помещение' },
  { value: 'meeting_room', label: 'Переговорная' },
  { value: 'restroom', label: 'Санузел' },
  { value: 'kitchen', label: 'Кухня/столовая' },
  { value: 'hallway', label: 'Коридор/холл' },
  { value: 'server_room', label: 'Серверная' },
  { value: 'warehouse', label: 'Склад' },
  { value: 'other', label: 'Другое' },
];

/**
 * Компонент шага формы с информацией о местоположении проблемы
 * 
 * @param {Object} formData - Данные формы
 * @param {Function} onChange - Обработчик изменения полей
 * @param {Object} errors - Объект с ошибками валидации
 */
const PropertyInfoStep = ({ formData, onChange, errors }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocationIcon sx={{ mr: 1 }} />
        Расположение
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          (Необязательно)
        </Typography>
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="property-type-label">Тип помещения</InputLabel>
            <Select
              labelId="property-type-label"
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={onChange}
              label="Тип помещения"
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
            label="Номер кабинета/комнаты"
            value={formData.property_area}
            onChange={onChange}
            placeholder="Например: 205"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="property_address"
            name="property_address"
            label="Адрес или дополнительная информация о расположении"
            value={formData.property_address}
            onChange={onChange}
            error={!!errors.property_address}
            helperText={errors.property_address}
            placeholder="Например: 2 этаж, северное крыло, рядом с кабинетом директора"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
            <Typography variant="body2">
              Точное указание расположения поможет ускорить процесс обработки заявки. 
              Если проблема наблюдается в нескольких местах, укажите это в описании заявки.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PropertyInfoStep;