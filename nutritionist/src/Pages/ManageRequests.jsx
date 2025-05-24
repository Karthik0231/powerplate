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
  Modal,
  TextField,
  IconButton,
  Chip,
  Divider,
  Avatar,
  Card,
  CardContent,
  Grid,
  Alert,
  Fade,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { NutritionistContext } from '../Context/Context';
import { 
  Close, 
  CheckCircle, 
  Cancel, 
  Refresh, 
  Send,
  AccessTime,
  CheckCircleOutline,
  CancelOutlined,
  QuestionAnswer,
  FilterList,
  Search,
  Person,
  Delete // Add this import
} from '@mui/icons-material';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const { handleConsultancyRequest, getRequests,deleteRequest } = useContext(NutritionistContext);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      showNotification('Failed to load requests', 'error');
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

  const handleOpen = (request) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRequest(null);
    setResponseMessage('');
  };

  const handleStatusChange = async (requestId, status) => {
    try {
      if (!requestId || !status) {
        showNotification('Invalid request data', 'error');
        return;
      }

      let message = '';
      if (status === 'rejected') {
        message = 'Request rejected';
      } else if (status === 'accepted') {
        message = 'Request accepted';
      }

      await handleConsultancyRequest(requestId, status, message);
      fetchRequests(); // Refresh the list
      showNotification(`Request ${status} successfully`);
    } catch (error) {
      console.error('Error updating request status:', error);
      showNotification('Failed to update request status', 'error');
    }
  };

  const handleResponse = async () => {
    try {
      if (!selectedRequest || !responseMessage) {
        showNotification('Please provide a response message', 'error');
        return;
      }

      await handleConsultancyRequest(selectedRequest._id, 'accepted', responseMessage);
      handleClose();
      fetchRequests();
      showNotification('Response sent successfully');
    } catch (error) {
      console.error('Error sending response:', error);
      showNotification('Failed to send response', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FFA726';
      case 'accepted': return '#66BB6A';      case 'rejected': return '#EF5350';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <AccessTime fontSize="small" />;
      case 'accepted': return <CheckCircleOutline fontSize="small" />;
      case 'rejected': return <CancelOutlined fontSize="small" />;
      default: return null;
    }
  };

  const handleDelete = async (requestId) => {
    try {
      if (!requestId) {
        showNotification('Invalid request ID', 'error');
        return;
      }
      const success = await deleteRequest(requestId);
      if (success) {
        fetchRequests(); // Refresh the list
        showNotification('Request deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      showNotification(error.message || 'Failed to delete request', 'error');
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      minHeight: '100vh'
    }}>
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

      <Card elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 3, 
          backgroundColor: 'blue', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5" fontWeight="600" >
            Consultancy Requests Dashboard
          </Typography>
          <Tooltip title="Refresh requests">
            <IconButton color="inherit" onClick={fetchRequests}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderLeft: '4px solid #FFA726', boxShadow: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">Pending</Typography>
                    <Typography variant="h5">{requests.filter(r => r.status === 'pending').length}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#FFF3E0' }}>
                    <AccessTime sx={{ color: '#FFA726' }} />
                  </Avatar>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderLeft: '4px solid #66BB6A', boxShadow: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">Accepted</Typography>
                    <Typography variant="h5">{requests.filter(r => r.status === 'accepted').length}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#E8F5E9' }}>
                    <CheckCircleOutline sx={{ color: '#66BB6A' }} />
                  </Avatar>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderLeft: '4px solid #EF5350', boxShadow: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">Rejected</Typography>
                    <Typography variant="h5">{requests.filter(r => r.status === 'rejected').length}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#FFEBEE' }}>
                    <CancelOutlined sx={{ color: '#EF5350' }} />
                  </Avatar>
                </CardContent>
              </Card>
            </Grid>
          
          </Grid>

          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6" fontWeight="medium">
                Client Requests
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Filter">
                 
                </Tooltip>
                <Tooltip title="Search">
                </Tooltip>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : requests.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">No requests found</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Problem</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow 
                        key={request._id}
                        sx={{ 
                          '&:hover': { bgcolor: 'purple' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            
                            <Typography variant="body2" fontWeight="medium">
                              {request.client.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              whiteSpace: 'normal',
                              wordBreak: 'break-word'
                            }}
                          >
                            {request.message}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              whiteSpace: 'normal',
                              wordBreak: 'break-word'
                            }}
                          >
                            {request.problem}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(request.status)}
                            label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            size="small"
                            sx={{
                              color: 'white',
                              bgcolor: getStatusColor(request.status),
                              '& .MuiChip-icon': { color: 'white' }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Accept Request">
                                <IconButton
                                  size="small"
                                  sx={{ 
                                    bgcolor: '#E8F5E9', 
                                    color: '#66BB6A',
                                    '&:hover': { bgcolor: '#C8E6C9' }
                                  }}
                                  onClick={() => handleStatusChange(request._id, 'accepted')}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject Request">
                                <IconButton
                                  size="small"
                                  sx={{ 
                                    bgcolor: '#FFEBEE', 
                                    color: '#EF5350',
                                    '&:hover': { bgcolor: '#FFCDD2' }
                                  }}
                                  onClick={() => handleStatusChange(request._id, 'rejected')}
                                >
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                          {request.status === 'accepted' && (
                            <Button
                              variant="contained"
                              startIcon={<Send />}
                              size="small"
                              sx={{ 
                                boxShadow: 'none',
                                bgcolor: '#42A5F5',
                                '&:hover': { bgcolor: '#2196F3', boxShadow: 'none' }
                              }}
                              onClick={() => handleOpen(request)}
                            >
                              Respond
                            </Button>
                          )}&nbsp;
                          {request.status === 'accepted' || request.status==='rejected' && (
                            <Tooltip title="Delete Request">
                              <IconButton
                                size="small"
                                sx={{ 
                                  bgcolor: '#FFEBEE', 
                                  color: '#EF5350',
                                  '&:hover': { bgcolor: '#FFCDD2' }
                                }}
                                onClick={() => handleDelete(request._id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </CardContent>
      </Card>

      <Modal 
        open={open} 
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
            outline: 'none'
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 2, 
              bgcolor: 'grey', 
              color: 'white',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8
            }}>
              <Typography variant="h6">Respond to Client</Typography>
              <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
            
            {selectedRequest && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 3, p: 2, bgcolor: 'orange', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Client Details
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedRequest.client.name}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Problem
                  </Typography>
                  <Typography variant="body2">
                    {selectedRequest.problem}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Message
                  </Typography>
                  <Typography variant="body2">
                    {selectedRequest.message}
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Response"
                  placeholder="Type your detailed response here..."
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  sx={{ mb: 3 }}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={handleResponse}
                    disabled={!responseMessage.trim()}
                  >
                    Send Response
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ManageRequests;