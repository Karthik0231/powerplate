import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const PageHeader = ({
  title,
  subtitle,
  icon,
  action,
  divider = true,
  spacing = 3
}) => {
  return (
    <Box sx={{ mb: spacing }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: subtitle ? 1 : 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon && (
            <Box 
              sx={{ 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="h4" component="h1" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        {action && (
          <Box>
            {action}
          </Box>
        )}
      </Box>
      {subtitle && (
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {subtitle}
        </Typography>
      )}
      {divider && <Divider sx={{ mt: 2 }} />}
    </Box>
  );
};

export default PageHeader;