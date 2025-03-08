// src/pages/HomePage.jsx
import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Tabs, 
  Tab,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider
} from '@mui/material';
import {
  SupportAgent as SupportIcon,
  Engineering as EngineeringIcon,
  Construction as ConstructionIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import TicketForm from '../components/ticket/TicketForm';
import TicketStatusChecker from '../components/ticket/TicketStatusChecker';

// Компонент для отображения карточки с услугой
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

// Главная страница
const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          mb: 6
        }}
      >
        <Container>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h1" gutterBottom>
                Строительная помощь
              </Typography>
              <Typography variant="h5" gutterBottom>
                Портал клиентской поддержки
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Получите квалифицированную помощь по любым вопросам строительства, 
                ремонта и отделки. Наши специалисты ответят в кратчайшие сроки и 
                помогут решить вашу задачу!
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                onClick={() => setActiveTab(0)}
                sx={{ mr: 2 }}
              >
                Подать заявку
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                onClick={() => setActiveTab(1)}
                startIcon={<SearchIcon />}
              >
                Проверить статус
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              {/* Здесь можно добавить изображение или иллюстрацию */}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Наши услуги */}
      <Container sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Наши услуги
        </Typography>
        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          Комплексный подход к решению строительных задач любой сложности
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Ремонт и отделка"
              description="Капитальный и косметический ремонт квартир, офисов и коммерческих помещений с гарантией качества."
              icon={<ConstructionIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Проектирование"
              description="Разработка архитектурных проектов, планировочных решений и дизайн-проектов любой сложности."
              icon={<EngineeringIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Строительство"
              description="Полный цикл строительных работ от фундамента до кровли с соблюдением всех технологий."
              icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Консультации"
              description="Профессиональные консультации по всем вопросам строительства, ремонта и отделки."
              icon={<SupportIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ mb: 6 }} />

      {/* Форма заявки и проверка статуса */}
      <Container sx={{ mb: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Подать заявку" />
            <Tab label="Проверить статус" />
          </Tabs>
          
          {activeTab === 0 && <TicketForm />}
          {activeTab === 1 && <TicketStatusChecker />}
        </Paper>
      </Container>

      {/* Преимущества работы с нами */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, mb: 6 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Почему клиенты выбирают нас
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Опытная команда
                </Typography>
                <Typography variant="body2">
                  Наши специалисты имеют многолетний опыт в строительстве и решении сложных задач
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Гарантия качества
                </Typography>
                <Typography variant="body2">
                  Мы контролируем все этапы работ и даем гарантию на результат
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Техническая поддержка 24/7
                </Typography>
                <Typography variant="body2">
                  Круглосуточная поддержка и оперативное реагирование на запросы
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