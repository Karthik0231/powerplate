import React, { useState, useContext, useEffect } from 'react';
import {
    TextField, Paper, Typography, Box, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Avatar, Tooltip, Button
} from '@mui/material';
import {
    Search as SearchIcon, Block, CheckCircle, Delete, Add as AddIcon
} from '@mui/icons-material';
import { AdminContext } from '../Context/Context';

const Nutritionists = () => {
    const { nutritionists, viewNutritionists, loading } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Call the function to fetch nutritionists
        viewNutritionists();
    }, []); // Empty dependency array means this runs once on mount

    // Log when nutritionists data changes
    useEffect(() => {
        console.log("Nutritionists data updated:", nutritionists);
    }, [nutritionists]);

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
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
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
                                            src={nutritionist.profileImage || '/default-avatar.png'} 
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
                                            <Tooltip title={nutritionist.status === 'active' ? 'Block' : 'Unblock'}>
                                                <IconButton
                                                    size="small"
                                                    color={nutritionist.status === 'active' ? 'error' : 'success'}
                                                    // onClick={() => handleBlockUnblock(nutritionist._id, nutritionist.status)}
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
                                                    // onClick={() => handleDelete(nutritionist._id)}
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
        </Box>
    );
};

export default Nutritionists;