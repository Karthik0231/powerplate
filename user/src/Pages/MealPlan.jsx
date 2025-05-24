import React, { useContext, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { userContext } from '../Context/Context';
import CustomCard from '../components/CustomCard';
import Section from '../components/Section';
import Loading from '../components/Loading';

const MealPlan = () => {
  const { mealPlans, getMealPlans, loading } = useContext(userContext);

  useEffect(() => {
    getMealPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <Section title="My Meal Plans" subtitle="Your personalized nutrition guide">
      <Grid container spacing={3}>
        {mealPlans.map((plan) => (
          <Grid item xs={12} key={plan._id}>
            <CustomCard
              title={`Meal Plan (${new Date(plan.startDate).toLocaleDateString()} - ${new Date(plan.endDate).toLocaleDateString()})`}
              subtitle={`By: ${plan.nutritionist.name}`}
              description={
                <Box>
                  <Typography variant="h6">Meals:</Typography>
                  {plan.meals.map((meal, index) => (
                    <Box key={index} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">{meal.type}:</Typography>
                      <Typography>{meal.description}</Typography>
                    </Box>
                  ))}
                  <Typography sx={{ mt: 2 }}>
                    Special Instructions: {plan.specialInstructions}
                  </Typography>
                </Box>
              }
            />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};

export default MealPlan;