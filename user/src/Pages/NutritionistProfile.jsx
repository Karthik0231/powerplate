import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Rating, 
  Button, 
  Divider, 
  Stack, 
  Chip, 
  Container, 
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { userContext } from '../Context/Context';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Loading from '../components/Loading';
import Banner from '../Components/Banner';
import { 
  Email,
  Phone,
  CalendarToday,
  School,
  Work,
  LocationOn,
  Language,
  AttachMoney,
  AccessTime,
  Link,
  LinkedIn,
  Instagram,
  MedicalServices,
  LocalHospital,
  Restaurant,
  Close
} from '@mui/icons-material';
import bgimage from './images/banner.png';


const ConsultancyModal = ({ open, handleClose, nutritionist }) => {
  const { requestConsultancy } = useContext(userContext);
  const [formData, setFormData] = useState({
    healthCondition: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Add this to prevent default form submission
    try {
      if (!formData.healthCondition || !formData.message) {
        alert('Please fill in all required fields');
        return;
      }
      
      await requestConsultancy(nutritionist._id, formData.message, formData.healthCondition);
      setFormData({ healthCondition: '', message: '' }); // Reset form
      handleClose();
    } catch (error) {
      console.error('Error submitting consultancy request:', error);
      alert('Failed to submit consultation request. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="consultation-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 500 },
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>

        <Typography variant="h5" component="h2" gutterBottom>
          Book Consultation with Dr. {nutritionist?.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          {/* Consultation Fee: ₹{nutritionist?.consultationFee} */}
        </Typography>

        <Stack spacing={3}>                    
          <TextField
            fullWidth
            label="Health Condition"
            name="healthCondition"
            value={formData.healthCondition}
            onChange={handleChange}
            multiline
            rows={2}
            required
          />
          
          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={3}
          />
          
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Book Consultation
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

const NutritionistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();  // Add this line
  const { getNutritionistProfile } = useContext(userContext);
  const [nutritionist, setNutritionist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getNutritionistProfile(id);
        setNutritionist(data);
      } catch (error) {
        console.error('Error fetching nutritionist profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, getNutritionistProfile]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (loading) return <Loading />;
  if (!nutritionist) return <div>Nutritionist not found</div>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc', mt: '84px' }}>
      <Header />
      
      {/* Hero Banner with Glass Effect */}
      <Box
        sx={{
          position: 'relative',
          height: '350px',
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${bgimage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 6
        }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: '1000px',
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            color: 'white'
          }}
        >
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Dr. {nutritionist.name}
          </Typography>
          <Typography variant="h6" mb={3} sx={{ opacity: 0.9 }}>
            {nutritionist.specializedDegrees} | {nutritionist.experience} Years Experience
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<CalendarToday />}
            onClick={handleOpenModal}
            sx={{
              bgcolor: 'primary.main',
              fontWeight: 'bold',
              py: 1.5,
              px: 4,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 15px rgba(25, 118, 210, 0.45)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Request Consultancy
          </Button>
        </Box>
      </Box>
      
      <Container maxWidth="lg" sx={{ pb: 6, flexGrow: 1 }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Left Column - Profile Info */}
<Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2 }}>
  {/* Profile Header */}
  <Box sx={{ 
    position: 'relative',
    display: 'flex',
    flexDirection: {xs: 'column', sm: 'row'},
    alignItems: 'center',
    gap: 3,
    bgcolor: 'white',
    borderRadius: 2,
    p: 3,
    mb: 4,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}>
    <Avatar
      src={nutritionist.profileImage ? `http://localhost:8000/uploads/admin/${nutritionist.profileImage}` : '/images/default-doctor.jpg'}
      alt={nutritionist.name}
      sx={{
        width: {xs: 120, sm: 150},
        height: {xs: 120, sm: 150},
        border: '3px solid #1976d2',
      }}
    />
    
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          Dr. {nutritionist.name}
        </Typography>
        <Chip
          label={nutritionist.status === 'active' ? 'Available' : 'Unavailable'}
          color={nutritionist.status === 'active' ? 'success' : 'default'}
          size="small"
        />
      </Box>
      
      <Typography color="text.secondary" gutterBottom>
        {nutritionist.qualification}, {nutritionist.specializedDegrees}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', my: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTime sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="body2">{nutritionist.officeHours}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="body2">{nutritionist.city}, {nutritionist.state}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* <AttachMoney sx={{ color: 'primary.main', fontSize: 20 }} /> */}
          {/* <Typography variant="body2">₹{nutritionist.consultationFee}/session</Typography> */}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<CalendarToday />}
          onClick={handleOpenModal}
          sx={{ borderRadius: 2 }}
        >
          Book Consultation
        </Button>
        <Button
          variant="contained"
          startIcon={<Restaurant />}
          onClick={() => navigate(`/apply-meal-plan/${nutritionist._id}`)}
          sx={{ 
            borderRadius: 2,
            bgcolor: '#4caf50',
            '&:hover': { bgcolor: '#388e3c' }
          }}
        >
          Apply for Meal Plan
        </Button>
        <Rating value={4.8} precision={0.5} readOnly size="small" />
        <Typography variant="body2" color="text.secondary">(27)</Typography>
      </Box>
    </Box>
  </Box>

  {/* Quick Info Section */}
  <Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid item xs={12} md={6}>
      <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Contact Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Email sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body2">{nutritionist.email}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Phone sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Phone</Typography>
                <Typography variant="body2">{nutritionist.phone}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Language sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Languages</Typography>
                <Typography variant="body2">{nutritionist.languages}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>

    <Grid item xs={12} md={6}>
      <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Qualifications
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <School sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Primary Qualification</Typography>
                <Typography variant="body2">{nutritionist.qualification}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Work sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Experience</Typography>
                <Typography variant="body2">{nutritionist.experience} Years</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  </Grid>

  {/* Social Links */}
  <Box sx={{ 
    display: 'flex', 
    gap: 2, 
    justifyContent: 'center',
    flexWrap: 'wrap'
  }}>
    {nutritionist.website && (
      <Button 
        variant="outlined" 
        startIcon={<Link />}
        href={nutritionist.website}
        target="_blank"
        size="small"
      >
        Website
      </Button>
    )}
    {nutritionist.linkedIn && (
      <Button 
        variant="outlined" 
        startIcon={<LinkedIn />}
        href={nutritionist.linkedIn}
        target="_blank"
        size="small"
      >
        LinkedIn
      </Button>
    )}
    {nutritionist.instagram && (
      <Button 
        variant="outlined" 
        startIcon={<Instagram />}
        href={nutritionist.instagram}
        target="_blank"
        size="small"
      >
        Instagram
      </Button>
    )}
  </Box>
</Box>
          
          {/* Right Column - Main Content */}
          <Grid item xs={12} md={8}>
            {/* About */}
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 4, 
                p: 4, 
                mb: 4,
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  width: 4, 
                  height: 24, 
                  borderRadius: 1, 
                  mr: 2 
                }} />
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  About Dr. {nutritionist.name.split(' ')[0]}
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                {nutritionist.bio}
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
                    p: 3, 
                    borderRadius: 3,
                    color: 'white',
                    boxShadow: '0 6px 15px rgba(25, 118, 210, 0.25)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <School sx={{ mr: 1, fontSize: 30 }} />
                      <Typography variant="h6" fontWeight="bold">Specialization</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {nutritionist.specialization}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #4db6ac 0%, #009688 100%)', 
                    p: 3, 
                    borderRadius: 3,
                    color: 'white',
                    boxShadow: '0 6px 15px rgba(0, 150, 136, 0.25)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MedicalServices sx={{ mr: 1, fontSize: 30 }} />
                      <Typography variant="h6" fontWeight="bold">Experience</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {nutritionist.experience} Years of Professional Experience in the field of Nutrition and Dietetics
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Diet Types & Health Conditions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    p: 3, 
                    height: '100%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      bgcolor: '#ff9800', 
                      borderRadius: '50%', 
                      width: 40, 
                      height: 40, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 8px rgba(255, 152, 0, 0.25)'
                    }}>
                      <Restaurant sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">Diet Types Handled</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {nutritionist.dietTypesHandled.map((diet) => (
                      <Chip 
                        key={diet}
                        label={diet} 
                        sx={{ 
                          fontWeight: 500, 
                          mb: 1, 
                          bgcolor: 'rgba(255, 152, 0, 0.1)', 
                          color: '#ff9800', 
                          border: '1px solid rgba(255, 152, 0, 0.3)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 152, 0, 0.15)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    p: 3, 
                    height: '100%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      bgcolor: '#e91e63', 
                      borderRadius: '50%', 
                      width: 40, 
                      height: 40, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 8px rgba(233, 30, 99, 0.25)'
                    }}>
                      <LocalHospital sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">Health Conditions Handled</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {nutritionist.healthConditionsHandled.map((condition) => (
                      <Chip 
                        key={condition}
                        label={condition}
                        sx={{ 
                          fontWeight: 500, 
                          mb: 1, 
                          bgcolor: 'rgba(233, 30, 99, 0.1)', 
                          color: '#e91e63',
                          border: '1px solid rgba(233, 30, 99, 0.3)',
                          '&:hover': {
                            bgcolor: 'rgba(233, 30, 99, 0.15)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
          </Grid>
        </Grid>
      </Container>
      
      {/* Consultancy Modal */}
      <ConsultancyModal 
        open={modalOpen}
        handleClose={handleCloseModal}
        nutritionist={nutritionist}
      />
      
      <Footer />
    </Box>
  );
};

export default NutritionistProfile;