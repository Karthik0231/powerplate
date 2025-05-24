import React from 'react';
import { Box, Container, Grid, Stack, Typography, Card, CardContent, Avatar, Chip, Paper } from '@mui/material';
import { 
  FitnessCenter, 
  Restaurant, 
  Timeline, 
  Assessment, 
  Star, 
  Group, 
  TrendingUp,
  LocalDining,
  HealthAndSafety,
  Psychology,
  EmojiEvents,
  Favorite,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Banner from '../components/Banner';
import Section from '../components/Section';
import CustomCard from '../components/CustomCard';
import CustomButton from '../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import bgimage from './images/banner.png';

const Home = () => {
  const navigate = useNavigate();

const features = [
  {
    icon: <Group sx={{ fontSize: 32 }} />,
    title: "Expert Nutritionists",
    description: "Connect with certified experts for health guidance.",
    color: "#FF6B6B"
  },
  {
    icon: <Restaurant sx={{ fontSize: 32 }} />,
    title: "Custom Meal Plans",
    description: "Get personalized meal plans based on your goals.",
    color: "#4ECDC4"
  },
  {
    icon: <Timeline sx={{ fontSize: 32 }} />,
    title: "Progress Tracking",
    description: "Track and update your fitness progress with ease.",
    color: "#45B7D1"
  },
{
  icon: <Assessment sx={{ fontSize: 32 }} />,
  title: "Smart Analytics",
  description: "Analyze your health data with easy-to-read format.",
  color: "#96CEB4"
},
  {
    icon: <Star sx={{ fontSize: 32 }} />,
    title: "Rate & Review",
    description: "Share your experience and feedback on nutritionist.",
    color: "#FECA57"
  },
  {
    icon: <FitnessCenter sx={{ fontSize: 32 }} />,
    title: "Goal Achievement",
    description: "Reach your targets and celebrate health wins.",
    color: "#A55EEA"
  }
];



  const stats = [
    { number: "50K+", label: "Active Users", icon: <Group /> },
    { number: "1,200+", label: "Expert Nutritionists", icon: <Star /> },
    { number: "98%", label: "Success Rate", icon: <TrendingUp /> },
    { number: "24/7", label: "Premium Support", icon: <Favorite /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "PowerPlate transformed my relationship with food. I've lost 30 pounds and gained so much energy!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Busy Professional",
      content: "The meal planning feature saves me hours every week. Everything is perfectly tailored to my schedule.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Davis",
      role: "New Mom",
      content: "Post-pregnancy nutrition guidance was exactly what I needed. The support team is incredible!",
      rating: 5,
      avatar: "ED"
    }
  ];

  const benefits = [
    "Personalized nutrition plans that evolve with you",
    "24/7 access to certified nutrition experts",
    "Comprehensive meal tracking and analytics",
    "Community support from 50,000+ members"
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Banner */}
        <Box sx={{ position: 'relative', pt: { xs: '64px', md: '72px' } }}>
          <Banner
            title="Transform Your Life with PowerPlate"
            subtitle="Your journey to better health and nutrition starts here. Get personalized meal plans and expert guidance from certified nutritionists."
            backgroundImage={bgimage}
            height="600px"
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ mt: 4 }}
              justifyContent="center"
            >
              <CustomButton
                size="large"
                startIcon={<FitnessCenter />}
                onClick={() => navigate('/nutritionists')}
              >
                Start Your Journey
              </CustomButton>
              <CustomButton
                size="large"
                color="primary"
                startIcon={<Restaurant />}
                onClick={() => navigate('/meal-plans')}
              >
                View Meal Plans
              </CustomButton>
            </Stack>
          </Banner>
        </Box>

        {/* Enhanced Stats Section */}
        <Section backgroundColor="background.paper" spacing={8}>
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="center" alignItems="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Paper 
                    elevation={3}
                    sx={{ 
                      textAlign: 'center', 
                      py: 4, 
                      px: 2,
                      borderRadius: 3,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #2e7d32, #66bb6a)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 1
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* Features Section - Compact Cards */}
        <Section
          title="Why PowerPlate is Different"
          subtitle="Everything you need for your nutrition and wellness journey in one platform"
          textAlign="center"
          spacing={6}
          backgroundColor="#fafafa"
        >
          <Container maxWidth="lg">
            <Grid container spacing={2.5}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      background: 'white',
                      borderRadius: 2,
                      p: 2.5,
                      height: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      border: '1px solid rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                        '& .feature-icon': {
                          transform: 'scale(1.1)',
                          backgroundColor: feature.color,
                          color: 'white'
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: feature.color,
                      }
                    }}
                  >
                    <Box 
                      className="feature-icon"
                      sx={{ 
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: `${feature.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                        color: feature.color,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.8,
                        color: '#2c3e50',
                        fontSize: '1rem'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.4,
                        fontSize: '0.85rem'
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* Benefits Section */}
        <Section spacing={8}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 3,
                    background: 'linear-gradient(45deg, #2e7d32, #66bb6a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Everything You Need for Success
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                  Join the thousands who have already transformed their lives with our comprehensive wellness platform.
                </Typography>
                <Stack spacing={2}>
                  {benefits.map((benefit, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CheckCircle sx={{ color: '#4CAF50', fontSize: 24 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Section>

        {/* CTA Section */}
        <Box sx={{ position: 'relative', my: 4 }}>
          <Banner
            title="Ready to Start Your Journey?"
            subtitle="Join thousands of others who have transformed their lives with PowerPlate"
            backgroundImage={bgimage}
            height="400px"
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CustomButton
                size="large"
                onClick={() => navigate('/')}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontSize: '1.1rem', 
                  fontWeight: 600
                }}
              >
                Get Started Now
              </CustomButton>
            </Box>
          </Banner>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;