import React, { useContext, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { userContext } from '../Context/Context';
import CustomCard from '../components/CustomCard';
import Section from '../components/Section';
import Loading from '../components/Loading';

const ProgressHistory = () => {
  const { progress, getProgressHistory, loading } = useContext(userContext);

  useEffect(() => {
    getProgressHistory();
  }, []);

  if (loading) return <Loading />;

  return (
    <Section title="Progress History" subtitle="Track your fitness journey">
      <Grid container spacing={3}>
        {progress.map((entry) => (
          <Grid item xs={12} sm={6} md={4} key={entry._id}>
            <CustomCard
              title={new Date(entry.date).toLocaleDateString()}
              subtitle={`BMI: ${entry.bmi.toFixed(2)}`}
              description={
                <Box>
                  <Typography>Weight: {entry.weight} kg</Typography>
                  <Typography>Height: {entry.height} cm</Typography>
                  <Typography>Notes: {entry.notes}</Typography>
                </Box>
              }
              images={entry.photos}
            />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};

export default ProgressHistory;