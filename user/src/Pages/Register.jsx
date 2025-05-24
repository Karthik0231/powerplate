import React, { useState, useContext } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Container,
    Link,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { userContext } from '../Context/Context';
import { Link as RouterLink } from 'react-router-dom';
import bgimage from './images/banner.png';

const Register = () => {
    const { RegisterUser } = useContext(userContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        gender: '',
        age: '',
        weight: '',
        height: '',
        profile: null
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value ? Number(value) : '') : value
        }));
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            profile: e.target.files
        });
    };

    const validate = () => {
        let temp = {};
        temp.name = formData.name ? "" : "Name is required.";
        temp.email = /\S+@\S+\.\S+/.test(formData.email) ? "" : "Enter a valid email.";
        temp.password = formData.password.length >= 6 ? "" : "Password must be at least 6 characters.";
        temp.phone = /^\d{10}$/.test(formData.phone) ? "" : "Enter a valid 10-digit phone number.";
        temp.gender = formData.gender ? "" : "Select gender.";
        temp.age = formData.age ? "" : "Enter age.";
        temp.weight = formData.weight ? "" : "Enter weight.";
        if (formData.weight && (formData.weight < 20 || formData.weight > 300)) {
            temp.weight = "Enter a valid weight between 20 and 300 kg";
        }
        temp.height = formData.height ? "" : "Enter height.";
        if (formData.height && (formData.height < 50 || formData.height > 300)) {
            temp.height = "Enter a valid height between 50 and 300 cm";
        }
        temp.profile = formData.profile ? "" : "Upload a profile image.";
        setErrors(temp);
        return Object.values(temp).every(x => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            RegisterUser(formData);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${bgimage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={4} sx={{ p: 5, borderRadius: 3 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Create Account
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                        />
                        <FormControl fullWidth margin="normal" error={!!errors.gender}>
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                name="gender"
                                value={formData.gender}
                                label="Gender"
                                onChange={handleChange}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                            {errors.gender && (
                                <Typography variant="caption" color="error">{errors.gender}</Typography>
                            )}
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            error={!!errors.age}
                            helperText={errors.age}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Weight (kg)"
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleChange}
                            error={!!errors.weight}
                            helperText={errors.weight}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Height (cm)"
                            name="height"
                            type="number"
                            value={formData.height}
                            onChange={handleChange}
                            error={!!errors.height}
                            helperText={errors.height}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="profile"
                            type="file"
                            onChange={handleFileChange}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.profile}
                            helperText={errors.profile}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, py: 1.5, fontWeight: 'bold', letterSpacing: 1 }}
                        >
                            Register
                        </Button>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Already have an account? Sign In
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;
