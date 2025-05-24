import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { NutritionistContext } from '../Context/Context';

const EditMealPlan = () => {
  const { id } = useParams(); // Change from mealPlanId to id to match route parameter

  const navigate = useNavigate();
  const { getSingleNutritionistMealPlan, updateNutritionistMealPlan } = useContext(NutritionistContext);
  const [mealPlan, setMealPlan] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [copyToDay] = useState('');

  // Enhanced weekly meal plan structure
  const [weeklyMealPlan, setWeeklyMealPlan] = useState({
    monday: {
      breakfast: [],
      morningSnack: [],
      lunch: [],
      afternoonSnack: [],
      dinner: [],
      eveningSnack: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      notes: ''
    },
    tuesday: {
      breakfast: [],
      morningSnack: [],
      lunch: [],
      afternoonSnack: [],
      dinner: [],
      eveningSnack: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      notes: ''
    },
    wednesday: {
      breakfast: [],
      morningSnack: [],
      lunch: [],
      afternoonSnack: [],
      dinner: [],
      eveningSnack: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      notes: ''
    },
    thursday: {
      breakfast: [],
      morningSnack: [],
      lunch: [],
      afternoonSnack: [],
      dinner: [],
      eveningSnack: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      notes: ''
    },
    friday: {
      breakfast: [],
      morningSnack: [],
      lunch: [],
      afternoonSnack: [],
      dinner: [],
      eveningSnack: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      notes: ''
    },
    saturday: {
      breakfast: [],
      morningSnack: [],
      lunch: [],
      afternoonSnack: [],
      dinner: [],
      eveningSnack: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      notes: ''
    },
    sunday: {
      breakfast: [],
      morningSnack: [],
      lunch: [],
      afternoonSnack: [],
      dinner: [],
      eveningSnack: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      notes: ''
    },
    startDate: '',
    endDate: '',
    specialInstructions: '',
    weeklyNotes: ''
  });

  const [newMeal, setNewMeal] = useState({
    type: 'breakfast',
    name: '',
    portions: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        const data = await getSingleNutritionistMealPlan(id);
        if (!data) {
          throw new Error('No meal plan data received');
        }
        
        setMealPlan(data);
        setClientInfo(data.client);
        
        // Properly populate the weekly meal plan from fetched data
        if (data.weeklyPlan) {
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          const updatedPlan = { ...weeklyMealPlan };
          
          days.forEach(day => {
            if (data.weeklyPlan[day]) {
              updatedPlan[day] = {
                breakfast: Array.isArray(data.weeklyPlan[day].breakfast) ? data.weeklyPlan[day].breakfast : [],
                morningSnack: Array.isArray(data.weeklyPlan[day].morningSnack) ? data.weeklyPlan[day].morningSnack : [],
                lunch: Array.isArray(data.weeklyPlan[day].lunch) ? data.weeklyPlan[day].lunch : [],
                afternoonSnack: Array.isArray(data.weeklyPlan[day].afternoonSnack) ? data.weeklyPlan[day].afternoonSnack : [],
                dinner: Array.isArray(data.weeklyPlan[day].dinner) ? data.weeklyPlan[day].dinner : [],
                eveningSnack: Array.isArray(data.weeklyPlan[day].eveningSnack) ? data.weeklyPlan[day].eveningSnack : [],
                totalCalories: data.weeklyPlan[day].totalCalories || 0,
                totalProtein: data.weeklyPlan[day].totalProtein || 0,
                totalCarbs: data.weeklyPlan[day].totalCarbs || 0,
                totalFats: data.weeklyPlan[day].totalFats || 0,
                notes: data.weeklyPlan[day].notes || ''
              };
            }
          });

          updatedPlan.startDate = data.startDate || '';
          updatedPlan.endDate = data.endDate || '';
          updatedPlan.specialInstructions = data.specialInstructions || '';
          updatedPlan.weeklyNotes = data.weeklyNotes || '';
          
          setWeeklyMealPlan(updatedPlan);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meal plan:', error);
        setError(error.message || 'Failed to load meal plan');
        setLoading(false);
      }
    };

    if (id) {  // Only fetch if mealPlanId exists
      fetchMealPlan();
    } else {
      setError('No meal plan ID provided');
    }
  }, [id]);

  const handleCopyMeals = (day) => {
    setSelectedDay(day);
    handleOpenCopyDialog();
  }
  // Calculate daily totals
  const calculateDailyTotals = (day) => {
    const dayMeals = weeklyMealPlan[day];
    const mealTypes = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'eveningSnack'];

    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    };

    mealTypes.forEach(mealType => {
      if (Array.isArray(dayMeals[mealType])) {
        dayMeals[mealType].forEach(meal => {
          totals.calories += Number(meal.calories) || 0;
          totals.protein += Number(meal.protein) || 0;
          totals.carbs += Number(meal.carbs) || 0;
          totals.fats += Number(meal.fats) || 0;
        });
      }
    });

    return totals;
  };

  // Enhanced add meal function
  const addMeal = () => {
    if (newMeal.name && newMeal.type) {
      setWeeklyMealPlan(prev => {
        const updatedPlan = {
          ...prev,
          [selectedDay]: {
            ...prev[selectedDay],
            [newMeal.type]: [...prev[selectedDay][newMeal.type], newMeal]
          }
        };

        // Update daily totals
        const totals = calculateDailyTotals(selectedDay);
        updatedPlan[selectedDay].totalCalories = totals.calories;
        updatedPlan[selectedDay].totalProtein = totals.protein;
        updatedPlan[selectedDay].totalCarbs = totals.carbs;
        updatedPlan[selectedDay].totalFats = totals.fats;

        return updatedPlan;
      });

      setNewMeal({
        type: 'breakfast',
        name: '',
        portions: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
      });
    }
  };

  // Enhanced remove meal function
  const removeMeal = (type, index) => {
    setWeeklyMealPlan(prev => {
      const updatedPlan = {
        ...prev,
        [selectedDay]: {
          ...prev[selectedDay],
          [type]: prev[selectedDay][type].filter((_, i) => i !== index)
        }
      };

      // Update daily totals
      const totals = calculateDailyTotals(selectedDay);
      updatedPlan[selectedDay].totalCalories = totals.calories;
      updatedPlan[selectedDay].totalProtein = totals.protein;
      updatedPlan[selectedDay].totalCarbs = totals.carbs;
      updatedPlan[selectedDay].totalFats = totals.fats;

      return updatedPlan;
    });
  };

  // Open copy meals dialog
  const handleOpenCopyDialog = () => {
    setOpenCopyDialog(true);
  };

  // Close copy meals dialog
  const handleCloseCopyDialog = () => {
    setOpenCopyDialog(false);
  };

  // Copy meals to another day
  const copyMealsToDay = () => {
    if (copyToDay && copyToDay !== selectedDay) {
      setWeeklyMealPlan(prev => ({
        ...prev,
        [copyToDay]: {
          ...prev[copyToDay],
          breakfast: [...prev[selectedDay].breakfast],
          morningSnack: [...prev[selectedDay].morningSnack],
          lunch: [...prev[selectedDay].lunch],
          afternoonSnack: [...prev[selectedDay].afternoonSnack],
          dinner: [...prev[selectedDay].dinner],
          eveningSnack: [...prev[selectedDay].eveningSnack],
          totalCalories: prev[selectedDay].totalCalories,
          totalProtein: prev[selectedDay].totalProtein,
          totalCarbs: prev[selectedDay].totalCarbs,
          totalFats: prev[selectedDay].totalFats
        }
      }));
      handleCloseCopyDialog();
      setSuccess(`Meals successfully copied from ${selectedDay} to ${copyToDay}`);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Update day notes
  const updateDayNotes = (e) => {
    setWeeklyMealPlan(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        notes: e.target.value
      }
    }));
  };

  // Validate meal plan
  const validateMealPlan = () => {
    const errors = [];

    if (!weeklyMealPlan.startDate || !weeklyMealPlan.endDate) {
      errors.push('Please select start and end dates');
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hasEmptyDay = days.some(day => {
      const dayMeals = weeklyMealPlan[day];
      // Check if all meal type arrays for the day are empty
      const allMealTypesEmpty = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'eveningSnack'].every(mealType =>
         Array.isArray(dayMeals[mealType]) && dayMeals[mealType].length === 0
      );
      return allMealTypesEmpty;
    });

    if (hasEmptyDay) {
      errors.push('Each day should have at least one meal');
    }

    return errors;
  };

  // Update the meal plan
  const handleUpdate = async () => {
    const errors = validateMealPlan();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    try {
      setLoading(true);

      // Prepare the data structure for update
      const mealPlanDataToUpdate = {
        startDate: weeklyMealPlan.startDate,
        endDate: weeklyMealPlan.endDate,
        specialInstructions: weeklyMealPlan.specialInstructions,
        weeklyNotes: weeklyMealPlan.weeklyNotes,
        weeklyPlan: { // Structure the weekly plan data
          monday: {
            ...weeklyMealPlan.monday,
            totalCalories: calculateDailyTotals('monday').calories,
            totalProtein: calculateDailyTotals('monday').protein,
            totalCarbs: calculateDailyTotals('monday').carbs,
            totalFats: calculateDailyTotals('monday').fats,
          },
          tuesday: {
            ...weeklyMealPlan.tuesday,
            totalCalories: calculateDailyTotals('tuesday').calories,
            totalProtein: calculateDailyTotals('tuesday').protein,
            totalCarbs: calculateDailyTotals('tuesday').carbs,
            totalFats: calculateDailyTotals('tuesday').fats,
          },
          wednesday: {
            ...weeklyMealPlan.wednesday,
            totalCalories: calculateDailyTotals('wednesday').calories,
            totalProtein: calculateDailyTotals('wednesday').protein,
            totalCarbs: calculateDailyTotals('wednesday').carbs,
            totalFats: calculateDailyTotals('wednesday').fats,
          },
          thursday: {
            ...weeklyMealPlan.thursday,
            totalCalories: calculateDailyTotals('thursday').calories,
            totalProtein: calculateDailyTotals('thursday').protein,
            totalCarbs: calculateDailyTotals('thursday').carbs,
            totalFats: calculateDailyTotals('thursday').fats,
          },
          friday: {
            ...weeklyMealPlan.friday,
            totalCalories: calculateDailyTotals('friday').calories,
            totalProtein: calculateDailyTotals('friday').protein,
            totalCarbs: calculateDailyTotals('friday').carbs,
            totalFats: calculateDailyTotals('friday').fats,
          },
          saturday: {
            ...weeklyMealPlan.saturday,
            totalCalories: calculateDailyTotals('saturday').calories,
            totalProtein: calculateDailyTotals('saturday').protein,
            totalCarbs: calculateDailyTotals('saturday').carbs,
            totalFats: calculateDailyTotals('saturday').fats,
          },
          sunday: {
            ...weeklyMealPlan.sunday,
            totalCalories: calculateDailyTotals('sunday').calories,
            totalProtein: calculateDailyTotals('sunday').protein,
            totalCarbs: calculateDailyTotals('sunday').carbs,
            totalFats: calculateDailyTotals('sunday').fats,
          },
        }
      };

      await updateNutritionistMealPlan(id, mealPlanDataToUpdate);
      setSuccess('Meal plan successfully updated!');
      setTimeout(() => {
        navigate('/nutritionist-meal-plans'); // Navigate back to meal plans list
      }, 2000);
    } catch (err) {
      console.error('Error updating meal plan:', err);
      setError(err.message || 'Failed to update meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get meal type display name
  const getMealTypeDisplayName = (type) => {
    const displayNames = {
      'breakfast': 'Breakfast',
      'morningSnack': 'Morning Snack',
      'lunch': 'Lunch',
      'afternoonSnack': 'Afternoon Snack',
      'dinner': 'Dinner',
      'eveningSnack': 'Evening Snack'
    };
    return displayNames[type] || type;
  };

  // Days of the week for copy function
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/nutritionist-meal-plans')}
        sx={{ mb: 3 }}
      >
        Back to Meal Plans
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Edit Meal Plan
      </Typography>

      <Grid container spacing={3}>
        {/* Client Information Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Client Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Typography>Loading client information...</Typography>
            ) : clientInfo ? (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Client Details
                  </Typography>
                  <Typography>Name: {clientInfo.name}</Typography>
                  {clientInfo.age && <Typography>Age: {clientInfo.age} years</Typography>}
                  {clientInfo.gender && <Typography>Gender: {clientInfo.gender}</Typography>}
                  {clientInfo.height && <Typography>Height: {clientInfo.height} cm</Typography>}
                  {clientInfo.weight && <Typography>Weight: {clientInfo.weight} kg</Typography>}
                </Box>

                {mealPlan?.mealPlanRequest && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Related Request
                    </Typography>
                    <Typography>Request ID: {mealPlan.mealPlanRequest}</Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Meal Plan Period
                  </Typography>
                  <Typography>Start: {new Date(weeklyMealPlan.startDate).toLocaleDateString()}</Typography>
                  <Typography>End: {new Date(weeklyMealPlan.endDate).toLocaleDateString()}</Typography>
                </Box>
              </Stack>
            ) : (
              <Typography>No client information available</Typography>
            )}
          </Paper>
        </Grid>

        {/* Weekly Meal Plan Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            {/* Weekly Plan Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Weekly Meal Plan Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={weeklyMealPlan.startDate}
                    onChange={(e) => setWeeklyMealPlan(prev => ({ ...prev, startDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    value={weeklyMealPlan.endDate}
                    onChange={(e) => setWeeklyMealPlan(prev => ({ ...prev, endDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Day Selection */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Tabs
                value={selectedDay}
                onChange={(e, newValue) => setSelectedDay(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, flexGrow: 1, color: 'green', fontWeight: 'bold' }}
              >
                {daysOfWeek.map((day) => (
                  <Tab
                    key={day}
                    label={day.charAt(0).toUpperCase() + day.slice(1)}
                    value={day}
                    sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                  />
                ))}
              </Tabs>
              <Button
                startIcon={<CopyIcon />}
                onClick={handleOpenCopyDialog}
                size="small"
                sx={{ ml: 2, color: 'green', fontWeight: 'bold', fontSize: '14px' }}
              >
                Copy Day
              </Button>
            </Box>

            {/* Daily Summary */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: 'primary.light',
                borderRadius: 2
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="subtitle2">Calories</Typography>
                  <Typography variant="h6">{calculateDailyTotals(selectedDay).calories}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle2">Protein</Typography>
                  <Typography variant="h6">{calculateDailyTotals(selectedDay).protein}g</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle2">Carbs</Typography>
                  <Typography variant="h6">{calculateDailyTotals(selectedDay).carbs}g</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle2">Fats</Typography>
                  <Typography variant="h6">{calculateDailyTotals(selectedDay).fats}g</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Meal Addition Form */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                Add Meal
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Meal Type</InputLabel>
                    <Select
                      value={newMeal.type}
                      label="Meal Type"
                      onChange={(e) => setNewMeal(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <MenuItem value="breakfast">Breakfast</MenuItem>
                      <MenuItem value="morningSnack">Morning Snack</MenuItem>
                      <MenuItem value="lunch">Lunch</MenuItem>
                      <MenuItem value="afternoonSnack">Afternoon Snack</MenuItem>
                      <MenuItem value="dinner">Dinner</MenuItem>
                      <MenuItem value="eveningSnack">Evening Snack</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Meal Name"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Portions"
                    value={newMeal.portions}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, portions: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Calories"
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, calories: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={4} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Protein (g)"
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, protein: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={4} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Carbs (g)"
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, carbs: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={4} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Fats (g)"
                    type="number"
                    value={newMeal.fats}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, fats: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={addMeal}
                    startIcon={<AddIcon />}
                    sx={{ height: '40px' }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Display Meals for Selected Day */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}'s Meals
              </Typography>
              
              {['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'eveningSnack'].map((mealType) => (
                Array.isArray(weeklyMealPlan[selectedDay][mealType]) && weeklyMealPlan[selectedDay][mealType].length > 0 && (
                  <Box key={mealType} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1 }}>
                      {getMealTypeDisplayName(mealType)}
                    </Typography>
                    <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #f0f0f0' }}>
                      {weeklyMealPlan[selectedDay][mealType].map((meal, index) => (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <IconButton edge="end" onClick={() => removeMeal(mealType, index)}>
                              <DeleteIcon />
                            </IconButton>
                          }
                          sx={{ 
                            borderBottom: index < weeklyMealPlan[selectedDay][mealType].length - 1 ? '1px solid #f0f0f0' : 'none',
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                          }}
                        >
                          <ListItemText
                            primary={meal.name}
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {meal.portions && `${meal.portions} portions • `}{meal.calories} kcal
                                </Typography>
                                <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                  P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )
              ))}
              
              {!['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'eveningSnack'].some(
                mealType => Array.isArray(weeklyMealPlan[selectedDay][mealType]) && weeklyMealPlan[selectedDay][mealType].length > 0
              ) && (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                  No meals added yet for this day. Use the form above to add meals.
                </Typography>
              )}
            </Box>

            {/* Daily Notes */}
            <TextField
              fullWidth
              label={`Notes for ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}`}
              multiline
              rows={2}
              value={weeklyMealPlan[selectedDay].notes || ''}
              onChange={updateDayNotes}
              sx={{ mb: 3 }}
            />

            {/* Weekly Notes */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Weekly Instructions"
              value={weeklyMealPlan.weeklyNotes || ''}
              onChange={(e) => setWeeklyMealPlan(prev => ({ ...prev, weeklyNotes: e.target.value }))}
              sx={{ mb: 3 }}
            />

            {/* Special Instructions */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Instructions"
              value={weeklyMealPlan.specialInstructions || ''}
              onChange={(e) => setWeeklyMealPlan(prev => ({ ...prev, specialInstructions: e.target.value }))}
              sx={{ mb: 3 }}
            />

            {/* Update Button */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleUpdate}
              disabled={loading}
              startIcon={<SaveIcon />}
              sx={{ mt: 3 }}
            >
              {loading ? 'Updating...' : 'Update Meal Plan'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Copy Day Dialog */}
      <Dialog open={openCopyDialog} onClose={handleCloseCopyDialog}>
        <DialogTitle>Copy Meals to Another Day</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Day to Copy To</InputLabel>
            <Select
              value={copyToDay}
              onChange={(e) => setCopyToDay(e.target.value)}
            >
              {daysOfWeek.map((day) => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCopyDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCopyMeals} color="primary">
            Copy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default EditMealPlan;