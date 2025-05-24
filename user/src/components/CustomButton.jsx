import React from 'react';
import { Button } from '@mui/material';

const CustomButton = ({ 
  children, 
  variant = "contained", 
  color = "primary", 
  startIcon, 
  endIcon, 
  fullWidth = false,
  size = "medium",
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      onClick={onClick}
      sx={{
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: variant === 'contained' ? 2 : 'none',
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: 'transform 0.2s',
          boxShadow: variant === 'contained' ? 4 : 'none',
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;