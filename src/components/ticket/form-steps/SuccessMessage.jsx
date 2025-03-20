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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { formatDate } from '../../../utils/dateUtils';

/**
 * Компонент с сообщением об успешном создании заявки
 * Өтінімді сәтті жасау туралы хабарламасы бар компонент
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
          Заявка успешно отправлена!
          {/* Комментарий на казахском */}
          {/* Өтінім сәтті жіберілді! */}
        </Typography>
        
        <Typography variant="h6" color="text.secondary">
          Ваша заявка #{ticket.id} принята в обработку
          {/* Комментарий на казахском */}
          {/* Сіздің #{ticket.id} өтініміңіз өңдеуге қабылданды */}
        </Typography>
      </Box>
      
      <Alert severity="success" sx={{ mb: 4 }}>
        Подтверждение отправлено на email: <strong>{email}</strong>
        {/* Комментарий на казахском */}
        {/* Растау электрондық поштаға жіберілді: */}
      </Alert>
      
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Информация о заявке
            {/* Комментарий на казахском */}
            {/* Өтінім туралы ақпарат */}
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
              {/* Комментарий на казахском */}
              {/* Өтінім нөмірі: */}
            </Typography>
            
            <Typography variant="body2">
              <strong>Дата создания:</strong> {formatDate(ticket.created_at)}
              {/* Комментарий на казахском */}
              {/* Жасалған күні: */}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mt: 1 }}>
            <Typography variant="body2">
              <strong>Статус:</strong> Новая
              {/* Комментарий на казахском */}
              {/* Мәртебесі: Жаңа */}
            </Typography>
            
            <Typography variant="body2">
              <strong>Приоритет:</strong> {
                ticket.priority === 'low' ? 'Низкий' :
                ticket.priority === 'medium' ? 'Средний' :
                ticket.priority === 'high' ? 'Высокий' :
                ticket.priority === 'urgent' ? 'Срочный' : 
                ticket.priority
              }
              {/* Комментарий на казахском */}
              {/* Басымдық: */}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      <Typography variant="body1" paragraph align="center">
        Наши специалисты свяжутся с вами в ближайшее время.
        {/* Комментарий на казахском */}
        {/* Біздің мамандар жақын арада сізбен байланысады. */}
      </Typography>
      
      <Typography variant="body2" paragraph color="text.secondary" align="center">
        Вы можете отслеживать статус вашей заявки в любое время.
        Обратите внимание, что сроки обработки зависят от категории и сложности заявки.
        {/* Комментарий на казахском */}
        {/* Сіз өтініміңіздің мәртебесін кез келген уақытта қадағалай аласыз.
        Өңдеу мерзімдері өтінімнің санаты мен күрделілігіне байланысты екенін ескеріңіз. */}
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
          {/* Комментарий на казахском */}
          {/* Өтінімге өту */}
        </Button>
        
        <Button
          variant="outlined"
          onClick={onCreateNew}
          startIcon={<RefreshIcon />}
        >
          Создать новую заявку
          {/* Комментарий на казахском */}
          {/* Жаңа өтінім жасау */}
        </Button>
      </Box>
    </Paper>
  );
};

export default SuccessMessage;