import React, { useState, useContext, useEffect } from 'react';
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
    IconButton,
    Avatar,
    Tooltip,
    Rating,
    TextField,
    InputAdornment,
    Chip,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import Swal from 'sweetalert2';
import { config } from '../Config/Config';

const Feedbacks = () => {
    const { host } = config;
    const { viewFeedbacks, deleteFeedback, loading } = useContext(AdminContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        const data = await viewFeedbacks();
        if (data) {
            setFeedbacks(data);
        }
    };

    const handleDelete = async (feedbackId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const success = await deleteFeedback(feedbackId);
                if (success) {
                    fetchFeedbacks(); // Refresh the list
                }
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.nutritionist?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
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
                <Typography variant="h5" fontWeight="bold">
                    Feedback Management
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    View and manage all user feedbacks
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search by client, nutritionist, or feedback content..."
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
                <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'black' }}>
                            <TableCell>Client</TableCell>
                            <TableCell>Nutritionist</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Feedback</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography>Loading feedbacks...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredFeedbacks.length > 0 ? (
                            filteredFeedbacks.map((feedback) => (
                                <TableRow key={feedback._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar src={`${host}/uploads/customer/${feedback.client.profile}`}>
                                                <PersonIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2">{feedback.client?.name}</Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {feedback.client?.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar src={`${host}/uploads/admin/${feedback.nutritionist.profileImage}`}>
                                                <PersonIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2">{feedback.nutritionist?.name}</Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {feedback.nutritionist?.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Rating value={feedback.rating} readOnly precision={0.5} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                maxWidth: 300,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {feedback.comment}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Delete Feedback">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(feedback._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography>No feedbacks found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Feedbacks;