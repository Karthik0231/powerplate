import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Banner = ({
  title,
  subtitle,
  backgroundImage,
  height = '300px',
  overlay = true,
  alignItems = 'center',
  textAlign = 'center',
  children
}) => {
  return (
    <Box
      sx={{
        height: height,
        width: '100%',
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: alignItems,
        '&::before': overlay ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        } : {},
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{ 
          position: 'relative',
          zIndex: 1,
          textAlign: textAlign
        }}
      >
        {title && (
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              mb: 3,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {subtitle}
          </Typography>
        )}
        {children}
      </Container>
    </Box>
  );
};

export default Banner;