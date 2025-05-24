import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  Divider,
  Card,
  CardContent,
  Avatar,
  Stack,
  LinearProgress,
  Fade,
  Slide,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  RestaurantMenu, 
  AccessTime, 
  LocalFireDepartment, 
  FitnessCenter, 
  Grain, 
  Water,
  Person,
  CalendarToday,
  Notes,
  TrendingUp,
  Restaurant,
  Schedule,
  Visibility,
  Star,
  CheckCircle
} from '@mui/icons-material';
import { userContext } from '../Context/Context';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Loading from '../components/Loading';
import Banner from '../components/Banner';
import bgimage from '../assets/banner.png';

// Enhanced Macro Card Component
const MacroCard = ({ icon, label, value, color, percentage }) => (
  <Card 
    sx={{ 
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}20`,
      borderRadius: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 24px ${color}25`,
        border: `1px solid ${color}40`,
      }
    }}
  >
    <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
      <Avatar 
        sx={{ 
          bgcolor: `${color}15`, 
          color: color, 
          mx: 'auto', 
          mb: 1.5,
          width: 48, 
          height: 48,
          border: `2px solid ${color}30`
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color: color, mb: 1 }}>
        {value}
      </Typography>
      {percentage && (
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: `${color}10`,
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              bgcolor: color,
            },
          }}
        />
      )}
    </CardContent>
  </Card>
);

// Enhanced Meal Card Component
const MealCard = ({ meal, mealType, index }) => {
  const mealTypeColors = {
    breakfast: '#FF6B35',
    lunch: '#4ECDC4',
    dinner: '#45B7D1'
  };

  const mealTypeIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙'
  };

  return (
    <Fade in={true} timeout={600 + index * 200}>
      <Card 
        sx={{ 
          height: '100%',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            border: `2px solid ${mealTypeColors[mealType]}40`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${mealTypeColors[mealType]} 0%, ${mealTypeColors[mealType]}80 100%)`,
          }
        }}
      >
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Meal Header */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
              <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
                {mealTypeIcons[mealType]}
              </Typography>
              <Chip
                label={mealType}
                size="small"
                sx={{
                  bgcolor: `${mealTypeColors[mealType]}15`,
                  color: mealTypeColors[mealType],
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: `1px solid ${mealTypeColors[mealType]}30`,
                }}
              />
            </Stack>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#1a202c',
                mb: 0.5,
                fontSize: '1.1rem'
              }}
            >
              {meal.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Restaurant sx={{ fontSize: 16 }} />
              Portion: {meal.portions}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5, bgcolor: '#e2e8f0' }} />

          {/* Nutrition Grid */}
          <Grid container spacing={1.5} sx={{ flexGrow: 1 }}>
            <Grid item xs={6}>
              <MacroCard
                icon={<LocalFireDepartment />}
                label="Calories"
                value={meal.calories}
                color="#FF5722"
              />
            </Grid>
            <Grid item xs={6}>
              <MacroCard
                icon={<FitnessCenter />}
                label="Protein"
                value={`${meal.protein}g`}
                color="#4CAF50"
              />
            </Grid>
            <Grid item xs={6}>
              <MacroCard
                icon={<Grain />}
                label="Carbs"
                value={`${meal.carbs}g`}
                color="#FF9800"
              />
            </Grid>
            <Grid item xs={6}>
              <MacroCard
                icon={<Water />}
                label="Fats"
                value={`${meal.fats}g`}
                color="#2196F3"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

// Enhanced Day Card Component
const DayCard = ({ day, dayData, index }) => {
  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const dayEmojis = {
    monday: '💪',
    tuesday: '🔥',
    wednesday: '⚡',
    thursday: '🚀',
    friday: '🎉',
    saturday: '🌟',
    sunday: '☀️'
  };

  return (
    <Slide direction="up" in={true} timeout={800 + index * 100}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '2px solid #e2e8f0',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '2px solid #3b82f6',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(59, 130, 246, 0.15)',
          }
        }}
      >
        {/* Day Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="h2" sx={{ fontSize: '2rem' }}>
              {dayEmojis[day]}
            </Typography>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1a202c',
                  textTransform: 'capitalize'
                }}
              >
                {dayNames[day]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Daily Nutrition Plan
              </Typography>
            </Box>
          </Stack>

          {/* Daily Totals */}
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ py: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalFireDepartment />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Calories
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {dayData.totalCalories}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FitnessCenter />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Protein
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {dayData.totalProtein}g
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Grain />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Carbs
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {dayData.totalCarbs}g
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Water />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Fats
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {dayData.totalFats}g
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Meals Grid */}
        <Grid container spacing={3}>
          {['breakfast', 'lunch', 'dinner'].map((mealType) => (
            dayData[mealType].map((meal, mealIndex) => (
              <Grid item xs={12} lg={4} key={meal._id}>
                <MealCard meal={meal} mealType={mealType} index={mealIndex} />
              </Grid>
            ))
          ))}
        </Grid>

        {/* Day Notes */}
        {dayData.notes && (
          <Card 
            sx={{ 
              mt: 3,
              background: 'linear-gradient(135deg, #fef7cd 0%, #fef3c7 100%)',
              border: '1px solid #f59e0b20',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ py: 2 }}>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Notes sx={{ color: '#f59e0b', mt: 0.5 }} />
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ fontWeight: 600, color: '#92400e', mb: 0.5 }}
                  >
                    Daily Notes
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#78350f' }}>
                    {dayData.notes}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Slide>
  );
};

const MealPlanView = () => {
  const { requestId } = useParams();
  const { getMealPlanById, loading } = useContext(userContext);
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await getMealPlanById(requestId);
        if (response?.success && response.mealPlan?.weeklyPlan) {
          setMealPlan(response.mealPlan);
        } else {
          console.error('Invalid data structure:', response);
          setError('Invalid meal plan data received');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch meal plan');
      }
    };
    fetchMealPlan();
  }, [requestId, getMealPlanById]);

  console.log('Current meal plan:', mealPlan);

  if (loading) return <Loading />;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>;
  if (!mealPlan) return <Box sx={{ p: 3 }}><Typography>No meal plan found</Typography></Box>;

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        pt: '84px' 
      }}
    >
      <Header />
      
      <Banner
        title="Your Personalized Meal Plan"
        subtitle={`Created by ${mealPlan.nutritionist.name}`}
        backgroundImage={bgimage}
        height="400px"
      />

      <Container maxWidth="xl" sx={{ py: 6, flexGrow: 1 }}>
        {/* Enhanced Overview Section */}
        <Fade in={true} timeout={600}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 5, 
              mb: 6, 
              borderRadius: 4,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              border: '2px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
              }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#3b82f6', 
                  width: 56, 
                  height: 56,
                  fontSize: '1.5rem'
                }}
              >
                📋
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1a202c',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Plan Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your personalized nutrition roadmap
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, #3b82f615 0%, #3b82f605 100%)',
                    border: '1px solid #3b82f620',
                    borderRadius: 3,
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <CalendarToday sx={{ color: '#3b82f6' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c' }}>
                        Duration
                      </Typography>
                    </Stack>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                      {new Date(mealPlan.startDate).toLocaleDateString()} - {new Date(mealPlan.endDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, #8b5cf615 0%, #8b5cf605 100%)',
                    border: '1px solid #8b5cf620',
                    borderRadius: 3,
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <Person sx={{ color: '#8b5cf6' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c' }}>
                        Nutritionist
                      </Typography>
                    </Stack>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                      {mealPlan.nutritionist.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, #06b6d415 0%, #06b6d405 100%)',
                    border: '1px solid #06b6d420',
                    borderRadius: 3
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="flex-start" spacing={2}>
                      <Notes sx={{ color: '#06b6d4', mt: 0.5 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a202c', mb: 1 }}>
                          Weekly Notes
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.6 }}>
                          {mealPlan.weeklyNotes}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Enhanced Daily Meals Section */}
        {days.map((day, index) => (
          <DayCard 
            key={day} 
            day={day} 
            dayData={mealPlan.weeklyPlan[day]} 
            index={index}
          />
        ))}
      </Container>

      <Footer />
    </Box>
  );
};

export default MealPlanView;