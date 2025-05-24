import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Chip
} from '@mui/material';
import { Restaurant, Send } from '@mui/icons-material';
import { userContext } from '../Context/Context';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const ApplyMealPlan = () => {
  const { nutritionistId } = useParams();
  const navigate = useNavigate();
  const { getNutritionistProfile, applyForMealPlan } = useContext(userContext);
  const [nutritionist, setNutritionist] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const commonAllergies = [
    'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Fish', 'Shellfish', 
    'Wheat', 'Soy', 'Sesame', 'Gluten', 'Lactose'
  ];
  
  const cuisinePreferences = [
    'Mediterranean', 'Asian', 'Mexican', 'Italian', 'Indian', 
    'Middle Eastern', 'American', 'French', 'Thai', 'Japanese'
  ];
  
  const dietTypes = [
    'Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Flexitarian', 
    'Keto', 'Paleo', 'Low-carb', 'Low-fat', 'Mediterranean', 'DASH'
  ];
  
  const [formData, setFormData] = useState({
    // Basic info
    age: '',
    gender: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    
    // Health info
    activityLevel: '',
    waterIntake: '',
    sleepHours: '',
    medicalConditions: '',
    medications: '',
    
    // Dietary info
    allergies: [],
    dietType: '',
    cuisinePreferences: [],
    mealFrequency: 3,
    
    // Meal preferences
    mealPreferences: {
      breakfast: true,
      morningSnack: false,
      lunch: true,
      afternoonSnack: false,
      dinner: true,
      eveningSnack: false
    },
    mealPrepTime: 'medium',
    cookingSkill: 'intermediate',
    
    // Goal information
    goalType: 'weightLoss',
    targetTimeframe: '',
    priorityLevel: 'medium',
    previousDiets: '',
    
    // Additional preferences
    budgetConstraint: 'medium',
    groceryFrequency: 'weekly',
    foodRestrictions: '',
    additionalNotes: ''
  });

  useEffect(() => {
    const fetchNutritionist = async () => {
      try {
        setLoading(true);
        const data = await getNutritionistProfile(nutritionistId);
        setNutritionist(data);
      } catch (error) {
        console.error('Error fetching nutritionist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNutritionist();
  }, [nutritionistId, getNutritionistProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergiesChange = (event, newValues) => {
    setFormData(prev => ({
      ...prev,
      allergies: newValues
    }));
  };
  
  const handleCuisinePreferencesChange = (event, newValues) => {
    setFormData(prev => ({
      ...prev,
      cuisinePreferences: newValues
    }));
  };

  const handleMealPreferenceChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      mealPreferences: {
        ...prev.mealPreferences,
        [name]: checked
      }
    }));
  };
  
// Updated ApplyMealPlan.jsx React component - modify the handleSubmit function
const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create a clean copy of the form data without any potential circular references
      const cleanFormData = {
        ...formData,
        nutritionistId: nutritionistId // Explicitly include the nutritionistId
      };
      
      const success = await applyForMealPlan(nutritionistId, cleanFormData);
      
      if (success) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error submitting meal plan request:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setLoading(false);
    }
};

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: '#f5f5f5',
      pt: '84px'
    }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Paper elevation={0} sx={{ 
          p: { xs: 2, sm: 4, md: 6 }, 
          borderRadius: 2, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          minHeight: 'calc(100vh - 200px)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            pb: 2
          }}>
            <Restaurant sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              Meal Plan Application
            </Typography>
          </Box>
          
          {nutritionist && (
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
              Nutritionist: Dr. {nutritionist.name}
            </Typography>
          )}
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              {/* Basic Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: 'primary.main',
                  mb: 3
                }}>
                  Basic Information
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      InputProps={{ inputProps: { min: 1, max: 120 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        label="Gender"
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Height (cm)"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Current Weight (kg)"
                      name="currentWeight"
                      type="number"
                      value={formData.currentWeight}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Target Weight (kg)"
                      name="targetWeight"
                      type="number"
                      value={formData.targetWeight}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Health Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: 'primary.main',
                  mb: 3
                }}>
                  Health Information
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Activity Level</InputLabel>
                      <Select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleChange}
                        label="Activity Level"
                      >
                        <MenuItem value="sedentary">Sedentary (little or no exercise)</MenuItem>
                        <MenuItem value="light">Light Exercise (1-3 days/week)</MenuItem>
                        <MenuItem value="moderate">Moderate Exercise (3-5 days/week)</MenuItem>
                        <MenuItem value="very">Very Active (6-7 days/week)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Daily Water Intake (Liters)"
                      name="waterIntake"
                      type="number"
                      value={formData.waterIntake}
                      onChange={handleChange}
                      InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                      placeholder="How many liters of water do you drink daily?"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Average Sleep Hours"
                      name="sleepHours"
                      type="number"
                      value={formData.sleepHours}
                      onChange={handleChange}
                      InputProps={{ inputProps: { min: 0, max: 24, step: 0.5 } }}
                      placeholder="How many hours do you sleep on average?"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Medications"
                      name="medications"
                      multiline
                      rows={2}
                      value={formData.medications}
                      onChange={handleChange}
                      placeholder="List any medications you are currently taking"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Medical Conditions"
                      name="medicalConditions"
                      multiline
                      rows={3}
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      placeholder="List any medical conditions or health concerns"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Dietary Preferences */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: 'primary.main',
                  mb: 3
                }}>
                  Dietary Preferences
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Diet Type</InputLabel>
                      <Select
                        name="dietType"
                        value={formData.dietType}
                        onChange={handleChange}
                        label="Diet Type"
                      >
                        {dietTypes.map((diet) => (
                          <MenuItem key={diet.toLowerCase()} value={diet.toLowerCase()}>
                            {diet}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      multiple
                      options={commonAllergies}
                      value={formData.allergies}
                      onChange={handleAllergiesChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Allergies"
                          placeholder="Select allergies"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={index}
                            label={option}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      freeSolo
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      multiple
                      options={cuisinePreferences}
                      value={formData.cuisinePreferences}
                      onChange={handleCuisinePreferencesChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Cuisine Preferences"
                          placeholder="Select cuisines"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={key}
                              label={option}
                              {...tagProps}
                            />
                          );
                        })
                      }
                      freeSolo
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Preferred Meal Times
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.mealPreferences.breakfast}
                            onChange={handleMealPreferenceChange}
                            name="breakfast"
                          />
                        }
                        label="Breakfast"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.mealPreferences.lunch}
                            onChange={handleMealPreferenceChange}
                            name="lunch"
                          />
                        }
                        label="Lunch"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.mealPreferences.dinner}
                            onChange={handleMealPreferenceChange}
                            name="dinner"
                          />
                        }
                        label="Dinner"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Meal Prep Time</InputLabel>
                      <Select
                        name="mealPrepTime"
                        value={formData.mealPrepTime}
                        onChange={handleChange}
                        label="Meal Prep Time"
                      >
                        <MenuItem value="quick">Quick (under 15 minutes)</MenuItem>
                        <MenuItem value="medium">Medium (15-30 minutes)</MenuItem>
                        <MenuItem value="long">Long (30+ minutes)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Cooking Skill</InputLabel>
                      <Select
                        name="cookingSkill"
                        value={formData.cookingSkill}
                        onChange={handleChange}
                        label="Cooking Skill"
                      >
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Goals and Budget */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: 'primary.main',
                  mb: 3
                }}>
                  Goals and Budget
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Goal Type</InputLabel>
                      <Select
                        name="goalType"
                        value={formData.goalType}
                        onChange={handleChange}
                        label="Goal Type"
                      >
                        <MenuItem value="weightLoss">Weight Loss</MenuItem>
                        <MenuItem value="weightGain">Weight Gain</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                        <MenuItem value="muscleGain">Muscle Gain</MenuItem>
                        <MenuItem value="healthImprovement">Health Improvement</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Priority Level</InputLabel>
                      <Select
                        name="priorityLevel"
                        value={formData.priorityLevel}
                        onChange={handleChange}
                        label="Priority Level"
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Budget Constraint</InputLabel>
                      <Select
                        name="budgetConstraint"
                        value={formData.budgetConstraint}
                        onChange={handleChange}
                        label="Budget Constraint"
                      >
                        <MenuItem value="low">Low (Budget Conscious)</MenuItem>
                        <MenuItem value="medium">Medium (Moderate)</MenuItem>
                        <MenuItem value="high">High (Flexible)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Target Timeframe</InputLabel>
                      <Select
                        name="targetTimeframe"
                        value={formData.targetTimeframe}
                        onChange={handleChange}
                        label="Target Timeframe"
                      >
                        <MenuItem value="1month">1 Month</MenuItem>
                        <MenuItem value="3months">3 Months</MenuItem>
                        <MenuItem value="6months">6 Months</MenuItem>
                        <MenuItem value="1year">1 Year</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Previous Diets"
                      name="previousDiets"
                      multiline
                      rows={2}
                      value={formData.previousDiets}
                      onChange={handleChange}
                      placeholder="Describe any previous diets you've tried"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Grocery Shopping Frequency</InputLabel>
                      <Select
                        name="groceryFrequency"
                        value={formData.groceryFrequency}
                        onChange={handleChange}
                        label="Grocery Shopping Frequency"
                      >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="biweekly">Bi-weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Food Restrictions"
                      name="foodRestrictions"
                      multiline
                      rows={2}
                      value={formData.foodRestrictions}
                      onChange={handleChange}
                      placeholder="Any specific food restrictions not covered by allergies"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Additional Notes */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ 
                  color: 'primary.main',
                  mb: 3
                }}>
                  Additional Notes
                </Typography>
                <TextField
                  fullWidth
                  label="Additional Information"
                  name="additionalNotes"
                  multiline
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any additional information you'd like to share"
                />
              </Box>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  disabled={loading}
                  sx={{ 
                    px: 6, 
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default ApplyMealPlan;