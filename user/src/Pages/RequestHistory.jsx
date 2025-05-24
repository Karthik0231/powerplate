import React, { useContext, useEffect } from 'react';
import { Grid, Box, Typography, Paper, Chip } from '@mui/material';
import { userContext } from '../Context/Context';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Loading from '../components/Loading';
import Section from '../components/Section';
import Banner from '../components/Banner';
import bgimage from '../assets/banner.png';

const RequestHistory = () => {
  const { consultancyHistory, viewConsultancyHistory, loading } = useContext(userContext);

  useEffect(() => {
    viewConsultancyHistory();
  }, []);

  if (loading) return <Loading />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' };
      case 'accepted':
        return { bg: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' };
      case 'rejected':
        return { bg: 'rgba(244, 67, 54, 0.1)', color: '#f44336' };
      default:
        return { bg: 'rgba(158, 158, 158, 0.1)', color: '#9e9e9e' };
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f8fafc',
      pt: '84px'
    }}>
      <Header />
      
      <Banner
        title="Your Consultation Requests"
        subtitle="Track the status of your consultation requests with our nutritionists"
        backgroundImage={bgimage}
        height="300px"
      />

      <Section sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          <Grid container spacing={3}>
            {consultancyHistory && consultancyHistory.length > 0 ? (
              consultancyHistory.map((request) => (
                <Grid item xs={12} key={request._id}>
                  <Paper
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'box-shadow 0.3s',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ height: 8, bgcolor: 'primary.main' }} />
                    
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            Request to Dr. {request.nutritionist?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Submitted on: {new Date(request.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip 
                          label={request.status.toUpperCase()}
                          sx={{ 
                            bgcolor: getStatusColor(request.status).bg,
                            color: getStatusColor(request.status).color,
                            fontWeight: 500
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Health Condition:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {request.problem}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Your Message:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {request.message}
                        </Typography>

                        {request.responseMessage && (
                          <>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Nutritionist's Response:
                            </Typography>
                            <Typography variant="body1">
                              {request.responseMessage}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'white'
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No consultation requests found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    You haven't made any consultation requests yet
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Section>

      <Footer />
    </Box>
  );
};

export default RequestHistory;