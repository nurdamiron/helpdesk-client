// src/themes/theme.js
import { createTheme } from '@mui/material/styles';

// Создаем тему Material UI с синей цветовой гаммой
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Основной синий
      light: '#4791db',
      dark: '#115293',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0d47a1', // Темно-синий
      light: '#2f6bc2',
      dark: '#092f6e',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f', // Красный
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#2196f3', // Светло-синий
      light: '#64b5f6',
      dark: '#1976d2',
    },
    info: {
      main: '#0288d1', // Голубой
      light: '#03a9f4',
      dark: '#01579b',
    },
    success: {
      main: '#1565c0', // Ещё один синий оттенок
      light: '#1e88e5',
      dark: '#0d47a1',
    },
    background: {
      default: '#f5f8fa', // Светло-голубой фон
      paper: '#ffffff',
    },
    text: {
      primary: '#172b4d', // Темно-синий
      secondary: '#5e6c84', // Серо-синий
      disabled: '#8993a4',
    },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      fontFamily: 'Montserrat, sans-serif',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      fontFamily: 'Montserrat, sans-serif',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      fontFamily: 'Montserrat, sans-serif',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      fontFamily: 'Montserrat, sans-serif',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      fontFamily: 'Montserrat, sans-serif',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: 'Montserrat, sans-serif',
    },
    button: {
      textTransform: 'none', // Убираем all-caps для кнопок
      fontFamily: 'Montserrat, sans-serif',
    },
    body1: {
      fontFamily: 'Montserrat, sans-serif',
    },
    body2: {
      fontFamily: 'Montserrat, sans-serif',
    },
    subtitle1: {
      fontFamily: 'Montserrat, sans-serif',
    },
    subtitle2: {
      fontFamily: 'Montserrat, sans-serif',
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          fontFamily: 'Montserrat, sans-serif',
        },
        containedPrimary: {
          boxShadow: '0 2px 4px rgba(25, 118, 210, 0.25)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
          fontFamily: 'Montserrat, sans-serif',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontFamily: 'Montserrat, sans-serif',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minWidth: 100,
          fontFamily: 'Montserrat, sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Montserrat, sans-serif',
        }
      }
    }
  },
});

export default theme;