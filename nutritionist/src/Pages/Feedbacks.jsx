import React, { useState, useContext, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Rating,
    TextField,
    InputAdornment,
    Stack,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { NutritionistContext } from '../Context/Context';
import { config } from '../Config/Config';

const Feedbacks = () => {
    const { host } = config;
    const { getNutritionistFeedbacks, loading } = useContext(NutritionistContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        const data = await getNutritionistFeedbacks();
        if (data) {
            setFeedbacks(data);
        }
    };

    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                    My Client Feedbacks
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    View feedbacks from your clients
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search by client name or feedback content..."
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
                            <TableCell>Rating</TableCell>
                            <TableCell>Feedback</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography>Loading feedbacks...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredFeedbacks.length > 0 ? (
                            filteredFeedbacks.map((feedback) => (
                                <TableRow key={feedback._id}>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar 
                                                src={feedback.client?.profile ? 
                                                    `${host}/uploads/customer/${feedback.client.profile}` : null
                                                }
                                            >
                                                {feedback.client?.name?.[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2">
                                                    {feedback.client?.name}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {feedback.client?.email}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={1}>
                                            <Rating 
                                                value={feedback.rating} 
                                                readOnly 
                                                precision={0.5} 
                                            />
                                            {/* <Chip
                                                label={`${feedback.rating} / 5`}
                                                size="small"
                                                color={feedback.rating >= 4 ? 'success' : 
                                                       feedback.rating >= 3 ? 'primary' : 'warning'}
                                            /> */}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography style={{ whiteSpace: 'pre-wrap' }}>
                                            {feedback.comment}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(feedback.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(feedback.createdAt).toLocaleTimeString()}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
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