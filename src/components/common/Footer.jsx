// src/components/common/Footer.jsx
import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Support as SupportIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyName = import.meta.env.VITE_COMPANY_NAME || 'Корпоративная система';
  
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
              <AnalyticsIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                {companyName}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Корпоративная система управления процессами и коммуникациями
            </Typography>
          </Grid>

          {/* Колонка с навигацией */}
          {/* <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Навигация
            </Typography>
            <Box component="nav">
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <DashboardIcon sx={{ mr: 1, fontSize: 18 }} />
                Рабочий стол
              </Link>
              <Link
                component={RouterLink}
                to="/tasks"
                color="inherit"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <SupportIcon sx={{ mr: 1, fontSize: 18 }} />
                Заявки
              </Link>
              <Link
                component={RouterLink}
                to="/team"
                color="inherit"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <PeopleIcon sx={{ mr: 1, fontSize: 18 }} />
                Сотрудники
              </Link>
              <Link
                component={RouterLink}
                to="/settings"
                color="inherit"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <SettingsIcon sx={{ mr: 1, fontSize: 18 }} />
                Настройки
              </Link>
            </Box>
          </Grid> */}

          {/* Колонка с контактами */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Служба поддержки
            </Typography>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <LocationIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                г. Алматы
              </Typography>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
              <Link
                href="tel:+74951234567"
                color="inherit"
                underline="hover"
              >
                +7 700 000 00 01
              </Link>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
              <Link
                href="mailto:support@company.ru"
                color="inherit"
                underline="hover"
              >
                support@helpdesk.kz
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Нижняя часть футера */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {currentYear} {companyName}. Внутренняя система
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
              Служебные инструкции
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;