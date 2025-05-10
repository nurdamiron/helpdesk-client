import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Paper, Box, Typography } from '@mui/material';
import AnimatedContainer from './AnimatedContainer';

/**
 * Анимированная карточка с заголовком, контентом и иконкой
 */
const AnimatedCard = forwardRef(({
  title,
  content,
  icon,
  delay = 0,
  animation = 'fade',
  variant = 'default',
  borderColor = 'primary.main',
  hoverEffect = true,
  ...props
}, ref) => {
  return (
    <AnimatedContainer
      animation={animation}
      delay={delay}
      variant={variant}
    >
      <Paper
        ref={ref}
        elevation={2}
        sx={{
          position: 'relative',
          p: 3,
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': hoverEffect ? {
            transform: 'translateY(-8px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            '&::before': {
              transform: 'scaleX(1)',
            }
          } : {},
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: (theme) => theme.palette[borderColor.split('.')[0]][borderColor.split('.')[1]] || borderColor,
            transform: 'scaleX(0.3)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease',
            opacity: 0.8,
            zIndex: 1
          }
        }}
        {...props}
      >
        {/* Иконка */}
        {icon && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 2,
              color: 'primary.main',
              '& svg': {
                fontSize: '2.5rem'
              }
            }}
          >
            {icon}
          </Box>
        )}
        
        {/* Заголовок */}
        {title && (
          <Typography 
            variant="h6" 
            component="h3" 
            align="center" 
            gutterBottom
            sx={{
              position: 'relative',
              mb: 2,
              pb: 1,
              fontFamily: 'var(--font-family)',
              fontWeight: 'var(--font-weight-semibold)',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '2px',
                backgroundColor: 'primary.light',
                borderRadius: '4px'
              }
            }}
          >
            {title}
          </Typography>
        )}
        
        {/* Контент */}
        {content && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{
              fontFamily: 'var(--font-family)',
              fontWeight: 'var(--font-weight-regular)',
              lineHeight: 1.6
            }}
          >
            {content}
          </Typography>
        )}
      </Paper>
    </AnimatedContainer>
  );
});

AnimatedCard.displayName = 'AnimatedCard';

AnimatedCard.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  icon: PropTypes.node,
  delay: PropTypes.number,
  animation: PropTypes.oneOf(['fade', 'grow', 'slide', 'zoom']),
  variant: PropTypes.oneOf(['default', 'fast', 'slow']),
  borderColor: PropTypes.string,
  hoverEffect: PropTypes.bool,
};

export default AnimatedCard; 