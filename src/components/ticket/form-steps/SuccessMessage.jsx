// src/components/ticket/form-steps/SuccessMessage.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  Link
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { formatDate } from '../../../utils/dateUtils';

/**
 * Компонент с сообщением об успешном создании заявки
 * 
 * @param {Object} ticket - Данные созданной заявки
 * @param {string} email - Email, на который отправлено подтверждение
 * @param {Function} onCreateNew - Обработчик для создания новой заявки
 */
const SuccessMessage = ({ ticket, email, onCreateNew }) => {
  // Получение URL для просмотра заявки
  const ticketUrl = `/tickets/${ticket.id}`;

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom>
          Заявка принята
        </Typography>
        
        <Typography variant="h6" color="text.secondary">
          Ваше обращение #{ticket.id} успешно зарегистрировано
        </Typography>
      </Box>
      
      <Alert severity="success" sx={{ mb: 4 }}>
        Уведомление отправлено на ваш email: <strong>{email}</strong>
      </Alert>
      
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Информация о заявке
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              {ticket.subject}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ticket.description}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="body2">
              <strong>Номер заявки:</strong> {ticket.id}
            </Typography>
            
            <Typography variant="body2">
              <strong>Дата создания:</strong> {formatDate(ticket.created_at)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mt: 1 }}>
            <Typography variant="body2">
              <strong>Статус:</strong> Открыта
            </Typography>
            
            <Typography variant="body2">
              <strong>Приоритет:</strong> {
                ticket.priority === 'low' ? 'Низкий' :
                ticket.priority === 'medium' ? 'Средний' :
                ticket.priority === 'high' ? 'Высокий' :
                ticket.priority === 'urgent' ? 'Срочный' : 
                ticket.priority
              }
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
        <AccessTimeIcon sx={{ color: 'warning.main', mr: 2, fontSize: 40 }} />
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Ожидаемое время обработки
          </Typography>
          <Typography variant="body2">
            {ticket.priority === 'urgent' ? 'В течение 2 часов' :
             ticket.priority === 'high' ? 'В течение рабочего дня' :
             ticket.priority === 'medium' ? 'В течение 2 рабочих дней' :
             'В течение 3-5 рабочих дней'}
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body1" paragraph align="center" sx={{ mt: 4 }}>
        Ответственный сотрудник рассмотрит вашу заявку и свяжется с вами при необходимости.
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href={ticketUrl}
          startIcon={<HomeIcon />}
        >
          Перейти к заявке
        </Button>
        
        <Button
          variant="outlined"
          onClick={onCreateNew}
          startIcon={<RefreshIcon />}
        >
          Создать новую заявку
        </Button>
      </Box>
    </Paper>
  );
};

export default SuccessMessage;