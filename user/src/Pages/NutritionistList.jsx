import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box, Typography, Paper, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../Context/Context';
import SearchBar from '../components/SearchBar';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Loading from '../components/Loading';
import Section from '../components/Section';
import Banner from '../components/Banner';
import bgimage from '../assets/banner.png';

const NutritionistList = () => {
  const { nutritionists = [], getNutritionists, loading } = useContext(userContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getNutritionists();
  }, []);

  // Filter only active nutritionists and by search term
  const filteredNutritionists = nutritionists?.filter(nutritionist => {
    if (!nutritionist || nutritionist.status !== 'active') return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (nutritionist.name?.toLowerCase() || '').includes(searchLower) ||
      (nutritionist.specialization?.toLowerCase() || '').includes(searchLower) ||
      (nutritionist.dietTypesHandled?.some(diet => diet.toLowerCase().includes(searchLower))) ||
      (nutritionist.healthConditionsHandled?.some(condition => condition.toLowerCase().includes(searchLower)))
    );
  }) || [];

  if (loading) return <Loading />;

  // Format the experience text
  const formatExperience = (experience) => {
    if (!experience) return '';
    return `${experience} ${parseInt(experience) === 1 ? 'year' : 'years'} experience`;
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
        title="Find Your Perfect Nutritionist"
        subtitle="Connect with certified nutritionists who understand your unique needs and guide you towards your health goals"
        backgroundImage={bgimage}
        height="400px"
      >
        <Paper 
          elevation={3} 
          sx={{ 
            maxWidth: 700,
            width: '100%',
            mx: 'auto',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, specialization, or health conditions..."
            fullWidth
          />
        </Paper>
      </Banner>

      {/* Nutritionists Grid */}
      <Section sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              mb: 4, 
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            Our Expert Nutritionists
          </Typography>
          
          <Grid container spacing={3}>
            {filteredNutritionists.length > 0 ? (
              filteredNutritionists.map((nutritionist) => (
                <Grid item xs={12} sm={6} md={4} key={nutritionist._id}>
                  <Paper
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ height: 8, bgcolor: 'purple' }} />
                    
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar
                          src={nutritionist.profileImage ? `http://localhost:8000/uploads/admin/${nutritionist.profileImage}` : '/placeholder-nutritionist.jpg'}
                          alt={nutritionist.name}
                          sx={{ width: 80, height: 80, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {nutritionist.name || 'Dr. Vinod'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {nutritionist.qualification}, {nutritionist.specializedDegrees || 'Nutrition Specialist'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatExperience(nutritionist.experience)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Languages:</strong> {nutritionist.languages}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {/* <strong>Consultation Fee:</strong> ₹{nutritionist.consultationFee} */}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {nutritionist.dietTypesHandled?.slice(0, 2).map((diet, index) => (
                          <Chip 
                            key={`diet-${index}`} 
                            label={diet} 
                            size="small" 
                            sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: 'primary.main' }} 
                          />
                        ))}
                        {nutritionist.healthConditionsHandled?.slice(0, 2).map((condition, index) => (
                          <Chip 
                            key={`condition-${index}`} 
                            label={condition} 
                            size="small" 
                            sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: 'success.main' }} 
                          />
                        ))}
                      </Box>

                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 3,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          flexGrow: 1
                        }}
                      >
                        {/* {nutritionist.specialization} specialist with expertise in {nutritionist.healthConditionsHandled?.slice(0, 2).join(' and ')}. Available {nutritionist.officeHours}. */}
                      </Typography>
                      
                      <button
                        onClick={() => navigate(`/nutritionist/${nutritionist._id}`)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.2s ease-in-out',
                          marginTop: 'auto'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1565c0'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
                      >
                        View Profile
                      </button>
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
                    No nutritionists found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try adjusting your search terms
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

export default NutritionistList;