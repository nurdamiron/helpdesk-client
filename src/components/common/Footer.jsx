// src/components/common/Footer.jsx
import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyName = import.meta.env.VITE_COMPANY_NAME || 'Құрылыс Көмегі';
  
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
      id="contacts"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Колонка с информацией о компании */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                {companyName}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Бизнеске арналған кәсіби құрылыс шешімдері. Жобалау, құрылыс және техникалық қадағалау.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Колонка с навигацией */}
          {/* <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Сайт картасы
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                underline="hover"
              >
                Басты бет
              </Link>
              <Link
                component={RouterLink}
                to="/#services"
                color="inherit"
                underline="hover"
              >
                Қызметтер
              </Link>
              <Link
                component={RouterLink}
                to="/#projects"
                color="inherit"
                underline="hover"
              >
                Жобалар
              </Link>
              <Link
                component={RouterLink}
                to="/#about"
                color="inherit"
                underline="hover"
              >
                Компания туралы
              </Link>
              <Link
                component={RouterLink}
                to="/careers"
                color="inherit"
                underline="hover"
              >
                Бос орындар
              </Link>
              <Link
                component={RouterLink}
                to="/#contacts"
                color="inherit"
                underline="hover"
              >
                Байланыс
              </Link>
              <Link
                component={RouterLink}
                to="/portal"
                color="inherit"
                underline="hover"
              >
                Корпоративтік портал
              </Link>
            </Box>
          </Grid> */}

          {/* Колонка с контактами */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Байланыс ақпараты
            </Typography>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.8)' }} />
              <Typography variant="body2">
                Алматы
              </Typography>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <PhoneIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.8)' }} />
              <Link
                href="tel:+74951234567"
                color="inherit"
                underline="hover"
              >
                +7 (747) 123-45-67
              </Link>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.8)' }} />
              <Link
                href="mailto:info@строй-помощь.рф"
                color="inherit"
                underline="hover"
              >
                info@helpdesk.kz
              </Link>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              Жұмыс уақыты: Дү-Жм 9:00-ден 18:00-ге дейін
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Нижняя часть футера */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {currentYear} {companyName}. Барлық құқықтар қорғалған
          </Typography>
          <Box>
            <Link
              color="inherit"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Құпиялылық саясаты
            </Link>
            <Link
              color="inherit"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Құқықтық ақпарат
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;