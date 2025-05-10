import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress } from '@mui/material';
import SuccessMessage from '../components/ticket/form-steps/SuccessMessage';
import SecurityMessage from '../components/security/SecurityMessage';
import { ticketsApi } from '../api/tickets';

/**
 * Страница успешной отправки заявки
 * Проверяет, что пользователь действительно только что отправил заявку
 * и отображает страницу успеха или сообщение безопасности
 */
const SubmissionSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [emailSent, setEmailSent] = useState(null);

  useEffect(() => {
    const checkAndLoadTicket = async () => {
      // Проверяем, есть ли в state данные, переданные при переходе на страницу
      if (location.state?.ticket && location.state?.authorized) {
        setTicket(location.state.ticket);
        setAuthorized(true);
        setEmailSent(location.state.emailSent);
        setLoading(false);
        return;
      }

      // Если нет данных в state, пробуем загрузить тикет по ID
      try {
        // Грузим данные о заявке
        const response = await ticketsApi.getTicketById(id);
        
        // Устанавливаем тикет, но не разрешаем доступ (будет показано сообщение безопасности)
        setTicket(response.ticket);
        setAuthorized(false);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки заявки:', error);
        // Если заявка не найдена, перенаправляем на главную
        navigate('/');
      }
    };

    checkAndLoadTicket();
  }, [id, location.state, navigate]);

  // Пока загружаем данные, показываем индикатор загрузки
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Если доступ не разрешен, показываем сообщение безопасности
  if (!authorized) {
    return <SecurityMessage />;
  }

  // Если все проверки пройдены, показываем сообщение об успешной отправке
  return (
    <Box sx={{ py: 4 }}>
      <SuccessMessage 
        ticket={ticket}
        email={ticket.metadata?.employee?.email || ticket.requester_email || ''}
        onCreateNew={() => navigate('/')}
        emailSent={emailSent}
      />
    </Box>
  );
};

export default SubmissionSuccessPage; 