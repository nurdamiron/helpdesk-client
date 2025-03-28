// src/pages/HomePage.jsx
import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card,
  CardContent,
  Divider,
  Button
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  Engineering as EngineeringIcon,
  AssignmentTurnedIn as AssignmentIcon,
  SupportAgent as SupportIcon
} from '@mui/icons-material';
import TicketForm from '../components/ticket/TicketForm';

// Компонент для отображения услуги
const ServiceCard = ({ title, description, icon }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: 2, 
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}>
        {icon}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const [showTicketForm, setShowTicketForm] = useState(false);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          mb: 6,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h3" component="h1" gutterBottom>
            Корпоративный портал
          </Typography>
          <Typography variant="h5" gutterBottom>
            Система внутренних заявок сотрудников
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Здесь вы можете оставить заявку на решение внутренних вопросов и проблем.
            Наша команда специалистов оперативно обработает ваше обращение.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => setShowTicketForm(true)}
          >
            Создать заявку
          </Button>
        </Container>
      </Box>

      {/* Наши услуги */}
      <Container sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Доступные сервисы
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Техподдержка"
              description="Обслуживание компьютеров, настройка сети, программное обеспечение."
              icon={<ConstructionIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Хозяйственный отдел"
              description="Ремонт помещений, мебель, кондиционеры, освещение."
              icon={<EngineeringIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Администрация"
              description="Запросы на доступы и пропуска, вопросы к руководству."
              icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Отдел кадров"
              description="Кадровые документы, справки, отпуска, командировки."
              icon={<SupportIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ mb: 6 }} />

      {/* Форма заявки */}
      {showTicketForm ? (
        <Container sx={{ mb: 8 }}>
          <TicketForm 
            onSubmitSuccess={() => setShowTicketForm(false)} 
          />
        </Container>
      ) : (
        <Container sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Нужна помощь?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Заполните заявку, и наши специалисты оперативно возьмут в работу вашу проблему или запрос.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => setShowTicketForm(true)}
          >
            Создать заявку
          </Button>
        </Container>
      )}

      {/* Преимущества */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, mb: 6 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Преимущества системы
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Оперативная обработка
                </Typography>
                <Typography variant="body2">
                  Все заявки обрабатываются в кратчайшие сроки, с соблюдением внутренних SLA
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Прозрачность процессов
                </Typography>
                <Typography variant="body2">
                  Отслеживайте статус вашей заявки и своевременно получайте уведомления
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Единая система
                </Typography>
                <Typography variant="body2">
                  Все обращения фиксируются и обрабатываются в одной системе
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;