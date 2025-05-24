import React, { useState, useContext, useEffect } from 'react';
import {
    TextField, Paper, Typography, Box, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Grid
} from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
// import Loading from '../components/Loading';
import { config } from "../Config/Config";

const PaymentsManage = () => {
    const { host } = config;
    const { viewPayments, updatePaymentStatus, loading } = useContext(AdminContext);
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', payment: null });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        const data = await viewPayments();
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

    const filteredPayments = payments?.filter(payment =>
        payment.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.status?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleStatusChange = async (payment, status) => {
        setConfirmDialog({
            open: true,
            type: status,
            payment: payment
        });
    };

    const handleConfirmStatusChange = async () => {
        try {
            const { payment, type } = confirmDialog;
            const success = await updatePaymentStatus(payment._id, type);

            if (success) {
                Swal.fire('Success', `Payment ${type} successfully`, 'success');
                fetchPayments(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            Swal.fire('Error', 'Failed to update payment status', 'error');
        } finally {
            setConfirmDialog({ open: false, type: '', payment: null });
        }
    };

    const renderActionButtons = (payment) => {
        if (payment.status === 'processing') {
            return (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleStatusChange(payment, 'paid')}
                        size="small"
                        color="success"
                        variant="contained"
                        sx={{ minWidth: 'auto' }}
                    >
                        Accept
                    </Button>
                    <Button
                        startIcon={<CancelIcon />}
                        onClick={() => handleStatusChange(payment, 'rejected')}
                        size="small"
                        color="error"
                        variant="contained"
                        sx={{ minWidth: 'auto' }}
                    >
                        Reject
                    </Button>
                </Box>
            );
        }
        return (
            // <Button
            //     startIcon={<VisibilityIcon />}
            //     onClick={() => handleViewDetails(payment)}
            //     size="small"
            // >
            //     View
            // </Button>
  <Chip
    label={payment.status === 'paid' ? 'Payment Recieved' : 'Payment Rejected'}
    color={payment.status === 'paid' ? 'success' : 'error'}
    size="small"
    sx={{ fontWeight: 'bold' }}
  />
        );
    };

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
                <Typography variant="h5" fontWeight="bold">
                    Payments Management
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    View and manage all payment transactions
                </Typography>
            </Paper>

            {/* Search Field */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search by client name, reference ID, or status..."
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

            {/* Payments Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 900 }}>
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
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
<Avatar src={`${host}/uploads/customer/${payment.client.profile}`} />
                                            <Box>
                                                <Typography variant="body2">{payment.client?.name}</Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {payment.client?.email}
                                                </Typography>
                                            </Box>
                                        </Box>
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
                                        {new Date(payment.paymentDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {renderActionButtons(payment)}
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

            {/* Payment Details Modal */}
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
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="primary" gutterBottom>
                                    Client Information
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography><strong>Name:</strong> {selectedPayment.client?.name}</Typography>
                                    <Typography><strong>Email:</strong> {selectedPayment.client?.email}</Typography>
                                    <Typography><strong>Phone:</strong> {selectedPayment.client?.phone}</Typography>
                                </Box>

                                <Typography variant="subtitle1" color="primary" gutterBottom>
                                    Payment Information
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography><strong>Reference ID:</strong> {selectedPayment.referenceId}</Typography>
                                    <Typography><strong>Amount:</strong> ₹{selectedPayment.amount}</Typography>
                                    <Typography><strong>Status:</strong> {selectedPayment.status}</Typography>
                                    <Typography><strong>Payment Date:</strong> {new Date(selectedPayment.paymentDate).toLocaleString()}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="primary" gutterBottom>
                                    Meal Plan Information
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography><strong>Plan ID:</strong> {selectedPayment.mealPlanRequest}</Typography>
                                    <Typography><strong>Created:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}</Typography>
                                    <Typography><strong>Updated:</strong> {new Date(selectedPayment.updatedAt).toLocaleString()}</Typography>
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

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, type: '', payment: null })}
            >
                <DialogTitle>
                    Confirm Action
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to {confirmDialog.type} this payment?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialog({ open: false, type: '', payment: null })}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmStatusChange}
                        variant="contained"
                        color={confirmDialog.type === 'completed' ? 'success' : 'error'}
                        autoFocus
                    >
                        Confirm {confirmDialog.type}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentsManage;