import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

/**
 * Универсальный контейнер с анимациями появления
 */
const AnimatedContainer = forwardRef(({
  children,
  animation = 'fade',
  delay = 0, 
  duration = 0.5,
  variant = 'default',
  isVisible: externalIsVisible,
  sx = {},
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Настройки анимации в зависимости от варианта
  const getDuration = () => {
    if (variant === 'fast') return 0.3;
    if (variant === 'slow') return 0.8;
    return duration;
  };
  
  // Анимации появления
  const animationStyles = {
    fade: {
      opacity: 0,
      transition: `opacity ${getDuration()}s ease-out ${delay}ms`,
    },
    slide: {
      opacity: 0,
      transform: 'translateY(20px)',
      transition: `opacity ${getDuration()}s ease-out ${delay}ms, transform ${getDuration()}s ease-out ${delay}ms`,
    },
    zoom: {
      opacity: 0,
      transform: 'scale(0.95)',
      transition: `opacity ${getDuration()}s ease-out ${delay}ms, transform ${getDuration()}s ease-out ${delay}ms`,
    },
    grow: {
      opacity: 0,
      transform: 'scale(0.9)',
      transition: `opacity ${getDuration()}s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms, transform ${getDuration()}s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms`,
    },
    none: {}
  };
  
  // Стили для активной анимации
  const activeStyles = {
    fade: { opacity: 1 },
    slide: { opacity: 1, transform: 'translateY(0)' },
    zoom: { opacity: 1, transform: 'scale(1)' },
    grow: { opacity: 1, transform: 'scale(1)' },
    none: {}
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10); // Небольшая задержка для запуска анимации
    
    return () => clearTimeout(timer);
  }, []);
  
  // Используем внешнее состояние видимости, если оно передано
  const visibilityState = externalIsVisible !== undefined ? externalIsVisible : isVisible;
  
  return (
    <Box
      ref={ref}
      sx={{
        ...animationStyles[animation],
        ...(visibilityState ? activeStyles[animation] : {}),
        fontFamily: 'var(--font-family)',
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
});

AnimatedContainer.displayName = 'AnimatedContainer';

AnimatedContainer.propTypes = {
  children: PropTypes.node.isRequired,
  animation: PropTypes.oneOf(['fade', 'slide', 'zoom', 'grow', 'none']),
  delay: PropTypes.number,
  duration: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'fast', 'slow']),
  isVisible: PropTypes.bool,
  sx: PropTypes.object
};

export default AnimatedContainer; 