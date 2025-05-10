// src/components/ticket/TicketStatusChecker.jsx - Өтініш мәртебесін тексеру компоненті
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

// Табылған өтініш туралы ақпаратты көрсететін компонент
const TicketInfo = ({ ticket }) => {
  // Статус мәтінін қазақ тілінде алу функциясы
  const getStatusText = (status) => {
    const statusMap = {
      'new': 'Жаңа',
      'open': 'Ашық',
      'in_progress': 'Өңделуде',
      'pending': 'Жауап күтілуде',
      'resolved': 'Шешілді',
      'closed': 'Жабылды'
    };
    return statusMap[status] || status;
  };

  // Статус түсін алу функциясы
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

  // Басымдық мәтінін қазақ тілінде алу функциясы
  const getPriorityText = (priority) => {
    const priorityMap = {
      'low': 'Төмен',
      'medium': 'Орташа',
      'high': 'Жоғары',
      'urgent': 'Шұғыл'
    };
    return priorityMap[priority] || priority;
  };

  // Басымдық түсін алу функциясы
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
        Өтініш туралы ақпарат #{ticket.id}
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Күйі:
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
              Басымдық:
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
          Құрылған күні: {formatDate(ticket.created_at)}
        </Typography>
        
        {ticket.updated_at && (
          <Typography variant="body2" color="text.secondary">
            Соңғы жаңарту: {formatDate(ticket.updated_at)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Өтініш мәртебесін тексеру үшін негізгі компонент
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
      setError('Өтініш нөірін енгізіңіз');
      return;
    }
    
    setLoading(true);
    setError(null);
    setTicket(null);
    
    try {
      const response = await ticketsApi.getTicketById(ticketId);
      setTicket(response.ticket);
    } catch (err) {
      console.error('Өтінішті іздеу кезінде қате:', err);
      
      if (err.status === 404) {
        setError('Көрсетілген нөмірмен өтініш табылмады');
      } else {
        setError('Өтінішті іздеу кезінде қате пайда болды. Кейінірек қайталап көріңіз.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Өтініш мәртебесін тексеру
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Өтінішіңіздің ағымдағы мәртебесі мен мәліметтерін білу үшін өтініш нөмірін енгізіңіз
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Өтініш нөмірі"
            name="ticketId"
            value={ticketId}
            onChange={handleChange}
            variant="outlined"
            placeholder="Мысалы: 1234"
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
            {loading ? 'Іздеу...' : 'Табу'}
          </Button>
        </Box>
      </Box>
      
      {/* Табылған өтінішті немесе хабарламаны көрсету */}
      {ticket ? (
        <TicketInfo ticket={ticket} />
      ) : !error && !loading && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Өтінішті тіркеу кезінде алған өтініш нөмірін енгізіңіз
        </Alert>
      )}
    </Paper>
  );
};

export default TicketStatusChecker;