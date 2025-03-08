// src/themes/theme.js
import { createTheme } from '@mui/material/styles';

// Создаем тему Material UI со строительной цветовой гаммой
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6600', // Оранжевый - характерный для строительной тематики
      light: '#ff8533',
      dark: '#cc5200',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2c3e50', // Темно-синий
      light: '#3e5771',
      dark: '#1a2530',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e74c3c', // Красный
      light: '#ec7063',
      dark: '#b83c30',
    },
    warning: {
      main: '#f39c12', // Желтый
      light: '#f5b041',
      dark: '#d68910',
    },
    info: {
      main: '#3498db', // Голубой
      light: '#5dade2',
      dark: '#2980b9',
    },
    success: {
      main: '#27ae60', // Зеленый
      light: '#2ecc71',
      dark: '#219955',
    },
    background: {
      default: '#ecf0f1', // Светло-серый
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50', // Темно-синий
      secondary: '#7f8c8d', // Серый
      disabled: '#95a5a6',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // Убираем all-caps для кнопок
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
        },
        containedPrimary: {
          boxShadow: '0 2px 4px rgba(255, 102, 0, 0.25)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(255, 102, 0, 0.3)',
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
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minWidth: 100,
        },
      },
    },
  },
});

export default theme;