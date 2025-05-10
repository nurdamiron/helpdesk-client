/**
 * Набор стилей и настроек для анимаций пользовательского интерфейса
 */

// Стандартные настройки для Material UI переходов
export const transitionConfig = {
  // Стандартные значения для fade-анимаций
  fade: {
    initial: { 
      default: 800,
      fast: 400,
      slow: 1200
    },
    // Задержки для последовательных анимаций
    delayBase: 200
  },
  
  // Стандартные значения для масштабирования
  scale: {
    initial: { 
      default: 600,
      fast: 300,
      slow: 900
    }
  },
  
  // Стандартные значения для grow-анимаций
  grow: {
    initial: { 
      default: 600,
      fast: 300,
      slow: 900
    }
  },

  // Стандартные значения для slide-анимаций
  slide: {
    initial: { 
      default: 500,
      fast: 250,
      slow: 800
    }
  },
  
  // Эффекты при наведении для карточек и кнопок
  hover: {
    button: {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease'
    },
    card: {
      transform: 'translateY(-8px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }
  },
  
  // Базовые keyframes для использования в CSS анимациях
  keyframes: {
    bounce: {
      '@keyframes bounce': {
        '0%, 20%, 50%, 80%, 100%': {
          transform: 'translateY(0)'
        },
        '40%': {
          transform: 'translateY(-20px)'
        },
        '60%': {
          transform: 'translateY(-10px)'
        }
      },
      animation: 'bounce 2s infinite'
    },
    pulse: {
      '@keyframes pulse': {
        '0%': {
          transform: 'scale(1)'
        },
        '50%': {
          transform: 'scale(1.05)'
        },
        '100%': {
          transform: 'scale(1)'
        }
      },
      animation: 'pulse 2s infinite'
    },
    fadeIn: {
      '@keyframes fadeIn': {
        from: {
          opacity: 0
        },
        to: {
          opacity: 1
        }
      },
      animation: 'fadeIn 0.5s ease-in-out'
    },
    slideUp: {
      '@keyframes slideUp': {
        from: {
          transform: 'translateY(20px)',
          opacity: 0
        },
        to: {
          transform: 'translateY(0)',
          opacity: 1
        }
      },
      animation: 'slideUp 0.5s ease-out'
    },
    ripple: {
      '@keyframes ripple': {
        '0%': {
          transform: 'scale(0)',
          opacity: 1
        },
        '100%': {
          transform: 'scale(1.5)',
          opacity: 0
        }
      }
    }
  }
};

// Функция для генерации стилей анимации для компонентов
export const getAnimationStyle = (type, variant = 'default', delay = 0) => {
  const baseConfig = transitionConfig[type]?.initial || {};
  const timeout = baseConfig[variant] || 500;
  
  return {
    timeout,
    style: delay ? { transitionDelay: `${delay}ms` } : undefined
  };
};

// Функция для расчета задержки анимации для последовательности
export const getSequentialDelay = (index, baseDelay = transitionConfig.fade.delayBase) => {
  return baseDelay * index;
};

// Готовые комбинации стилей с анимациями для использования в MUI sx пропе
export const animatedStyles = {
  // Для кнопок с эффектом при наведении и нажатии
  button: {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
    },
    '&:active': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    }
  },
  
  // Для карточек с эффектами при наведении
  card: {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
    }
  },
  
  // Секция с подчеркиванием после заголовка
  titledSection: {
    position: 'relative',
    marginBottom: 5,
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 60,
      height: 4,
      backgroundColor: 'primary.main',
      bottom: -10,
      left: '50%',
      transform: 'translateX(-50%)',
      borderRadius: 2
    }
  },
  
  // Для ripple эффекта (например, для статусных индикаторов)
  ripple: {
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.5s infinite',
      background: 'inherit',
      zIndex: -1
    }
  }
};

export default {
  transitionConfig,
  getAnimationStyle,
  getSequentialDelay,
  animatedStyles
}; 