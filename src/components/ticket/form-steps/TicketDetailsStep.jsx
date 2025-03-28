// src/components/ticket/form-steps/TicketDetailsStep.jsx
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
import { Assignment as AssignmentIcon } from '@mui/icons-material';

// Категории для внутренних заявок
const CATEGORIES = [
  { value: 'repair', label: 'Ремонт и обслуживание' },
  { value: 'plumbing', label: 'Сантехника' },
  { value: 'electrical', label: 'Электрика' },
  { value: 'furniture', label: 'Мебель и оборудование' },
  { value: 'it', label: 'ИТ и связь' },
  { value: 'security', label: 'Безопасность' },
  { value: 'supplies', label: 'Канцтовары и расходники' },
  { value: 'cleaning', label: 'Клининг' },
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
 * 
 * @param {Object} formData - Данные формы
 * @param {Function} onChange - Обработчик изменения полей
 * @param {Object} errors - Объект с ошибками валидации
 */
const TicketDetailsStep = ({ formData, onChange, errors }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AssignmentIcon sx={{ mr: 1 }} />
        Детали обращения
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="subject"
            name="subject"
            label="Тема заявки *"
            value={formData.subject}
            onChange={onChange}
            error={!!errors.subject}
            helperText={errors.subject}
            placeholder="Например: Неисправность кондиционера в кабинете №205"
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
            label="Описание проблемы *"
            value={formData.description}
            onChange={onChange}
            error={!!errors.description}
            helperText={errors.description || "Подробно опишите суть проблемы, что и где неисправно"}
            multiline
            rows={4}
            placeholder="Опишите проблему максимально подробно: что произошло, где, когда, насколько срочно требуется решение"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
            <Typography variant="body2">
              Срочные заявки (приоритет "Срочный") обрабатываются в первую очередь. Пожалуйста, используйте этот приоритет только для действительно срочных случаев.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default TicketDetailsStep;