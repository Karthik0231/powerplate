import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box, Typography, Paper, Chip, Modal, TextField, Button, CircularProgress, Card, CardContent, Divider, IconButton, Tooltip } from '@mui/material';
import { userContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Loading from '../components/Loading';
import Section from '../components/Section';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import PageHeader from '../components/PageHeader';
import { RequestPage, TrendingUp, Person, Restaurant, Timeline, FitnessCenter, Payment, Schedule } from '@mui/icons-material';
import bgimage from '../assets/banner.png';
import qr from '../assets/qr.png';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { config } from '../Config/Config';

const { host } = config;

const UserRequests = () => {
  // Move all hooks to the top level
  const { consultancyRequests, getUserRequests, loading, verifyPayment } = useContext(userContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [referenceId, setReferenceId] = useState('');
  const [paymentStatuses, setPaymentStatuses] = useState({});

  useEffect(() => {
    getUserRequests();
  }, []);

  // Fetch payment statuses for all requests
  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      if (consultancyRequests?.length) {
        const statuses = {};
        for (const request of consultancyRequests) {
          const status = await checkPaymentStatus(request._id);
          statuses[request._id] = status;
        }
        setPaymentStatuses(statuses);
      }
    };
    fetchPaymentStatuses();
  }, [consultancyRequests]);

  const filteredRequests = consultancyRequests?.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (request.nutritionist?.name?.toLowerCase() || '').includes(searchLower) ||
      (request.basicInfo?.dietType?.toLowerCase() || '').includes(searchLower) ||
      (request.status?.toLowerCase() || '').includes(searchLower)
    );
  }) || [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', color: '#856404', border: '#ffc107' };
      case 'created':
        return { bg: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)', color: '#155724', border: '#28a745' };
      case 'accepted':
        return { bg: 'linear-gradient(135deg, #cce5ff 0%, #99d6ff 100%)', color: '#004085', border: '#007bff' };
      case 'rejected':
        return { bg: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)', color: '#721c24', border: '#dc3545' };
      default:
        return { bg: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', color: '#6c757d', border: '#6c757d' };
    }
  };

  if (loading) return <Loading />;

  const handlePaymentSubmit = async () => {
    try {
        if (!selectedRequest || !referenceId.trim()) {
            Swal.fire('Error', 'Please enter a valid reference ID', 'error');
            return;
        }

        // Call the verifyPayment function
        const success = await verifyPayment(selectedRequest._id, referenceId);
        setPaymentModalOpen(false);

        if (success) {
            // Close modal first
            
            // Reset states
            setReferenceId('');
            setSelectedRequest(null);
            
            // Refresh the requests list
            await getUserRequests();

            // Show success message after modal is closed
            await Swal.fire({
                icon: 'success',
                title: 'Payment Verified',
                text: 'Your payment has been verified successfully'
            });
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to process payment. Please try again.'
        });
    }
  };

  // Update the checkPaymentStatus function
  const checkPaymentStatus = async (requestId) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${host}/customer/payment-status/${requestId}`, {
        headers: {
          'auth-token': token
        }
      });

      return response.data.payment?.status;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return null;
    }
  };

  // Update the renderActionButton function
  const renderActionButton = (request) => {
    const paymentStatus = paymentStatuses[request._id];

    if (paymentStatus === 'paid') {
      return (
        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)',
                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
            startIcon={<VisibilityIcon />}
            onClick={() => navigate(`/meal-plan/${request._id}`)}
          >
            View Plan
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#FF9800',
              color: '#FF9800',
              fontWeight: 'bold',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              borderRadius: '12px',
              borderWidth: '2px',
              '&:hover': {
                borderColor: '#F57C00',
                color: '#F57C00',
                backgroundColor: 'rgba(255, 152, 0, 0.04)',
                borderWidth: '2px',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
            startIcon={<TrendingUp />}
            onClick={() => navigate(`/progress/${request._id}`)}
          >
            Update Progress
          </Button>
        </Box>
      );
    } else if (request.status === 'created') {
      return (
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(255, 87, 34, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #E64A19 0%, #D84315 100%)',
              boxShadow: '0 6px 20px rgba(255, 87, 34, 0.4)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
          startIcon={<Payment />}
          onClick={() => {
            setSelectedRequest(request);
            setPaymentModalOpen(true);
          }}
        >
          💰 Pay to View
        </Button>
      );
    }
    return null;
  };

  const InfoCard = ({ icon, title, value, color = '#6366f1' }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${color}20`,
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: `${color}20`,
          mr: 2,
        }}
      >
        {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', pt: '84px' }}>
      <Header />
      
      <Banner
        title="Your Meal Plan Requests"
        subtitle="Track and manage your nutritionist meal plan requests with ease"
        backgroundImage={bgimage}
        height="350px"
      >
      </Banner>

      <Section sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          <PageHeader
            title="Meal Plan Request History"
            subtitle="View and track all your meal plan requests in one place"
            icon={<RequestPage sx={{ fontSize: 32, color: '#6366f1' }} />}
          />
          
          <Grid container spacing={3}>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <Grid item xs={12} key={request._id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
                        borderColor: '#6366f1',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Grid container spacing={3}>
                        {/* Header Section */}
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                            <Box>
                              <Typography 
                                variant="h5" 
                                sx={{ 
                                  fontWeight: 700, 
                                  mb: 1,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  backgroundClip: 'text',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                {request.nutritionist?.name || 'Nutritionist'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  Requested on {new Date(request.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip 
                              label={request.status || 'Pending'}
                              sx={{ 
                                background: getStatusColor(request.status).bg,
                                color: getStatusColor(request.status).color,
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                px: 2,
                                py: 1,
                                height: 'auto',
                                border: `2px solid ${getStatusColor(request.status).border}`,
                                textTransform: 'capitalize',
                              }}
                            />
                          </Box>
                        </Grid>

                        {/* Info Cards Section */}
                        <Grid item xs={12} md={8}>
                          <Grid container spacing={2}>
                            {/* Basic Info Cards */}
                            <Grid item xs={12} sm={6}>
                              <InfoCard
                                icon={<Person />}
                                title="Age & Weight"
                                value={`${request.basicInfo?.age} years • ${request.basicInfo?.currentWeight} kg`}
                                color="#8b5cf6"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <InfoCard
                                icon={<FitnessCenter />}
                                title="Height & Target"
                                value={`${request.basicInfo?.height} cm • ${request.basicInfo?.targetWeight} kg target`}
                                color="#06b6d4"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <InfoCard
                                icon={<Restaurant />}
                                title="Diet Type"
                                value={request.dietaryInfo?.dietType || 'Not specified'}
                                color="#10b981"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <InfoCard
                                icon={<Timeline />}
                                title="Goal & Timeline"
                                value={`${request.goalInfo?.goalType} • ${request.goalInfo?.targetTimeframe}`}
                                color="#f59e0b"
                              />
                            </Grid>
                          </Grid>

                          {/* Detailed Information */}
                          <Box sx={{ mt: 3 }}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 3, 
                                borderRadius: 3, 
                                bgcolor: '#f8fafc',
                                border: '1px solid #e2e8f0'
                              }}
                            >
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#374151' }}>
                                    🍽️ Dietary Preferences
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      <strong>Allergies:</strong> {request.dietaryInfo?.allergies?.join(', ') || 'None specified'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      <strong>Cuisines:</strong> {request.dietaryInfo?.cuisinePreferences?.join(', ') || 'No preference'}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#374151' }}>
                                    🎯 Health Goals
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      <strong>Primary Goal:</strong> {request.goalInfo?.goalType || 'Not specified'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      <strong>Timeline:</strong> {request.goalInfo?.targetTimeframe || 'Not specified'}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Box>
                        </Grid>

                        {/* Action Section */}
                        <Grid item xs={12} md={4}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              height: '100%',
                              textAlign: 'center',
                              gap: 2
                            }}
                          >
                            {renderActionButton(request)}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper 
                  sx={{ 
                    p: 6, 
                    textAlign: 'center',
                    borderRadius: 4,
                    bgcolor: 'white',
                    border: '2px dashed #e2e8f0'
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <RequestPage sx={{ fontSize: 64, color: '#cbd5e1' }} />
                  </Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                    No requests found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try adjusting your search terms or make a new consultancy request
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Section>

      <Footer />
      
      {/* Enhanced Payment Modal */}
      <Modal
        open={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setReferenceId('');
          setSelectedRequest(null);
        }}
        aria-labelledby="payment-modal"
        aria-describedby="payment-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            width: 450,
            maxWidth: '90vw',
            borderRadius: 4,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            outline: 'none',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 3,
              textAlign: 'center'
            }}
          >
            <Payment sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Complete Payment
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Secure payment for your meal plan
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#059669', mb: 1 }}>
                ₹500
              </Typography>
              <Typography variant="body2" color="text.secondary">
                One-time payment for personalized meal plan
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Scan the QR code below to make the payment, then enter your reference ID
            </Typography>
            
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              border: '2px dashed #e2e8f0', 
              borderRadius: 2,
              textAlign: 'center'
            }}>
              <img 
                src={qr}
                alt="Payment QR Code" 
                style={{ width: '200px', height: '200px', objectFit: 'contain' }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Reference ID"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="Enter your payment reference ID"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                fullWidth
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
                onClick={() => {
                    setPaymentModalOpen(false);
                    setReferenceId('');
                    setSelectedRequest(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                fullWidth
                variant="contained" 
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                  }
                }}
                onClick={handlePaymentSubmit}
                disabled={!referenceId.trim() || loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Payment'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Modal>
    </Box>
  );
};

export default UserRequests;