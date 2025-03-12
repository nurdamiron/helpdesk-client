// src/components/ticket/TicketStatusChecker.jsx
import { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ticketsApi } from '../../api/tickets';
import { formatDate } from '../../utils/dateUtils';

// Component to display found ticket information
const TicketInfo = ({ ticket }) => {
  // Function to get status text in Russian
  const getStatusText = (status) => {
    const statusMap = {
      'new': 'Новый',
      'open': 'Открыт',
      'in_progress': 'В работе',
      'pending': 'Ожидает ответа',
      'resolved': 'Решен',
      'closed': 'Закрыт'
    };
    return statusMap[status] || status;
  };

  // Function to get status color
  const getStatusColor = (status) => {
    const colorMap = {
      'new': 'info',
      'open': 'primary',
      'in_progress': 'secondary',
      'pending': 'warning',
      'resolved': 'success',
      'closed': 'default'
    };
    return colorMap[status] || 'default';
  };

  // Function to get priority text in Russian
  const getPriorityText = (priority) => {
    const priorityMap = {
      'low': 'Низкий',
      'medium': 'Средний',
      'high': 'Высокий',
      'urgent': 'Срочный'
    };
    return priorityMap[priority] || priority;
  };

  // Function to get priority color
  const getPriorityColor = (priority) => {
    const colorMap = {
      'low': 'success',
      'medium': 'info',
      'high': 'warning',
      'urgent': 'error'
    };
    return colorMap[priority] || 'default';
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Информация о заявке #{ticket.id}
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Статус:
            </Typography>
            <Chip 
              label={getStatusText(ticket.status)} 
              color={getStatusColor(ticket.status)}
              size="small"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Приоритет:
            </Typography>
            <Chip 
              label={getPriorityText(ticket.priority)} 
              color={getPriorityColor(ticket.priority)}
              size="small"
            />
          </Box>
        </Grid>
      </Grid>
      
      <Typography variant="subtitle1">
        {ticket.subject}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
        {ticket.description}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Дата создания: {formatDate(ticket.created_at)}
        </Typography>
        
        {ticket.updated_at && (
          <Typography variant="body2" color="text.secondary">
            Последнее обновление: {formatDate(ticket.updated_at)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Main component for checking ticket status
const TicketStatusChecker = () => {
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setTicketId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ticketId) {
      setError('Пожалуйста, введите номер заявки');
      return;
    }
    
    setLoading(true);
    setError(null);
    setTicket(null);
    
    try {
      const response = await ticketsApi.getTicketById(ticketId);
      setTicket(response.ticket);
    } catch (err) {
      console.error('Ошибка при поиске заявки:', err);
      
      if (err.status === 404) {
        setError('Заявка с указанным номером не найдена');
      } else {
        setError('Произошла ошибка при поиске заявки. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Проверить статус заявки
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Введите номер вашей заявки, чтобы узнать её текущий статус и детали
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Номер заявки"
            name="ticketId"
            value={ticketId}
            onChange={handleChange}
            variant="outlined"
            placeholder="Например: 1234"
            error={!!error}
            helperText={error}
            sx={{ mr: 2 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            sx={{ height: 56, flexShrink: 0 }}
          >
            {loading ? 'Поиск...' : 'Найти'}
          </Button>
        </Box>
      </Box>
      
      {/* Display found ticket or message */}
      {ticket ? (
        <TicketInfo ticket={ticket} />
      ) : !error && !loading && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Введите номер заявки, который вы получили при регистрации обращения
        </Alert>
      )}
    </Paper>
  );
};

export default TicketStatusChecker;