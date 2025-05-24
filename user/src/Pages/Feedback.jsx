import React, { useState, useContext, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Rating,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Alert,
    Snackbar,
    Fade
} from '@mui/material';
import { userContext } from '../Context/Context';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Banner from '../components/Banner';
import bgimage from '../assets/banner.png';

const Feedback = () => {
    const { submitFeedback, getNutritionists, nutritionists } = useContext(userContext);
    const [formData, setFormData] = useState({
        nutritionistId: '',
        rating: 0,
        comment: ''
    });
    const [message, setMessage] = useState({ show: false, text: '', type: 'success' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNutritionists();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await submitFeedback(formData);
            if (success) {
                setFormData({
                    nutritionistId: '',
                    rating: 0,
                    comment: ''
                });
                setMessage({
                    show: true,
                    text: 'Feedback submitted successfully',
                    type: 'success'
                });
            }
        } catch (error) {
            setMessage({
                show: true,
                text: 'Failed to submit feedback',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pt: '64px' }}>
            <Header />
            
            <Banner
                title="Rate Your Nutritionist"
                subtitle="Help us improve our service by providing valuable feedback"
                backgroundImage={bgimage}
                height="300px"
            />

            <Container maxWidth="md" sx={{ py: 6 }}>
                <Fade in timeout={1000}>
                    <Paper elevation={0} sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                            Submit Your Feedback
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Nutritionist</InputLabel>
                                    <Select
                                        value={formData.nutritionistId}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            nutritionistId: e.target.value
                                        }))}
                                        required
                                        label="Select Nutritionist"
                                    >
                                        {nutritionists.map((nutritionist) => (
                                            <MenuItem key={nutritionist._id} value={nutritionist._id}>
                                                Dr. {nutritionist.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Box>
                                    <Typography component="legend" sx={{ mb: 1 }}>
                                        Rating
                                    </Typography>
                                    <Rating
                                        value={formData.rating}
                                        onChange={(_, newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                rating: newValue
                                            }));
                                        }}
                                        size="large"
                                        precision={0.5}
                                        required
                                    />
                                </Box>

                                <TextField
                                    multiline
                                    rows={4}
                                    label="Your Feedback"
                                    value={formData.comment}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        comment: e.target.value
                                    }))}
                                    placeholder="Share your experience with the nutritionist..."
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading || !formData.nutritionistId || !formData.rating}
                                    sx={{
                                        py: 1.5,
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)'
                                        }
                                    }}
                                >
                                    {loading ? 'Submitting...' : 'Submit Feedback'}
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Fade>
            </Container>

            <Snackbar
                open={message.show}
                autoHideDuration={6000}
                onClose={() => setMessage({ ...message, show: false })}
            >
                <Alert severity={message.type} onClose={() => setMessage({ ...message, show: false })}>
                    {message.text}
                </Alert>
            </Snackbar>

            <Footer />
        </Box>
    );
};

export default Feedback;