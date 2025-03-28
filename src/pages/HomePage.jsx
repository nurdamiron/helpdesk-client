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
            Строительная компания
          </Typography>
          <Typography variant="h5" gutterBottom>
            Профессиональные строительные услуги
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Мы предоставляем комплексные строительные услуги высокого качества. 
            Наша команда профессионалов готова воплотить в жизнь любые ваши идеи.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => setShowTicketForm(true)}
          >
            Оставить заявку
          </Button>
        </Container>
      </Box>

      {/* Наши услуги */}
      <Container sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Наши услуги
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Ремонт"
              description="Комплексный ремонт квартир, офисов и помещений под ключ."
              icon={<ConstructionIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Проектирование"
              description="Разработка архитектурных и дизайн-проектов любой сложности."
              icon={<EngineeringIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Строительство"
              description="Полный цикл строительных работ от фундамента до кровли."
              icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Консультации"
              description="Профессиональные консультации по всем вопросам строительства."
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
            Хотите начать проект?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Оставьте заявку, и наши специалисты свяжутся с вами для детального обсуждения вашего проекта.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => setShowTicketForm(true)}
          >
            Оставить заявку
          </Button>
        </Container>
      )}

      {/* Преимущества */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, mb: 6 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Почему выбирают нас
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Опыт и профессионализм
                </Typography>
                <Typography variant="body2">
                  Наши специалисты имеют многолетний опыт работы в строительстве
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Качество гарантировано
                </Typography>
                <Typography variant="body2">
                  Мы несем ответственность за качество выполненных работ
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Индивидуальный подход
                </Typography>
                <Typography variant="body2">
                  Каждый проект уникален и требует особого внимания
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