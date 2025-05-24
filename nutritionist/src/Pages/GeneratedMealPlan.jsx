import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  useTheme,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import {
  Restaurant,
  Person,
  CalendarToday,
  Fastfood,
  LunchDining,
  DinnerDining,
  LocalFireDepartment,
  FitnessCenter,
  Grain,
  Water,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { NutritionistContext } from '../Context/Context';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const GeneratedMealPlan = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getSingleNutritionistMealPlan, deleteNutritionistMealPlan } = useContext(NutritionistContext);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        if (location.state?.mealPlan) {
          setMealPlan(location.state.mealPlan);
        } else {
          const requestId = location.pathname.split('/')[2];
          const data = await getSingleNutritionistMealPlan(requestId);
          setMealPlan(data);
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [location, getSingleNutritionistMealPlan]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the meal plan and reset the request status to pending",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteNutritionistMealPlan(mealPlan._id);
        if (response.success) {
          Swal.fire('Deleted!', 'Meal plan has been deleted.', 'success');
          navigate('/meal-plan-requests');
        }
      } catch (error) {
        console.error('Error deleting meal plan:', error);
        Swal.fire('Error', 'Failed to delete meal plan', 'error');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" color="textSecondary">
          Loading your meal plan...
        </Typography>
      </Box>
    );
  }

  if (!mealPlan) {
    return (
      <Box sx={{ 
        p: 4, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Card sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Restaurant sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            No meal plan data found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please try again or contact support if the issue persists.
          </Typography>
        </Card>
      </Box>
    );
  }

  const getMealIcon = (mealType) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return <Fastfood sx={{ color: '#FF9800' }} />;
      case 'lunch':
        return <LunchDining sx={{ color: '#4CAF50' }} />;
      case 'dinner':
        return <DinnerDining sx={{ color: '#2196F3' }} />;
      default:
        return <Restaurant />;
    }
  };

  const renderMealCard = (meals, mealType) => {
    const mealTypeColors = {
      breakfast: { bg: '#FFF3E0', color: '#E65100', icon: '#FF9800' },
      lunch: { bg: '#E8F5E8', color: '#2E7D32', icon: '#4CAF50' },
      dinner: { bg: '#E3F2FD', color: '#1565C0', icon: '#2196F3' }
    };
    
    const colors = mealTypeColors[mealType];
    
    return (
      <Card 
        sx={{ 
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[12]
          },
          border: `2px solid ${colors.bg}`,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${theme.palette.background.paper} 100%)`
        }}
      >
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {getMealIcon(mealType)}
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 700, color: colors.color }}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            {meals && meals.length > 0 ? (
              meals.map((meal, index) => (
                <Box key={index} sx={{ mb: index < meals.length - 1 ? 2 : 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'purple' }}>
                    {meal.name}
                  </Typography>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }}>
                        <Typography variant="caption" color="black">PORTIONS</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                          {meal.portions}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }}>
                        <LocalFireDepartment sx={{ fontSize: 12, color: '#FF5722', mb: 0.5 }} />
                        <Typography variant="caption" color="rgba(28, 23, 23, 0.92)" display="block">CAL</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF5722' }}>
                          {meal.calories}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 0.5, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
                        <FitnessCenter sx={{ fontSize: 10, color: '#4CAF50', mb: 0.5 }} />
                        <Typography variant="caption" color="black" display="block">P</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                          {meal.protein}g
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 0.5, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
                        <Grain sx={{ fontSize: 10, color: '#FF9800', mb: 0.5 }} />
                        <Typography variant="caption" color="black" display="block">C</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#FF9800' }}>
                          {meal.carbs}g
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 0.5, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
                        <Water sx={{ fontSize: 10, color: '#2196F3', mb: 0.5 }} />
                        <Typography variant="caption" color="black" display="block">F</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#2196F3' }}>
                          {meal.fats}g
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {index < meals.length - 1 && <Divider sx={{ mt: 2, opacity: 0.5 }} />}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                No meals planned
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderDayPlan = (day) => {
    const dayData = mealPlan.weeklyPlan[day];
    const dayName = day.charAt(0).toUpperCase() + day.slice(1);
    
    return (
      <Paper
        key={day}
        elevation={3}
        sx={{ 
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.background.paper} 100%)`
        }}
      >
        <Box sx={{ 
          p: 3, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <CalendarToday sx={{ mr: 2 }} />
            {dayName}
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {renderMealCard(dayData.breakfast, 'breakfast')}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderMealCard(dayData.lunch, 'lunch')}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderMealCard(dayData.dinner, 'dinner')}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.primary.light}05 0%, ${theme.palette.background.default} 100%)`,
      py: 4
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Header Section */}
        <Paper
          elevation={6}
          sx={{ 
            mb: 4,
            borderRadius: 4,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
          }}
        >
          <Box sx={{ p: 4, color: 'white', position: 'relative' }}>
            {/* Add Delete Button */}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{
                  bgcolor: 'rgba(230, 16, 16, 0.92)',
                  '&:hover': {
                    bgcolor: 'error.main'
                  }
                }}
              >
                Delete Plan
              </Button>
            </Box>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                <Restaurant sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  Meal Plan
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Personalized nutrition plan designed for optimal health
                </Typography>
              </Box>
            </Stack>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 2, color: 'rgba(255,255,255,0.8)' }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>CLIENT</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {mealPlan.client?.name || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 2, color: 'rgba(255,255,255,0.8)' }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>DURATION</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {new Date(mealPlan.startDate).toLocaleDateString()} - {new Date(mealPlan.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Daily Meal Plans */}
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => 
          renderDayPlan(day)
        )}

        {/* Back Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(-1)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8]
              },
              transition: 'all 0.3s ease'
            }}
          >
            Back to Requests
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GeneratedMealPlan;