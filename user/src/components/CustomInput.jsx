import React from 'react';
import { TextField, InputAdornment, Typography, Box } from '@mui/material';

const CustomInput = ({
  label,
  value,
  onChange,
  error,
  helperText,
  type = 'text',
  required = false,
  startIcon,
  endIcon,
  fullWidth = true,
  multiline = false,
  rows = 1,
  disabled = false,
  ...props
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1,
            color: error ? 'error.main' : 'text.primary',
            fontWeight: 500
          }}
        >
          {label} {required && <span style={{ color: '#E57373' }}>*</span>}
        </Typography>
      )}
      <TextField
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        type={type}
        required={required}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        disabled={disabled}
        InputProps={{
          startAdornment: startIcon && (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ),
          endAdornment: endIcon && (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
          ...props.sx
        }}
        {...props}
      />
    </Box>
  );
};

export default CustomInput;