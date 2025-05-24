import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Grid,
  IconButton,
  Avatar,
  MenuItem,
} from '@mui/material';
import { PhotoCamera, ArrowBack } from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';

const AddNutritionist = () => {
  const navigate = useNavigate();
  const { addNutritionist, loading } = useContext(AdminContext);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    qualification: '',
    experience: '',
    specialization: '',
    status: 'active'
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataObj = new FormData();
      formDataObj.append('profileImage', file);
      setPreviewImage(URL.createObjectURL(file));
      
      // Update form data with the file
      Object.keys(formData).forEach(key => {
        formDataObj.append(key, formData[key]);
      });
      setFormData(formDataObj);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addNutritionist(formData);
  };

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/nutritionists')}
            sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Add New Nutritionist
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Profile Image Upload */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={previewImage || '/default-avatar.png'}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <input
                  accept="image/*"
                  type="file"
                  id="icon-button-file"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: -10,
                      bgcolor: 'white',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Qualification"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (in years)"
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </TextField>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #1976d2 30%, #64b5f6 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Adding...' : 'Add Nutritionist'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddNutritionist;