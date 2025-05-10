// src/components/common/Header.jsx
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Construction as ConstructionIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ApiStatusIndicator from './ApiStatusIndicator';

// Обновленные пункты меню для корпоративного сайта
const pages = [
  { title: '', path: '/' },
  { title: '', path: '/#projects' },
  { title: '', path: '/#services' },
  { title: '', path: '/#about' },
  { title: '', path: '/#careers' },
  { title: '', path: '/#contacts' }
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - desktop */}
          <ConstructionIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Құрылыс Көмегі | Корпоративтік сайт
          </Typography>

          {/* Menu - mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="навигация мәзірі"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            
            {/* Drawer для мобильного меню */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    Мәзір
                  </Typography>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                
                <List>
                  {pages.map((page) => (
                    <ListItem key={page.title} disablePadding>
                      <ListItemButton component={RouterLink} to={page.path}>
                        <ListItemText primary={page.title} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </Box>

          {/* Logo - mobile */}
          <ConstructionIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Құрылыс Көмегі
          </Typography>

          {/* Menu - desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                sx={{ mx: 1, color: 'text.primary', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Right section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/portal"
              sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}
            >
              Жүйеге кіру
            </Button>
            
            {/* API Status Indicator */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <ApiStatusIndicator />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;