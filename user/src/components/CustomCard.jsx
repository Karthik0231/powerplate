import React from 'react';
import { Card, CardContent, CardMedia, CardActions, Typography, Box } from '@mui/material';

const CustomCard = ({
  title,
  subtitle,
  description,
  image,
  actions,
  elevation = 2,
  onClick,
  sx = {},
  children
}) => {
  return (
    <Card
      elevation={elevation}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        },
        cursor: onClick ? 'pointer' : 'default',
        ...sx
      }}
    >
      {image && (
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
      )}
<CardContent sx={{ flexGrow: 1 }}>
  {children}
  <Box sx={{ minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Typography gutterBottom variant="h6" component="h3" align="center">
      {title}
    </Typography> 
  </Box>

  <Box sx={{ minHeight: 60}}>
    <Typography variant="body2" color="text.secondary" align="center">
      {description}
    </Typography>
  </Box>
</CardContent>

      {actions && (
        <CardActions>
          <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
            {actions}
          </Box>
        </CardActions>
      )}
    </Card>
  );
};

export default CustomCard;