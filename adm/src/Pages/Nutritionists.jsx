import React, { useState, useContext, useEffect } from 'react';
import {
    TextField, Paper, Typography, Box, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Avatar, Tooltip, Button, Dialog, DialogTitle, 
    DialogContent, DialogActions, Grid
} from '@mui/material';
import {
    Search as SearchIcon, Block, CheckCircle, Delete, Add as AddIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import { config } from '../Config/Config';

const Nutritionists = () => {
    const { host } = config;
    const [nutritionists, setNutritionists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedNutritionist, setSelectedNutritionist] = useState(null);

    // Fetch nutritionists on component mount
    useEffect(() => {
        viewNutritionists();
    }, []);

    const viewNutritionists = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const response = await axios.get(
                `${host}/admin/nutritionists`,
                { headers: { 'auth-token': token } }
            );
            
            if (response.data.success) {
                setNutritionists(response.data.nutritionists);
            } else {
                throw new Error(response.data.message || 'Failed to fetch nutritionists');
            }
        } catch (err) {
            console.error("Error fetching nutritionists:", err);
            Swal.fire('Error', err.message || 'Failed to load nutritionists', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (nutritionist) => {
        setSelectedNutritionist(nutritionist);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedNutritionist(null);
    };

    const handleBlockUnblock = async (nutritionistId, currentStatus) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            const response = await axios.put(
                `${host}/admin/nutritionist/${nutritionistId}/status`,
                { status: newStatus },
                { headers: { 'auth-token': token } }
            );
            if (response.data.success) {
                Swal.fire('Success', `Nutritionist ${newStatus} successfully`, 'success');
                viewNutritionists();
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            Swal.fire('Error', err.message || 'Failed to update status', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (nutritionistId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
                setLoading(true);
                const token = localStorage.getItem("adminToken");
                const response = await axios.delete(
                    `${host}/admin/nutritionist/${nutritionistId}`,
                    { headers: { 'auth-token': token } }
                );
                if (response.data.success) {
                    Swal.fire('Deleted!', 'Nutritionist deleted successfully', 'success');
                    viewNutritionists();
                } else {
                    throw new Error(response.data.message);
                }
            }
        } catch (err) {
            Swal.fire('Error', err.message || 'Failed to delete nutritionist', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredNutritionists = nutritionists?.filter((n) =>
        n.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Header Section */}
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
                            Nutritionists Management
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            View and manage all nutritionists in the system
                        </Typography>
                    </Box>
                    <Button
                        href="/add-nutritionist"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            bgcolor: 'white',
                            color: '#1976d2',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#f0f0f0' }
                        }}
                    >
                        Add Nutritionist
                    </Button>
                </Box>
            </Paper>

            {/* Search Field */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search by name, email, or specialization..."
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

            {/* Nutritionist Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'black' }}>
                            <TableCell>Profile</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Qualification</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Specialization</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>Loading nutritionists...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredNutritionists.length > 0 ? (
                            filteredNutritionists.map((nutritionist) => (
                                <TableRow key={nutritionist._id}>
                                    <TableCell>
                                        <Avatar 
                                            src={nutritionist.profileImage ? `${host}/uploads/admin/${nutritionist.profileImage}` : '/placeholder-nutritionist.jpg'}
                                            alt={nutritionist.name}
                                        />
                                    </TableCell>
                                    <TableCell>{nutritionist.name}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{nutritionist.email}</Typography>
                                        <Typography variant="body2">{nutritionist.phone}</Typography>
                                    </TableCell>
                                    <TableCell>{nutritionist.qualification}</TableCell>
                                    <TableCell>{nutritionist.experience}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={nutritionist.specialization} 
                                            size="small" 
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={nutritionist.status}
                                            size="small"
                                            color={nutritionist.status === 'active' ? 'success' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    color="danger"
                                                    onClick={() => handleViewDetails(nutritionist)}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={nutritionist.status === 'active' ? 'Block' : 'Unblock'}>
                                                <IconButton
                                                    size="small"
                                                    color={nutritionist.status === 'active' ? 'error' : 'success'}
                                                    onClick={() => handleBlockUnblock(nutritionist._id, nutritionist.status)}
                                                >
                                                    {nutritionist.status === 'active' ? 
                                                        <Block fontSize="small" /> : 
                                                        <CheckCircle fontSize="small" />
                                                    }
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(nutritionist._id)}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No nutritionists found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
                
            <Dialog 
                open={openModal} 
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle 
                    sx={{ 
                        bgcolor: '', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    {selectedNutritionist && (
                        <>
                            <Avatar
                                src={selectedNutritionist.profileImage ? 
                                    `${host}/uploads/admin/${selectedNutritionist.profileImage}` : 
                                    '/placeholder-nutritionist.jpg'
                                }
                                sx={{ width: 40, height: 40 }}
                            />
                            <Typography variant="h6">
                                {selectedNutritionist.name}'s Profile
                            </Typography>
                        </>
                    )}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedNutritionist && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="orange" gutterBottom>
                                    Personal Information
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography><strong>Email:</strong> {selectedNutritionist.email}</Typography>
                                    <Typography><strong>Phone:</strong> {selectedNutritionist.phone}</Typography>
                                    <Typography><strong>Gender:</strong> {selectedNutritionist.gender}</Typography>
                                    <Typography><strong>Date of Birth:</strong> {new Date(selectedNutritionist.dateOfBirth).toLocaleDateString()}</Typography>
                                </Box>

                                <Typography variant="subtitle1" color="orange" gutterBottom>
                                    Address
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography><strong>Address:</strong> {selectedNutritionist.address}</Typography>
                                    <Typography><strong>City:</strong> {selectedNutritionist.city}</Typography>
                                    <Typography><strong>State:</strong> {selectedNutritionist.state}</Typography>
                                    <Typography><strong>ZIP Code:</strong> {selectedNutritionist.zipCode}</Typography>
                                    <Typography><strong>Country:</strong> {selectedNutritionist.country}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="orange" gutterBottom>
                                    Professional Details
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography><strong>Qualification:</strong> {selectedNutritionist.qualification}</Typography>
                                    <Typography><strong>Specialized Degrees:</strong> {selectedNutritionist.specializedDegrees}</Typography>
                                    <Typography><strong>Certifications:</strong> {selectedNutritionist.certifications}</Typography>
                                    <Typography><strong>Experience:</strong> {selectedNutritionist.experience}</Typography>
                                    <Typography><strong>Specialization:</strong> {selectedNutritionist.specialization}</Typography>
                                    <Typography><strong>Languages:</strong> {selectedNutritionist.languages}</Typography>
                                </Box>

                                <Typography variant="subtitle1" color="orange" gutterBottom>
                                    Practice Information
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    {/* <Typography><strong>Consultation Fee:</strong> ₹{selectedNutritionist.consultationFee}</Typography> */}
                                    <Typography><strong>Office Hours:</strong> {selectedNutritionist.officeHours}</Typography>
                                    <Typography><strong>Diet Types:</strong> {selectedNutritionist.dietTypesHandled?.join(', ')}</Typography>
                                    <Typography><strong>Health Conditions:</strong> {selectedNutritionist.healthConditionsHandled?.join(', ')}</Typography>
                                </Box>

                                <Typography variant="subtitle1" color="orange" gutterBottom>
                                    Social Media
                                </Typography>
                                <Box>
                                    <Typography><strong>Website:</strong> {selectedNutritionist.website}</Typography>
                                    <Typography><strong>LinkedIn:</strong> {selectedNutritionist.linkedIn}</Typography>
                                    <Typography><strong>Instagram:</strong> {selectedNutritionist.instagram}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="orange" gutterBottom>
                                    Bio
                                </Typography>
                                <Typography>{selectedNutritionist.bio}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} variant="contained" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Nutritionists;