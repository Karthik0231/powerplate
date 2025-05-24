import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    Avatar,
    Paper,
    Divider,
    Fade,
    Zoom,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    MonitorWeight,
    Height,
    Notes,
    PhotoCamera,
    StraightenOutlined,
    FitnessCenter,
    InsertChart,
    TrendingUp,
    Person,
    Email,
    Phone,
    Timeline
} from '@mui/icons-material';
import { NutritionistContext } from '../Context/Context';
import { useParams } from 'react-router-dom';
import { config } from '../Config/Config';
import Calendar from '@mui/icons-material/CalendarToday';
const ClientProgress = () => {
    const { host } = config;
    const { requestId } = useParams();
    const { getProgressByRequest, loading, getProgressByMealPlanRequest } = useContext(NutritionistContext);
    const [progressHistory, setProgressHistory] = useState([]);
    const [clientDetails, setClientDetails] = useState(null);
    const [mealPlanDetails, setMealPlanDetails] = useState(null);

    useEffect(() => {
        const fetchProgress = async () => {
            const data = await getProgressByMealPlanRequest(requestId);
            if (data) {
                setProgressHistory(data.progress);
                setClientDetails(data.clientDetails);
                setMealPlanDetails(data.mealPlanDetails);
            }
        };
        fetchProgress();
    }, [requestId]);

    const getMeasurementIcon = (key) => {
        const icons = {
            waist: <StraightenOutlined fontSize="small" />,
            chest: <FitnessCenter fontSize="small" />,
            arms: <FitnessCenter fontSize="small" />,
            thighs: <StraightenOutlined fontSize="small" />
        };
        return icons[key] || <StraightenOutlined fontSize="small" />;
    };

    const getWeightChange = () => {
        if (!clientDetails || progressHistory.length === 0) return 0;
        return (progressHistory[0].weight - clientDetails.weight);
    };

    const getProgressPercentage = () => {
        if (!mealPlanDetails) return 0;
        const start = new Date(mealPlanDetails.startDate);
        const end = new Date(mealPlanDetails.endDate);
        const now = new Date();
        const total = end - start;
        const current = now - start;
        return Math.min(Math.max((current / total) * 100, 0), 100);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            py: 4
        }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            color: 'white', 
                            fontWeight: 700,
                            mb: 1,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        Client Progress Dashboard
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: 'rgba(255,255,255,0.8)',
                            fontWeight: 300
                        }}
                    >
                        Track your client's transformation journey
                    </Typography>
                </Box>

                {/* Client Details Header */}
                {clientDetails && (
                    <Fade in timeout={800}>
                        <Paper 
                            sx={{ 
                                p: 4, 
                                mb: 4, 
                                borderRadius: 4,
                                background: 'linear-gradient(145deg,rgb(54, 155, 70) 0%,rgb(89, 125, 161) 100%)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4}>
                                    <Stack direction="row" spacing={3} alignItems="center">
                                        <Box sx={{ position: 'relative' }}>
                                            <Avatar
                                                src={clientDetails.profile ? `${host}/uploads/customer/${clientDetails.profile}` : null}
                                                sx={{ 
                                                    width: 100, 
                                                    height: 100,
                                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                    fontSize: '2rem',
                                                    fontWeight: 600,
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                }}
                                            >
                                                {clientDetails.name?.[0]}
                                            </Avatar>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -5,
                                                    right: -5,
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(45deg, #4ade80, #22c55e)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                                }}
                                            >
                                                <Person sx={{ color: 'white', fontSize: 16 }} />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Typography 
                                                variant="h4" 
                                                gutterBottom
                                                sx={{ 
                                                    fontWeight: 700,
                                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    mb: 2
                                                }}
                                            >
                                                {clientDetails.name}
                                            </Typography>
                                            <Stack spacing={1}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Email sx={{ color: '#6b7280', fontSize: 18 }} />
                                                    <Typography variant="body1" color="blue">
                                                        {clientDetails.email}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Phone sx={{ color: '#6b7280', fontSize: 18 }} />
                                                    <Typography variant="body1" color="blue">
                                                        {clientDetails.phone}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper 
                                        sx={{ 
                                            p: 3, 
                                            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                            borderRadius: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Typography 
                                            variant="h6" 
                                            gutterBottom
                                            sx={{ 
                                                color: '#374151',
                                                fontWeight: 600,
                                                mb: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <Person sx={{ color: '#667eea' }} />
                                            Client Details
                                        </Typography>
                                        <Stack spacing={2} sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: 'blue' }}>Age:</Typography>
                                                <Chip 
                                                    label={`${clientDetails.age} years`} 
                                                    size="small" 
                                                    sx={{ 
                                                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                        color: 'white',
                                                        fontWeight: 600
                                                    }} 
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: 'blue' }}>Gender:</Typography>
                                                <Chip 
                                                    label={clientDetails.gender} 
                                                    size="small" 
                                                    sx={{ 
                                                        background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                                                        color: 'white',
                                                        fontWeight: 600
                                                    }} 
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: 'blue' }}>Initial Weight:</Typography>
                                                <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 700 }}>
                                                    {clientDetails.weight} kg
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: 'blue' }}>Initial Height:</Typography>
                                                <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 700 }}>
                                                    {clientDetails.height} cm
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper 
                                        sx={{ 
                                            p: 3, 
                                            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
                                            borderRadius: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Typography 
                                            variant="h6" 
                                            gutterBottom
                                            sx={{ 
                                                color: '#92400e',
                                                fontWeight: 600,
                                                mb: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <Calendar sx={{ color: '#f59e0b' }} />
                                            Meal Plan Details
                                        </Typography>
                                        <Stack spacing={2} sx={{ flex: 1 }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: '#92400e', mb: 1 }}>Progress</Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={getProgressPercentage()} 
                                                    sx={{ 
                                                        height: 8, 
                                                        borderRadius: 4,
                                                        backgroundColor: 'rgba(146, 64, 14, 0.2)',
                                                        '& .MuiLinearProgress-bar': {
                                                            background: 'linear-gradient(45deg, #f59e0b, #d97706)'
                                                        }
                                                    }} 
                                                />
                                                <Typography variant="caption" sx={{ color: '#92400e', mt: 1 }}>
                                                    {getProgressPercentage().toFixed(0)}% Complete
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#92400e' }}>Start Date:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#92400e' }}>
                                                    {new Date(mealPlanDetails?.startDate).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#92400e' }}>End Date:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#92400e' }}>
                                                    {new Date(mealPlanDetails?.endDate).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#92400e' }}>Status:</Typography>
                                                <Chip
                                                    size="small"
                                                    label={mealPlanDetails?.status}
                                                    sx={{
                                                        background: mealPlanDetails?.status === 'sent' 
                                                            ? 'linear-gradient(45deg, #22c55e, #16a34a)' 
                                                            : 'linear-gradient(45deg, #6b7280, #4b5563)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize'
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Fade>
                )}

                {/* Progress Summary Section */}
                {progressHistory.length > 0 && (
                    <Fade in timeout={1000}>
                        <Paper 
                            sx={{ 
                                p: 4, 
                                mb: 4, 
                                borderRadius: 4,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                gutterBottom
                                sx={{ 
                                    fontWeight: 700,
                                    color: '#667eea',
                                    mb: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}
                            >
                                <TrendingUp sx={{ color: '#667eea', fontSize: 32 }} />
                                Progress Summary
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                                            borderRadius: 3,
                                            height: '100%'
                                        }}
                                    >
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                color: '#0277bd',
                                                fontWeight: 600,
                                                mb: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <StraightenOutlined sx={{ color: '#0288d1' }} />
                                            Latest Measurements
                                        </Typography>
                                        <Stack spacing={2}>
                                            {Object.entries(progressHistory[0].measurements).map(([key, value]) => (
                                                <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#0277bd', textTransform: 'capitalize' }}>
                                                        {key}:
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ color: '#01579b', fontWeight: 700 }}>
                                                        {value} cm
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                                            borderRadius: 3,
                                            height: '100%'
                                        }}
                                    >
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                color: '#7b1fa2',
                                                fontWeight: 600,
                                                mb: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <MonitorWeight sx={{ color: '#8e24aa' }} />
                                            Weight Change
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#7b1fa2' }}>Initial:</Typography>
                                                <Typography variant="h6" sx={{ color: '#4a148c', fontWeight: 700 }}>
                                                    {clientDetails?.weight} kg
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#7b1fa2' }}>Current:</Typography>
                                                <Typography variant="h6" sx={{ color: '#4a148c', fontWeight: 700 }}>
                                                    {progressHistory[0].weight} kg
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#7b1fa2' }}>Change:</Typography>
                                                <Chip
                                                    label={`${getWeightChange() > 0 ? '+' : ''}${getWeightChange().toFixed(1)} kg`}
                                                    sx={{
                                                        background: getWeightChange() >= 0 
                                                            ? 'linear-gradient(45deg, #22c55e, #16a34a)' 
                                                            : 'linear-gradient(45deg, #ef4444, #dc2626)',
                                                        color: 'white',
                                                        fontWeight: 700
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                                            borderRadius: 3,
                                            height: '100%'
                                        }}
                                    >
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                color: '#2e7d32',
                                                fontWeight: 600,
                                                mb: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <Timeline sx={{ color: '#388e3c' }} />
                                            Progress Stats
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#2e7d32' }}>Total Updates:</Typography>
                                                <Chip
                                                    label={progressHistory.length}
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #388e3c, #2e7d32)',
                                                        color: 'white',
                                                        fontWeight: 700
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#2e7d32' }}>Last Update:</Typography>
                                                <Typography variant="body1" sx={{ color: '#1b5e20', fontWeight: 600 }}>
                                                    {new Date(progressHistory[0].date).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Fade>
                )}

                {/* Progress History Cards */}
                {progressHistory.length === 0 ? (
                    <Fade in timeout={1000}>
                        <Paper sx={{ 
                            textAlign: 'center', 
                            py: 8,
                            borderRadius: 4,
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}>
                            <InsertChart sx={{ fontSize: 80, color: '#cbd5e1', mb: 3 }} />
                            <Typography variant="h5" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                                No Progress Updates Available
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                                Progress updates will appear here once your client starts tracking
                            </Typography>
                        </Paper>
                    </Fade>
                ) : (
                    <Box sx={{ mb: 2 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                color: 'white', 
                                fontWeight: 700,
                                mb: 4,
                                textAlign: 'center',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            Progress Timeline
                        </Typography>
                        <Grid container spacing={3}>
                            {progressHistory.map((progress, index) => (
                                <Grid item xs={12} md={6} lg={4} key={progress._id}>
                                    <Zoom in timeout={400 + index * 100}>
                                        <Card 
                                            elevation={0}
                                            sx={{ 
                                                borderRadius: 4,
                                                height: '100%',
                                                background: 'linear-gradient(145deg, #ffffff 0%,rgb(201, 115, 53) 100%)',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                {/* Date and Entry Number */}
                                                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                                                            width: 56,
                                                            height: 56,
                                                            fontSize: '1.2rem',
                                                            fontWeight: 700,
                                                            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                                                        }}
                                                    >
                                                        {progressHistory.length - index}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography 
                                                            variant="h6"
                                                            sx={{ 
                                                                fontWeight: 700,
                                                                color: '#1e293b',
                                                                mb: 0.5
                                                            }}
                                                        >
                                                            Update #{progressHistory.length - index}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                                            {new Date(progress.date).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                {/* Weight and Height */}
                                                <Paper 
                                                    sx={{ 
                                                        p: 3, 
                                                        mb: 3,
                                                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                                        borderRadius: 3,
                                                        border: '1px solid rgba(14, 165, 233, 0.1)'
                                                    }}
                                                >
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={6}>
                                                            <Stack direction="row" spacing={2} alignItems="center">
                                                                <Box
                                                                    sx={{
                                                                        p: 1.5,
                                                                        borderRadius: 2,
                                                                        background: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}
                                                                >
                                                                    <MonitorWeight sx={{ color: 'white', fontSize: 20 }} />
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600 }}>
                                                                        Weight
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ color: '#0c4a6e', fontWeight: 700 }}>
                                                                        {progress.weight}kg
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Stack direction="row" spacing={2} alignItems="center">
                                                                <Box
                                                                    sx={{
                                                                        p: 1.5,
                                                                        borderRadius: 2,
                                                                        background: 'linear-gradient(45deg, #06b6d4, #0891b2)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}
                                                                >
                                                                    <Height sx={{ color: 'white', fontSize: 20 }} />
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600 }}>
                                                                        Height
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ color: '#0c4a6e', fontWeight: 700 }}>
                                                                        {progress.height}cm
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>

                                                {/* Measurements */}
                                                <Typography 
                                                    variant="subtitle1" 
                                                    gutterBottom
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        color: '#374151',
                                                        mb: 2
                                                    }}
                                                >
                                                    Body Measurements
                                                </Typography>
                                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                                    {Object.entries(progress.measurements).map(([key, value]) => (
                                                        <Grid item xs={6} key={key}>
                                                            <Paper 
                                                                sx={{ 
                                                                    p: 2,
                                                                    background: 'linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%)',
                                                                    borderRadius: 2,
                                                                    border: '1px solid rgba(147, 51, 234, 0.1)'
                                                                }}
                                                            >
<Stack direction="row" spacing={1.5} alignItems="center">
                                                                    <Box
                                                                        sx={{
                                                                            p: 1,
                                                                            borderRadius: 1.5,
                                                                            background: 'linear-gradient(45deg, #9333ea, #7c3aed)',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                    >
                                                                        {getMeasurementIcon(key)}
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="caption" sx={{ color: '#7c2d92', fontWeight: 600, textTransform: 'capitalize' }}>
                                                                            {key}
                                                                        </Typography>
                                                                        <Typography variant="body1" sx={{ color: '#581c87', fontWeight: 700 }}>
                                                                            {value}cm
                                                                        </Typography>
                                                                    </Box>
                                                                </Stack>
                                                            </Paper>
                                                        </Grid>
                                                    ))}
                                                </Grid>

                                                {/* Notes */}
                                                {progress.notes && (
                                                    <>
                                                        <Typography 
                                                            variant="subtitle1" 
                                                            gutterBottom
                                                            sx={{ 
                                                                fontWeight: 600,
                                                                color: '#374151',
                                                                mb: 2,
                                                                mt: 2
                                                            }}
                                                        >
                                                            Notes
                                                        </Typography>
                                                        <Paper 
                                                            sx={{ 
                                                                p: 2,
                                                                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                                                borderRadius: 2,
                                                                border: '1px solid rgba(245, 158, 11, 0.2)'
                                                            }}
                                                        >
                                                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                                <Box
                                                                    sx={{
                                                                        p: 1,
                                                                        borderRadius: 1,
                                                                        background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        mt: 0.5
                                                                    }}
                                                                >
                                                                    <Notes sx={{ color: 'white', fontSize: 16 }} />
                                                                </Box>
                                                                <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 500, lineHeight: 1.6 }}>
                                                                    {progress.notes}
                                                                </Typography>
                                                            </Stack>
                                                        </Paper>
                                                    </>
                                                )}

                                                {/* Photos */}
                                                {progress.photos?.length > 0 && (
                                                    <>
                                                        <Typography 
                                                            variant="subtitle1" 
                                                            gutterBottom
                                                            sx={{ 
                                                                fontWeight: 600,
                                                                color: '#374151',
                                                                mb: 2,
                                                                mt: 3,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1
                                                            }}
                                                        >
                                                            <PhotoCamera sx={{ color: '#667eea', fontSize: 20 }} />
                                                            Progress Photos
                                                        </Typography>
                                                        <Paper 
                                                            sx={{ 
                                                                p: 2,
                                                                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                                                borderRadius: 2,
                                                                border: '1px solid rgba(34, 197, 94, 0.2)'
                                                            }}
                                                        >
                                                            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                                                                {progress.photos.map((photo, idx) => (
                                                                    <Box
                                                                        key={idx}
                                                                        component="img"
                                                                        src={`${host}${photo}`}
                                                                        sx={{
                                                                            width: 80,
                                                                            height: 80,
                                                                            borderRadius: 2,
                                                                            objectFit: 'cover',
                                                                            border: '2px solid rgba(34, 197, 94, 0.3)',
                                                                            transition: 'transform 0.2s ease',
                                                                            cursor: 'pointer',
                                                                            '&:hover': {
                                                                                transform: 'scale(1.05)'
                                                                            }
                                                                        }}
                                                                    />
                                                                ))}
                                                            </Stack>
                                                        </Paper>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ClientProgress;