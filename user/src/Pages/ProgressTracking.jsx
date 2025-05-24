import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Modal,
  IconButton,
  Card,
  CardContent,
  Stack,
  Avatar,
  Divider,
  Tooltip,
  LinearProgress,
  Chip,
  Badge,
  Fade,
  Zoom,
  Slide
} from '@mui/material';
import {
  AddAPhoto,
  Timeline,
  MonitorWeight,
  Height,
  Notes,
  Add as AddIcon,
  Close as CloseIcon,
  TrendingUp,
  PhotoCamera,
  StraightenOutlined,
  FitnessCenter,
  CalendarToday,
  InsertChart
} from '@mui/icons-material';
import { userContext } from '../Context/Context';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Banner from '../components/Banner';
import Loading from '../components/Loading';
import bgimage from '../assets/banner.png';
import Swal from 'sweetalert2';
import {config} from '../Config/Config';

const ProgressTracking = () => {
  const { host } = config;
  const { requestId } = useParams();
  const { getMealPlanById, updateProgress, getProgressHistory, loading } = useContext(userContext);
  const [mealPlan, setMealPlan] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    measurements: {
      waist: '',
      chest: '',
      arms: '',
      thighs: ''
    },
    notes: '',
    photos: []
  });
  const [previewImages, setPreviewImages] = useState([]);

  const fetchMealPlan = async () => {
    try {
        const data = await getMealPlanById(requestId);
        console.log('Fetched meal plan data:', data);

        if (data?.success && data?.mealPlan) {
            setMealPlan(data.mealPlan);
        } else {
            throw new Error('Invalid meal plan data');
        }
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not load meal plan details'
        });
    }
};

  const fetchProgressHistory = async () => {
    try {
        const data = await getProgressHistory(requestId);
        if (data?.success) {
            setProgressHistory(data.progress);
        }
    } catch (error) {
        console.error('Error fetching progress history:', error);
    }
};

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    formDataToSend.append('weight', formData.weight);
    formDataToSend.append('height', formData.height);
    formDataToSend.append('measurements', JSON.stringify(formData.measurements));
    formDataToSend.append('notes', formData.notes);
    
    formData.photos.forEach(photo => {
        formDataToSend.append('photos', photo);
    });

    const success = await updateProgress(requestId, formDataToSend);
    if (success) {
        setModalOpen(false);
        setFormData({
            weight: '',
            height: '',
            measurements: { waist: '', chest: '', arms: '', thighs: '' },
            notes: '',
            photos: []
        });
        setPreviewImages([]);
        fetchProgressHistory();
    }
  };

  useEffect(() => {
    if (requestId) {
        fetchMealPlan();
        fetchProgressHistory();
    }
}, [requestId]);

  if (loading) return <Loading />;
  if (!mealPlan) return (
    <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
    }}>
        <Typography variant="h6" sx={{ fontWeight: 300 }}>
            Meal plan not found or still loading...
        </Typography>
    </Box>
);

  const getMeasurementIcon = (key) => {
    const icons = {
      waist: <StraightenOutlined fontSize="small" />,
      chest: <FitnessCenter fontSize="small" />,
      arms: <FitnessCenter fontSize="small" />,
      thighs: <StraightenOutlined fontSize="small" />
    };
    return icons[key] || <StraightenOutlined fontSize="small" />;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pt: '84px' 
    }}>
      <Header />
      
      <Banner
        title="Progress Tracking"
        subtitle={mealPlan ? `Meal Plan by ${mealPlan.nutritionist.name}` : 'Track your fitness journey'}
        backgroundImage={bgimage}
        height="250px"
      />

      <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
        {/* Add Progress Button */}
        <Fade in timeout={800}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              size="medium"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{ 
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                borderRadius: '25px',
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              Add Progress
            </Button>
          </Box>
        </Fade>

        {/* Progress History Title */}
        <Typography 
          variant="h5" 
          sx={{ 
            textAlign: 'center', 
            mb: 3, 
            fontWeight: 600,
            color: '#2d3748'
          }}
        >
          Progress History
        </Typography>

        {/* Compact Progress Cards Grid */}
        <Grid container spacing={3}>
          {progressHistory.map((progress, index) => (
            <Grid item xs={12} sm={6} lg={4} key={progress._id}>
              <Zoom in timeout={400 + index * 100}>
                <Card 
                  elevation={2}
                  sx={{ 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      borderRadius: '12px 12px 0 0'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Compact Header */}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          fontSize: '1rem',
                          fontWeight: 700
                        }}
                      >
                        {progressHistory.length - index}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', fontSize: '1.1rem' }}>
                          Update #{progressHistory.length - index}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {new Date(progress.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Compact Physical Metrics */}
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea08, #764ba208)',
                        mb: 2
                      }}
                    >
                      <Stack direction="row" spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                          <Avatar sx={{ bgcolor: '#667eea', width: 28, height: 28 }}>
                            <MonitorWeight fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Weight
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                              {progress.weight}kg
                            </Typography>
                          </Box>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                          <Avatar sx={{ bgcolor: '#764ba2', width: 28, height: 28 }}>
                            <Height fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Height
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                              {progress.height}cm
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Compact Measurements */}
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #764ba208, #667eea08)',
                        mb: 2
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#2d3748' }}>
                        Measurements
                      </Typography>
                      <Grid container spacing={1}>
                        {Object.entries(progress.measurements).map(([key, value]) => (
                          <Grid item xs={6} key={key}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5,
                              p: 1,
                              borderRadius: 1.5,
                              bgcolor: 'rgba(255, 255, 255, 0.8)'
                            }}>
                              <Avatar sx={{ width: 20, height: 20, bgcolor: '#667eea' }}>
                                {getMeasurementIcon(key)}
                              </Avatar>
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ 
                                  textTransform: 'capitalize',
                                  fontSize: '0.7rem'
                                }}>
                                  {key}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                  {value}cm
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>

                    {/* Compact Notes */}
                    {progress.notes && (
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #ffeaa708, #ffcc0208)',
                          mb: 2
                        }}
                      >
                        <Stack direction="row" alignItems="flex-start" spacing={1}>
                          <Notes sx={{ fontSize: 16, color: '#ffb347', mt: 0.5 }} />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Notes
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.85rem',
                                color: '#4a5568',
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {progress.notes}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    )}

                    {/* Compact Photos */}
                    {progress.photos?.length > 0 && (
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #e0e7ff08, #c7d2fe08)'
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                          <PhotoCamera sx={{ fontSize: 16, color: '#8b5cf6' }} />
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            Photos ({progress.photos.length})
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ 
                          overflowX: 'auto',
                          '&::-webkit-scrollbar': { height: 4 },
                          '&::-webkit-scrollbar-track': { bgcolor: '#f1f5f9', borderRadius: 2 },
                          '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 2 }
                        }}>
                          {progress.photos.slice(0, 3).map((photo, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                minWidth: 60,
                                height: 60,
                                borderRadius: 2,
                                overflow: 'hidden',
                                position: 'relative'
                              }}
                            >
                              <img
                                src={`${host}${photo}`}
                                alt={`Progress ${idx + 1}`}
                                style={{ 
                                  height: '100%', 
                                  width: '100%', 
                                  objectFit: 'cover'
                                }}
                              />
                            </Box>
                          ))}
                          {progress.photos.length > 3 && (
                            <Box
                              sx={{
                                minWidth: 60,
                                height: 60,
                                borderRadius: 2,
                                bgcolor: 'rgba(139, 92, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed #8b5cf6'
                              }}
                            >
                              <Typography variant="caption" sx={{ color: '#8b5cf6', fontWeight: 600 }}>
                                +{progress.photos.length - 3}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Paper>
                    )}
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {progressHistory.length === 0 && (
          <Fade in timeout={1000}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 6,
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 3,
              backdropFilter: 'blur(20px)'
            }}>
              <InsertChart sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#64748b' }}>
                No Progress Updates Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start tracking your journey by adding your first progress update!
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>

      {/* Progress Update Modal - keeping the same modal code */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="progress-modal"
        closeAfterTransition
      >
        <Fade in={modalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 700,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            '&::-webkit-scrollbar': {
              width: 8
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: '#f1f5f9',
              borderRadius: 4
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#cbd5e1',
              borderRadius: 4
            }
          }}>
            {/* Modal Header */}
            <Box sx={{ 
              p: 4, 
              pb: 2,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              borderRadius: '16px 16px 0 0',
              color: 'white'
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Add Progress Update
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Track your fitness journey with detailed measurements
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => setModalOpen(false)}
                  sx={{ 
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>

            <Box sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Weight & Height Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2d3748' }}>
                      Physical Metrics
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        weight: e.target.value
                      }))}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Height (cm)"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        height: e.target.value
                      }))}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea'
                          }
                        }
                      }}
                    />
                  </Grid>

                  {/* Measurements Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600, color: '#2d3748' }}>
                      Body Measurements
                    </Typography>
                  </Grid>
                  {Object.keys(formData.measurements).map(key => (
                    <Grid item xs={12} sm={6} key={key}>
                      <TextField
                        fullWidth
                        label={`${key.charAt(0).toUpperCase() + key.slice(1)} (cm)`}
                        type="number"
                        value={formData.measurements[key]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          measurements: {
                            ...prev.measurements,
                            [key]: e.target.value
                          }
                        }))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#764ba2'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#764ba2'
                            }
                          }
                        }}
                      />
                    </Grid>
                  ))}

                  {/* Notes Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600, color: '#2d3748' }}>
                      Additional Notes
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Notes (optional)"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#667eea'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea'
                          }
                        }
                      }}
                    />
                  </Grid>

                  {/* Photos Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600, color: '#2d3748' }}>
                      Progress Photos
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<AddAPhoto />}
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#764ba2',
                          color: '#764ba2',
                          bgcolor: 'rgba(102, 126, 234, 0.04)'
                        }
                      }}
                    >
                      Add Photos
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>

                    {previewImages.length > 0 && (
                      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', py: 2 }}>
                        {previewImages.map((preview, idx) => (
                          <Box key={idx} sx={{ position: 'relative', minWidth: 120 }}>
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              style={{ 
                                height: 120, 
                                width: 120, 
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '2px solid #e2e8f0'
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                bgcolor: '#ef4444',
                                color: 'white',
                                width: 24,
                                height: 24,
                                '&:hover': {
                                  bgcolor: '#dc2626'
                                }
                              }}
                              onClick={() => {
                                setPreviewImages(prev => prev.filter((_, i) => i !== idx));
                                setFormData(prev => ({
                                  ...prev,
                                  photos: prev.photos.filter((_, i) => i !== idx)
                                }));
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button 
                    onClick={() => setModalOpen(false)}
                    sx={{ 
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      color: '#64748b',
                      '&:hover': {
                        bgcolor: '#f1f5f9'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                        background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)'
                      },
                      '&:disabled': {
                        background: '#e2e8f0',
                        color: '#94a3b8'
                      }
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Progress'}
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Footer />
    </Box>
  );
};

export default ProgressTracking;
