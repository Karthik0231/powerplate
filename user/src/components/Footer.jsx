import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, useTheme, useMediaQuery } from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Restaurant
} from '@mui/icons-material';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const footerLinks = [
    {
      title: "Quick Links",
      items: [
        { name: "Home", url: "/home" },
        { name: "View Nutritionists", url: "/nutritionists" },
        { name: "Meal Plans", url: "/meal-plans" }
      ]
    },
    {
      title: "User Actions",
      items: [
        { name: "Manage Profile", url: "/profile" },
        { name: "View Request Status", url: "/request-status" },
        { name: "Give Feedback", url: "/feedback" }
      ]
    },
    // {
    //   title: "Resources",
    //   items: [
    //     { name: "About Us", url: "/about" },
    //     { name: "FAQ", url: "/faq" },
    //     { name: "Support", url: "/support" },
    //     { name: "Contact", url: "/contact" }
    //   ]
    // }
  ];

  const contactInfo = [
    { 
      icon: <Phone fontSize="small" />,
      text: "(555) 123-4567"
    },
    { 
      icon: <Email fontSize="small" />,
      text: "info@powerplate.com"
    },
    { 
      icon: <LocationOn fontSize="small" />,
      text: "123 Energy Way, Power City, PC 12345"
    }
  ];

  const socialMedia = [
    { 
      icon: <Facebook />,
      url: "https://facebook.com/powerplate",
      label: "Facebook"
    },
    { 
      icon: <Twitter />,
      url: "https://twitter.com/powerplate",
      label: "Twitter"
    },
    { 
      icon: <Instagram />,
      url: "https://instagram.com/powerplate",
      label: "Instagram"
    },
    { 
      icon: <LinkedIn />,
      url: "https://linkedin.com/company/powerplate",
      label: "LinkedIn"
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#43a047',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {footerLinks.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.items.map((item) => (
                  <Box component="li" key={item.name} sx={{ mb: 1 }}>
                    <Link
                      href={item.url}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textDecoration: 'none',
                        paddingRight:'85px',
                        '&:hover': {
                          color: 'white',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {item.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600,paddingLeft:'185px' }}>
              Contact Us
            </Typography>
            <Box>
              {contactInfo.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft:'195px',
                    mb: 2,
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {item.icon}
                  <Typography sx={{ ml: 1 }}>{item.text}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            mt: 4,
            pt: 3,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Restaurant sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              PowerPlate
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {socialMedia.map((item) => (
              <IconButton
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                aria-label={item.label}
              >
                {item.icon}
              </IconButton>
            ))}
          </Box>

          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            © {new Date().getFullYear()} PowerPlate. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;