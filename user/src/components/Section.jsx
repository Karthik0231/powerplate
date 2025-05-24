import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Section = ({
  title,
  subtitle,
  children,
  backgroundColor = 'background.default',
  spacing = 4,
  maxWidth = 'lg',
  textAlign = 'left'
}) => {
  return (
    <Box
      component="section"
      sx={{
        py: spacing,
        backgroundColor: backgroundColor
      }}
    >
      <Container maxWidth={maxWidth}>
        {title && (
          <Typography
            variant="h3"
            component="h2"
            sx={{
              mb: subtitle ? 2 : 4,
              textAlign: textAlign,
              fontWeight: 'bold'
            }}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              textAlign: textAlign
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

export default Section;