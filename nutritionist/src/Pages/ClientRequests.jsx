import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Button,
    Stack,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import { NutritionistContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import { config } from '../Config/Config';

const ClientRequests = () => {
    const { getMealPlanRequests, loading } = useContext(NutritionistContext);
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { host } = config;

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const data = await getMealPlanRequests();
        if (data) {
            // Filter only accepted or created requests
            const validRequests = data.filter(req => 
                ['accepted', 'created'].includes(req.status)
            );
            setRequests(validRequests);
        }
    };

    const handleViewProgress = (requestId) => {
        navigate(`/request-progress/${requestId}`);
    };

    const filteredRequests = requests.filter(request =>
        request.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.client?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ minHeight: '100vh', py: 3 }}>
            <Container maxWidth="xl">
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                        color: 'white'
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        Client Progress Management
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                        View and track your clients' progress
                    </Typography>
                </Paper>

                <Paper sx={{ p: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search clients by name or email..."
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
                            <TableRow sx={{ bgcolor: 'black' }}>
                                <TableCell>Client</TableCell>
                                <TableCell>Request Details</TableCell>
                                <TableCell>Goals</TableCell>
                                <TableCell>Dietary Info</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography>Loading requests...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <TableRow key={request._id}>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                {/* <Avatar 
                                                    src={request.client?.profile ? 
                                                        `${host}/uploads/customer/${request.client.profile}` : null
                                                    }
                                                >
                                                    {request.client?.name?.[0]}
                                                </Avatar> */}
                                                <Box>
                                                    <Typography>{request.client?.name}</Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {request.client?.email}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                Requested: {new Date(request.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {request.goalInfo?.goalType}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                Diet: {request.dietaryInfo?.dietType}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Allergies: {request.dietaryInfo?.allergies?.join(', ')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.status}
                                                color={
                                                    request.status === 'created' ? 'success' :
                                                    request.status === 'accepted' ? 'primary' : 'default'
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="View Progress History">
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<ShowChartIcon />}
                                                        onClick={() => handleViewProgress(request._id)}
                                                        sx={{
                                                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                                        }}
                                                    >
                                                        Progress History
                                                    </Button>
                                                </Tooltip>
                                            </Stack>
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
            </Container>
        </Box>
    );
};

export default ClientRequests;