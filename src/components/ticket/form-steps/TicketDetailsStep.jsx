// src/components/ticket/form-steps/TicketDetailsStep.jsx
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
import { FormatListBulleted as ListIcon } from '@mui/icons-material';

// Категории для заявок строительной компании
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

// Приоритеты заявок
const PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' }
];

/**
 * Компонент шага формы с деталями заявки
 * Өтінім егжей-тегжейлері бар форма қадамының компоненті
 * 
 * @param {Object} formData - Данные формы
 * @param {Function} onChange - Обработчик изменения полей
 * @param {Object} errors - Объект с ошибками валидации
 */
const TicketDetailsStep = ({ formData, onChange, errors }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ListIcon sx={{ mr: 1 }} />
        Детали заявки
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="subject"
            name="subject"
            label="Тема заявки"
            value={formData.subject}
            onChange={onChange}
            error={!!errors.subject}
            helperText={errors.subject}
            placeholder="Например: Ремонт ванной комнаты"
            // Комментарий на казахском
            // Өтінімнің тақырыбы, қысқаша сипаттамасы
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Категория</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={onChange}
              label="Категория"
              // Комментарий на казахском
              // Өтінім категориясы
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
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={onChange}
              label="Приоритет"
              // Комментарий на казахском
              // Өтінім басымдылығы
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
            id="description"
            name="description"
            label="Описание проблемы или запроса"
            value={formData.description}
            onChange={onChange}
            error={!!errors.description}
            helperText={errors.description || "Подробно опишите, что нужно сделать"}
            multiline
            rows={5}
            placeholder="Опишите детали вашей заявки: что необходимо сделать, проблемы, пожелания, сроки и т.д."
            // Комментарий на казахском
            // Мәселенің толық сипаттамасы, не істеу керек, мәселелер, тілектер, мерзімдер
          />
        </Grid>
      </Grid>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Чем подробнее вы опишете вашу проблему или запрос, тем быстрее и точнее мы сможем вам помочь.
        {/* Комментарий на казахском */}
        {/* Сіз мәселеңізді немесе сұрауыңызды неғұрлым толық сипаттасаңыз, 
        біз сізге соғұрлым тезірек және дәлірек көмектесе аламыз. */}
      </Typography>
    </>
  );
};

export default TicketDetailsStep;