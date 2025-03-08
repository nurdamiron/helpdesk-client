// src/components/common/Footer.jsx
import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import {
  Construction as ConstructionIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  // Текущий год для копирайта
  const currentYear = new Date().getFullYear();
  
  // Название компании из переменных окружения или по умолчанию
  const companyName = import.meta.env.VITE_COMPANY_NAME || 'СтройМастер';
  
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Колонка с информацией о компании */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ConstructionIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                {companyName}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Строительная компания с многолетним опытом. Качественное выполнение работ любой сложности в срок.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Колонка с навигацией */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Навигация
            </Typography>
            <Box component="nav">
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                underline="hover"
                sx={{ display: 'block', mb: 1 }}
              >
                Главная
              </Link>
              <Link
                component={RouterLink}
                to="/#services"
                color="inherit"
                underline="hover"
                sx={{ display: 'block', mb: 1 }}
              >
                Услуги
              </Link>
              <Link
                component={RouterLink}
                to="/#about"
                color="inherit"
                underline="hover"
                sx={{ display: 'block', mb: 1 }}
              >
                О компании
              </Link>
              <Link
                component={RouterLink}
                to="/#contacts"
                color="inherit"
                underline="hover"
                sx={{ display: 'block', mb: 1 }}
              >
                Контакты
              </Link>
              <Link
                component={RouterLink}
                to="/#faq"
                color="inherit"
                underline="hover"
                sx={{ display: 'block', mb: 1 }}
              >
                Часто задаваемые вопросы
              </Link>
            </Box>
          </Grid>

          {/* Колонка с контактами */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Контакты
            </Typography>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <LocationIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                г. Москва, ул. Строителей, д. 1, офис 123
              </Typography>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
              <Link
                href="tel:+74951234567"
                color="inherit"
                underline="hover"
              >
                +7 (495) 123-45-67
              </Link>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
              <Link
                href="mailto:info@строймастер.рф"
                color="inherit"
                underline="hover"
              >
                info@строймастер.рф
              </Link>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Режим работы: Пн-Пт с 9:00 до 18:00
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Нижняя часть футера */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {currentYear} {companyName}. Все права защищены.
          </Typography>
          <Box>
            <Link
              color="inherit"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Политика конфиденциальности
            </Link>
            <Link
              color="inherit"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Пользовательское соглашение
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;