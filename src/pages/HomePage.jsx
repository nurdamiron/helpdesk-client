// src/pages/HomePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  SupportAgent as SupportIcon,
  Feedback as FeedbackIcon,
  Lightbulb as IdeaIcon,
  ChatBubble as ChatIcon
} from '@mui/icons-material';
import TicketForm from '../components/ticket/TicketForm';

// Өтініш түрін көрсету компоненті
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
  const navigate = useNavigate();

  // Обработчик успешной отправки заявки
  const handleSubmitSuccess = (ticket) => {
    // Перенаправляем на страницу успеха с данными о заявке
    navigate(`/success/${ticket.id}`, { 
      state: { 
        ticket,
        authorized: true,
        emailSent: ticket.email_sent 
      }
    });
  };

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
            Ішкі өтініштер порталы
          </Typography>
          <Typography variant="h5" gutterBottom>
            Өтініштер, ұсыныстар және кері байланыс жүйесі
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Мұнда сіз компания жұмысын жақсарту бойынша кез келген сұрақты, шағымды немесе ұсынысты жібере аласыз.
            Сіздің өтінішіңізбен жауапты қызметкерлер айналысады.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => setShowTicketForm(true)}
          >
            Өтініш жасау
          </Button>
        </Container>
      </Box>

      {/* Өтініш түрлері */}
      <Container sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Өтініш түрлері
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Сұраныстар"
              description="Ақпарат алу, қол жеткізу, көмеk немесе басқа ресурстар бойынша сұраныстар."
              icon={<SupportIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Шағымдар"
              description="Жұмыс мәселелері бойынша проблемалар немесе қанағаттанбаушылық туралы хабарлау."
              icon={<FeedbackIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Ұсыныстар"
              description="Жұмыс процестері мен еңбек жағдайларын жақсарту бойынша идеялар."
              icon={<IdeaIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ServiceCard
              title="Кері байланыс"
              description="Пікір алмасу және компания басшылығына арналған хабарламалар."
              icon={<ChatIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ mb: 6 }} />

      {/* Өтініш формасы */}
      {showTicketForm ? (
        <Container sx={{ mb: 8 }}>
          <TicketForm 
            onSubmitSuccess={handleSubmitSuccess} 
          />
        </Container>
      ) : (
        <Container sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Сіздің пікіріңіз біз үшін маңызды
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Біз ыңғайлы жұмыс ортасын құруға және процестерді үнемі жетілдіруге тырысамыз.
            Сіздің өтініштеріңіз бізге жақсырақ болуға көмектеседі.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => setShowTicketForm(true)}
          >
            Өтініш жасау
          </Button>
        </Container>
      )}

      {/* Артықшылықтар */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, mb: 6 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Біздің жұмыс қағидаттарымыз
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Құпиялылық
                </Typography>
                <Typography variant="body2">
                  Барлық өтініштер ақпараттың құпиялылығын сақтай отырып өңделеді
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Жеделділік
                </Typography>
                <Typography variant="body2">
                  Біз әр өтінішті ең қысқа мерзімде қарастырамыз
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Айқындылық
                </Typography>
                <Typography variant="body2">
                  Сіз өз өтінішіңіздің мәртебесін нақты уақыт режимінде қадағалай аласыз
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