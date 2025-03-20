// src/components/ticket/form-steps/PropertyInfoStep.jsx
import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

// Типы объектов недвижимости
const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Частный дом' },
  { value: 'office', label: 'Офис' },
  { value: 'commercial', label: 'Коммерческое помещение' },
  { value: 'land', label: 'Земельный участок' },
  { value: 'other', label: 'Другое' },
];

/**
 * Компонент шага формы с информацией об объекте
 * Нысан туралы ақпараты бар форма қадамының компоненті
 * 
 * @param {Object} formData - Данные формы
 * @param {Function} onChange - Обработчик изменения полей
 * @param {Object} errors - Объект с ошибками валидации
 */
const PropertyInfoStep = ({ formData, onChange, errors }) => {
  // Определяем, является ли адрес обязательным полем
  // Адрес обязателен для всех категорий, кроме консультации
  const isAddressRequired = formData.category !== 'consultation';

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <HomeIcon sx={{ mr: 1 }} />
        Информация об объекте
        {!isAddressRequired && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            (Опционально для консультаций)
          </Typography>
        )}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="property-type-label">Тип объекта</InputLabel>
            <Select
              labelId="property-type-label"
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={onChange}
              label="Тип объекта"
              // Комментарий на казахском
              // Нысан түрі (пәтер, үй, кеңсе және т.б.)
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
            label="Площадь (м²)"
            type="number"
            value={formData.property_area}
            onChange={onChange}
            InputProps={{ inputProps: { min: 0 } }}
            // Комментарий на казахском
            // Нысанның ауданы, шаршы метрмен
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required={isAddressRequired}
            fullWidth
            id="property_address"
            name="property_address"
            label="Адрес объекта"
            value={formData.property_address}
            onChange={onChange}
            error={!!errors.property_address}
            helperText={errors.property_address || "Укажите полный адрес объекта"}
            placeholder="Город, улица, дом, квартира"
            // Комментарий на казахском
            // Нысанның толық мекенжайы (қала, көше, үй, пәтер)
          />
        </Grid>
      </Grid>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Точная информация об объекте поможет нам корректно оценить объем работ и подготовить предложение.
        {/* Комментарий на казахском */}
        {/* Нысан туралы нақты ақпарат бізге жұмыс көлемін дұрыс бағалауға 
        және ұсыныс дайындауға көмектеседі. */}
      </Typography>
    </>
  );
};

export default PropertyInfoStep;