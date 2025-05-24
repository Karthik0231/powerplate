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
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Alert,
  Fade,
  CircularProgress,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh,
  NavigateNext
} from '@mui/icons-material';
import { NutritionistContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';

const MealPlanRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const { getMealPlanRequests, deleteNutritionistMealPlan ,getSingleNutritionistMealPlan} = useContext(NutritionistContext);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getMealPlanRequests();
      console.log('Meal Plan Requests:', data); // Add this to debug
      setRequests(data);
    } catch (error) {
      showNotification('Failed to load meal plan requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  const filteredRequests = requests.filter((request) =>
    request.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePlan = (requestId) => {
    if (!requestId) {
      showNotification('Invalid request ID', 'error');
      return;
    }
    navigate(`/generate-meal-plan/${requestId}`);
  };

  const handleViewPlan = async (requestId) => {
    try {
        const mealPlan = await getSingleNutritionistMealPlan(requestId);
        if (mealPlan) {
            navigate(`/generated-meal/${requestId}`, { state: { mealPlan } });
        } else {
            showNotification('No meal plan found for this request', 'error');
        }
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        showNotification(error.response?.data?.message || 'Error fetching meal plan', 'error');
    }
};

  const handleDeletePlan = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
        try {
            const request = requests.find(r => r._id === requestId);
            if (!request?.nutritionistMealPlan?._id) {
                showNotification('No generated meal plan found for this request', 'error');
                return;
            }
            
            const response = await deleteNutritionistMealPlan(request.nutritionistMealPlan._id);
            console.log('Delete response:', response);
            if (response && response.success) {
                showNotification('Meal plan deleted successfully', 'success');
                fetchRequests();
            } else {
                showNotification(response?.message || 'Failed to delete meal plan', 'error');
            }
        } catch (error) {
            console.error('Error deleting meal plan:', error);
            showNotification(error.response?.data?.message || 'Error deleting meal plan', 'error');
        }
    }
};


  const handleSendPlan = (requestId) => {
    // Implement send plan logic here
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {notification.show && (
        <Fade in={notification.show}>
          <Alert 
            severity={notification.type}
            sx={{ 
              position: 'fixed', 
              top: 24, 
              right: 24, 
              zIndex: 9999,
              boxShadow: 3
            }}
          >
            {notification.message}
          </Alert>
        </Fade>
      )}

      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Meal Plan Requests
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              View and manage meal plan requests from clients
            </Typography>
          </Box>
          <Tooltip title="Refresh requests">
            <IconButton 
              onClick={fetchRequests}
              sx={{ color: 'white' }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by client name or status..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1b5e20' }}>
              <TableCell>Client</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Goals</TableCell>
              <TableCell>Dietary Preferences</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Loading requests...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
  {/* Optional Avatar */}
  {/* <Avatar src={request.clientImage} alt={request.client?.name} /> */}

  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
    {request.client?.name}
  </Typography>
  <Typography variant="body2" sx={{ color: 'gray' }}>
    {request.client?.email}
  </Typography>
</Box>

                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{request.goalInfo.goalType}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">Diet: {request.dietaryInfo.dietType}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Allergies: {request.dietaryInfo.allergies.join(', ')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={
                        request.status === 'pending' ? 'warning' :
                        request.status === 'created' ? 'success' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {request.status === 'created' ? (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{
                            color: 'white',
                            backgroundColor: 'green'
                          }}
                          onClick={() => handleViewPlan(request._id)}
                        >
                          View
                        </Button>
                      </Box>
                    ) : request.status === 'sent' ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleViewPlan(request._id)}
                        endIcon={<NavigateNext />}
                      >
                        View Plan
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleGeneratePlan(request._id)}
                        endIcon={<NavigateNext />}
                      >
                        Generate Plan
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>No meal plan requests found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MealPlanRequests;