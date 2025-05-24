import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Avatar,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Container,
    IconButton,
    Alert,
    Snackbar,
    Divider,
    Stack,
    CircularProgress,
    Card,
    CardContent,
    Fade,
    Grow,
    Chip
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    PhotoCamera,
    Save as SaveIcon,
    Edit as EditIcon,
    Scale,
    Height,
    Cake,
    PersonOutline,
    FitnessCenter,
    AccountCircle
} from '@mui/icons-material';
import { userContext } from '../Context/Context';
import Header from '../Components/Header';
import { config } from '../Config/Config';
import Footer from '../Components/Footer';

const Profile = () => {
    const { host } = config;
    const { userData, getProfile, updateProfile } = useContext(userContext);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ show: false, text: '', type: 'success' });
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        weight: '',
        height: '',
        age: '',
        profile: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                await getProfile();
            } catch (error) {
                setMessage({
                    show: true,
                    text: 'Failed to fetch profile data',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                gender: userData.gender || '',
                weight: userData.weight || '',
                height: userData.height || '',
                age: userData.age || '',
                profile: null
            });
            // Set preview URL with the full path
            if (userData.profileUrl) {
                setPreviewUrl(`${host}${userData.profileUrl}`);
            }
        }
    }, [userData, host]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profile' && files?.[0]) {
            setFormData(prev => ({ ...prev, profile: files[0] }));
            setPreviewUrl(URL.createObjectURL(files[0]));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                // Only append if value exists and is not null
                if (formData[key] !== null && formData[key] !== '') {
                    if (key === 'weight' || key === 'height' || key === 'age') {
                        formDataToSend.append(key, Number(formData[key]));
                    } else {
                        formDataToSend.append(key, formData[key]);
                    }
                }
            });

            const success = await updateProfile(formDataToSend);
            if (success) {
                setMessage({ 
                    show: true, 
                    text: 'Profile updated successfully', 
                    type: 'success' 
                });
                setIsEditing(false);
                // Refresh profile data
                await getProfile();
            }
        } catch (error) {
            setMessage({ 
                show: true, 
                text: error.message || 'Failed to update profile', 
                type: 'error' 
            });
        }
    };

    const getHealthMetrics = () => {
        const weight = parseFloat(formData.weight);
        const height = parseFloat(formData.height) / 100; // Convert to meters
        const bmi = weight && height ? (weight / (height * height)).toFixed(1) : null;
        
        return { bmi };
    };

    const { bmi } = getHealthMetrics();

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            pt: '64px',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
            }
        }}>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            p: 4
                        }}>
                            <CircularProgress sx={{ color: 'white', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: 'white' }}>Loading Profile...</Typography>
                        </Box>
                    </Box>
                ) : (
                    <Fade in={!loading} timeout={800}>
                        <Grid container spacing={3}>
                            {/* Profile Header Card */}
                            <Grid item xs={12}>
                                <Card sx={{ 
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: 4,
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                    overflow: 'visible',
                                    position: 'relative'
                                }}>
                                    <Box sx={{ 
                                        height: 120,
                                        borderRadius: '16px 16px 0 0',
                                        position: 'relative'
                                    }} />
                                    <CardContent sx={{ pt: 0, pb: 4 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: { xs: 'column', md: 'row' },
                                            alignItems: { xs: 'center', md: 'flex-end' },
                                            gap: 3,
                                            mt: -8
                                        }}>
                                            {/* Profile Picture */}
                                            <Box sx={{ 
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}>
                                                <Avatar
                                                    src={previewUrl}
                                                    sx={{
                                                        width: 160,
                                                        height: 160,
                                                        border: '6px solid white',
                                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        fontSize: '3rem'
                                                    }}
                                                >
                                                    {!previewUrl && <AccountCircle sx={{ fontSize: '4rem', color: 'white' }} />}
                                                </Avatar>
                                                {isEditing && (
                                                    <Button
                                                        component="label"
                                                        variant="contained"
                                                        startIcon={<PhotoCamera />}
                                                        sx={{ 
                                                            mt: 2,
                                                            borderRadius: 3,
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                                            }
                                                        }}
                                                    >
                                                        Change Photo
                                                        <input
                                                            type="file"
                                                            hidden
                                                            name="profile"
                                                            accept="image/*"
                                                            onChange={handleInputChange}
                                                        />
                                                    </Button>
                                                )}
                                            </Box>

                                            {/* Profile Info */}
                                            <Box sx={{ 
                                                flex: 1,
                                                textAlign: { xs: 'center', md: 'left' },
                                                mb: { xs: 0, md: 2 }
                                            }}>
                                                <Typography variant="h3" sx={{ 
                                                    fontWeight: 700,
                                                    color: '#2d3748',
                                                    mb: 1,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    {formData.name || 'Your Name'}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: '#718096', mb: 2 }}>
                                                    {formData.email}
                                                </Typography>
                                                <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                                    {formData.gender && (
                                                        <Chip 
                                                            label={formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)} 
                                                            size="small"
                                                            sx={{ 
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                color: 'white',
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    )}
                                                    {formData.age && (
                                                        <Chip 
                                                            label={`${formData.age} years old`} 
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    )}
                                                    {bmi && (
                                                        <Chip 
                                                            label={`BMI: ${bmi}`} 
                                                            size="small"
                                                            color="primary"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    )}
                                                </Stack>
                                            </Box>

                                            {/* Edit Button */}
                                            <Button
                                                variant="contained"
                                                size="large"
                                                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                                                onClick={() => setIsEditing(!isEditing)}
                                                sx={{
                                                    borderRadius: 3,
                                                    px: 4,
                                                    py: 1.5,
                                                    background: isEditing 
                                                        ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {isEditing ? 'Save Profile' : 'Edit Profile'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Form Content */}
                            <Grid item xs={12}>
                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    <Grid container spacing={3}>
                                        {/* Basic Information Card */}
                                        <Grid item xs={12} md={8}>
                                            <Grow in={!loading} timeout={1000}>
                                                <Card sx={{ 
                                                    background: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(20px)',
                                                    borderRadius: 4,
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                                    height: 'fit-content'
                                                }}>
                                                    <CardContent sx={{ p: 2}}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                            <PersonOutline sx={{ 
                                                                mr: 2, 
                                                                fontSize: '2rem',
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                borderRadius: 2,
                                                                p: 1,
                                                                color: 'white'
                                                            }} />
                                                            <Typography variant="h5" sx={{ 
                                                                fontWeight: 700,
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                backgroundClip: 'text',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent'
                                                            }}>
                                                                Basic Information
                                                            </Typography>
                                                        </Box>
                                                        <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, #667eea, transparent)' }} />
                                                        
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Full Name"
                                                                    name="name"
                                                                    value={formData.name}
                                                                    onChange={handleInputChange}
                                                                    disabled={!isEditing}
                                                                    InputProps={{
                                                                        startAdornment: <Person sx={{ mr: 1, color: '#667eea' }} />
                                                                    }}
                                                                    sx={{
                                                                        '& .MuiOutlinedInput-root': {
                                                                            borderRadius: 2,
                                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                                borderColor: '#667eea',
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Email"
                                                                    name="email"
                                                                    value={formData.email}
                                                                    disabled
                                                                    InputProps={{
                                                                        startAdornment: <Email sx={{ mr: 1, color: '#667eea' }} />
                                                                    }}
                                                                    sx={{
                                                                        '& .MuiOutlinedInput-root': {
                                                                            borderRadius: 2,
                                                                            backgroundColor: '#f7fafc'
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Phone"
                                                                    name="phone"
                                                                    value={formData.phone}
                                                                    onChange={handleInputChange}
                                                                    disabled={!isEditing}
                                                                    InputProps={{
                                                                        startAdornment: <Phone sx={{ mr: 1, color: '#667eea' }} />
                                                                    }}
                                                                    sx={{
                                                                        '& .MuiOutlinedInput-root': {
                                                                            borderRadius: 2,
                                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                                borderColor: '#667eea',
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <FormControl fullWidth disabled={!isEditing}>
                                                                    <InputLabel>Gender</InputLabel>
                                                                    <Select
                                                                        name="gender"
                                                                        value={formData.gender}
                                                                        onChange={handleInputChange}
                                                                        label="Gender"
                                                                        sx={{
                                                                            borderRadius: 2,
                                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                                borderColor: '#667eea',
                                                                            }
                                                                        }}
                                                                    >
                                                                        <MenuItem value="male">Male</MenuItem>
                                                                        <MenuItem value="female">Female</MenuItem>
                                                                        <MenuItem value="other">Other</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grow>

                                            <Grid item xs={12} md={4}>
                                            <Grow in={!loading} timeout={1200}>
                                                <Card sx={{ 
                                                    background: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(20px)',
                                                    borderRadius: 4,
                                                    mt:3,
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                                    height: 'fit-content'
                                                }}>
                                                    <CardContent sx={{ p: 4 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                            <FitnessCenter sx={{ 
                                                                mr: 2, 
                                                                fontSize: '2rem',
                                                                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                                                borderRadius: 2,
                                                                p: 1,
                                                                color: 'white'
                                                            }} />
                                                            <Typography variant="h6" sx={{ 
                                                                fontWeight: 700,
                                                                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                                                backgroundClip: 'text',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent'
                                                            }}>
                                                                Health Metrics
                                                            </Typography>
                                                        </Box>
                                                        <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, #48bb78, transparent)' }} />
                                                        
                                                        <Stack spacing={3}>
                                                            <TextField
                                                                fullWidth
                                                                label="Weight (kg)"
                                                                name="weight"
                                                                type="number"
                                                                value={formData.weight}
                                                                onChange={handleInputChange}
                                                                disabled={!isEditing}
                                                                InputProps={{
                                                                    startAdornment: <Scale sx={{ mr: 1, color: '#48bb78' }} />
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: 2,
                                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: '#48bb78',
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <TextField
                                                                fullWidth
                                                                label="Height (cm)"
                                                                name="height"
                                                                type="number"
                                                                value={formData.height}
                                                                onChange={handleInputChange}
                                                                disabled={!isEditing}
                                                                InputProps={{
                                                                    startAdornment: <Height sx={{ mr: 1, color: '#48bb78' }} />
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: 2,
                                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: '#48bb78',
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <TextField
                                                                fullWidth
                                                                label="Age"
                                                                name="age"
                                                                type="number"
                                                                value={formData.age}
                                                                onChange={handleInputChange}
                                                                disabled={!isEditing}
                                                                InputProps={{
                                                                    startAdornment: <Cake sx={{ mr: 1, color: '#48bb78' }} />
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: 2,
                                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                            borderColor: '#48bb78',
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            
                                                            {/* BMI Display */}
                                                            {bmi && (
                                                                <Box sx={{ 
                                                                    p: 2, 
                                                                    borderRadius: 2, 
                                                                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                                                    color: 'white',
                                                                    textAlign: 'center'
                                                                }}>
                                                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                                        Body Mass Index
                                                                    </Typography>
                                                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                                        {bmi}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </Grow>
                                        </Grid>
                                        </Grid>

                                        {/* Physical Information Card */}
                                        
                                    </Grid>

                                    {/* Submit Button */}
                                    {isEditing && (
                                        <Fade in={isEditing} timeout={500}>
                                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    size="large"
                                                    startIcon={<SaveIcon />}
                                                    sx={{
                                                        minWidth: 250,
                                                        height: 56,
                                                        borderRadius: 4,
                                                        fontSize: '1.2rem',
                                                        fontWeight: 700,
                                                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                                        boxShadow: '0 10px 30px rgba(72, 187, 120, 0.3)',
                                                        '&:hover': {
                                                            transform: 'translateY(-3px)',
                                                            boxShadow: '0 15px 40px rgba(72, 187, 120, 0.4)',
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    Save Changes
                                                </Button>
                                            </Box>
                                        </Fade>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Fade>
                )}
            </Container>
            <Footer />
            <Snackbar
                open={message.show}
                autoHideDuration={6000}
                onClose={() => setMessage({ ...message, show: false })}
            >
                <Alert 
                    severity={message.type} 
                    onClose={() => setMessage({ ...message, show: false })}
                    sx={{ 
                        borderRadius: 2,
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                    }}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;