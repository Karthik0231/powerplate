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
    Chip,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import Swal from 'sweetalert2';
import { config } from '../Config/Config';

const Users = () => {
    const { viewUsers, deleteUser, loading } = useContext(AdminContext);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { host } = config;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await viewUsers();
        if (data) {
            setUsers(data);
        }
    };

    const handleDelete = async (userId) => {
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
                const success = await deleteUser(userId);
                if (success) {
                    fetchUsers(); // Refresh the list
                }
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
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
                    Users Management
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    View and manage all registered users
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search by name, email, or phone..."
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
                            <TableCell>Profile</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Physical Info</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography>Loading users...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <Avatar
                                            src={user.profile ? `${host}/uploads/customer/${user.profile}` : null}
                                            alt={user.name}
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{user.email}</Typography>
                                        <Typography variant="body2">{user.phone}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.gender}
                                            size="small"
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">Weight: {user.weight} kg</Typography>
                                        <Typography variant="body2">Height: {user.height} cm</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Delete User">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography>No users found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Users;