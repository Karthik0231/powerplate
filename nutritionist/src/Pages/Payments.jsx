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
    Avatar,
    TextField,
    InputAdornment,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Stack
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { NutritionistContext } from '../Context/Context';
import { config } from '../Config/Config';

const Payments = () => {
    const { host } = config;
    const { getNutritionistPayments, loading } = useContext(NutritionistContext);
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        const data = await getNutritionistPayments();
        if (data) {
            setPayments(data);
        }
    };

    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPayment(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'processing':
                return 'warning';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const filteredPayments = payments.filter(payment =>
        payment.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.referenceId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate total earnings
    const totalEarnings = payments
        .filter(payment => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);

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
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            My Earnings
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            View your payment history
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h4" fontWeight="bold">
                            ₹{totalEarnings}
                        </Typography>
                        <Typography variant="body2">
                            Total Earnings
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search by client name or reference ID..."
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
                            <TableCell>Reference ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography>Loading payments...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment._id}>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar 
                                                src={payment.client?.profile ? 
                                                    `${host}/uploads/customer/${payment.client.profile}` : null
                                                }
                                            >
                                                {payment.client?.name?.[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2">
                                                    {payment.client?.name}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {payment.client?.email}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{payment.referenceId}</TableCell>
                                    <TableCell>₹{payment.amount}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={payment.status}
                                            color={getStatusColor(payment.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(payment.paymentDate).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(payment.paymentDate).toLocaleTimeString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => handleViewDetails(payment)}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                color:'rgb(228, 107, 46)',
                                                borderColor: 'green',
                                                border:'2px solid',
                                            }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography>No payments found</Typography>
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
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    Payment Details
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedPayment && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="orange" gutterBottom>
                                    Client Information
                                </Typography>
                                <Box sx={{ mb: 3 }}>
                                    <Typography><strong>Name:</strong> {selectedPayment.client?.name}</Typography>
                                    <Typography><strong>Email:</strong> {selectedPayment.client?.email}</Typography>
                                    <Typography><strong>Phone:</strong> {selectedPayment.client?.phone}</Typography>
                                </Box>

                                <Typography variant="subtitle1" color="orange" gutterBottom>
                                    Payment Information
                                </Typography>
                                <Box>
                                    <Typography><strong>Reference ID:</strong> {selectedPayment.referenceId}</Typography>
                                    <Typography><strong>Amount:</strong> ₹{selectedPayment.amount}</Typography>
                                    <Typography><strong>Status:</strong> {selectedPayment.status}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="orange" gutterBottom>
                                    Transaction Details
                                </Typography>
                                <Box>
                                    <Typography><strong>Payment Date:</strong> {new Date(selectedPayment.paymentDate).toLocaleString()}</Typography>
                                    <Typography><strong>Updated At:</strong> {new Date(selectedPayment.updatedAt).toLocaleString()}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Payments;