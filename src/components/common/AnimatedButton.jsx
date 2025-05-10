import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import AnimatedContainer from './AnimatedContainer';

// Стилизованная кнопка с эффектами
const StyledButton = styled(Button)(({ theme, glowEffect, pulseEffect, rippleEffect }) => ({
  position: 'relative',
  overflow: 'hidden',
  fontFamily: 'var(--font-family)',
  fontWeight: 'var(--font-weight-medium)',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  
  // Эффект свечения
  ...(glowEffect && {
    '&:hover': {
      boxShadow: `0 0 15px ${theme.palette.primary.main}`,
    },
  }),
  
  // Эффект пульсации
  ...(pulseEffect && {
    '&:hover': {
      animation: 'pulse 1.5s infinite',
    },
  }),
  
  // Эффект волны (ripple)
  ...(rippleEffect && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '5px',
      height: '5px',
      background: 'rgba(255, 255, 255, 0.5)',
      opacity: '0',
      borderRadius: '100%',
      transform: 'scale(1, 1) translate(-50%, -50%)',
      transformOrigin: '50% 50%',
    },
    
    '&:hover::after': {
      animation: 'ripple 1s ease-out',
    },
  }),
}));

const AnimatedButton = React.forwardRef(({
  children,
  animation = 'fade',
  variant = 'contained',
  color = 'primary',
  delay = 0,
  glowEffect = false,
  pulseEffect = false,
  rippleEffect = false,
  sx = {},
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <AnimatedContainer
      animation={animation}
      isVisible={isVisible}
      delay={0} // Задержка уже обрабатывается в useEffect
      sx={{ display: 'inline-block' }}
    >
      <StyledButton
        ref={ref}
        variant={variant}
        color={color}
        glowEffect={glowEffect}
        pulseEffect={pulseEffect}
        rippleEffect={rippleEffect}
        sx={{
          fontFamily: 'var(--font-family)',
          fontWeight: 'var(--font-weight-medium)',
          ...sx
        }}
        {...props}
      >
        {children}
      </StyledButton>
    </AnimatedContainer>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  animation: PropTypes.oneOf(['fade', 'slide', 'zoom', 'grow', 'none']),
  variant: PropTypes.string,
  color: PropTypes.string,
  delay: PropTypes.number,
  glowEffect: PropTypes.bool,
  pulseEffect: PropTypes.bool,
  rippleEffect: PropTypes.bool,
  sx: PropTypes.object,
};

export default AnimatedButton; 