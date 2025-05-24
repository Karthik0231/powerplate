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
  Divider,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { PhotoCamera, ArrowBack, Language, LinkedIn, Instagram } from '@mui/icons-material';
import { AdminContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Diet types that nutritionists might specialize in
const dietTypes = [
  'Ketogenic',
  'Paleo',
  'Vegan',
  'Vegetarian',
  'Mediterranean',
  'Low-FODMAP',
  'Gluten-Free',
  'Dairy-Free',
  'Intermittent Fasting',
  'DASH',
  'Low-Carb',
  'Plant-Based',
  'Weight Management',
  'Sports Nutrition',
  'Prenatal Nutrition',
  'Pediatric Nutrition',
  'Geriatric Nutrition',
];

// Health conditions that nutritionists might specialize in
const healthConditions = [
  'Diabetes',
  'Heart Disease',
  'Hypertension',
  'Obesity',
  'Eating Disorders',
  'IBS/IBD',
  'Celiac Disease',
  'Food Allergies',
  'Autoimmune Disorders',
  'PCOS',
  'Thyroid Disorders',
  'Kidney Disease',
  'Cancer Support',
  'Metabolic Syndrome',
  'Digestive Health',
];

const AddNutritionist = () => {
  const navigate = useNavigate();
  const { addNutritionist, loading } = useContext(AdminContext);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Professional Information
    qualification: '',
    specializedDegrees: '',
    certifications: '',
    experience: '',
    specialization: '',
    dietTypesHandled: [], // Ensure this is initialized as an array
    healthConditionsHandled: [], // Ensure this is initialized as an array
    languages: '',
    
    // Practice Details
    officeHours: '',
    
    // Social Media and Online Presence
    website: '',
    linkedIn: '',
    instagram: '',
    
    // Additional Details
    bio: '',
    status: 'active'
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create new FormData object
      const formDataObj = new FormData();
      formDataObj.append('profileImage', file);
      setPreviewImage(URL.createObjectURL(file));
      
      // Add all other form fields to the FormData object
      Object.keys(formData).forEach(key => {
        // Special handling for array values
        if (Array.isArray(formData[key])) {
          // For empty arrays, append an empty string with '[]' to indicate it's an array
          if (formData[key].length === 0) {
            formDataObj.append(`${key}[]`, '');
          } else {
            // For non-empty arrays, append each value with the '[]' notation
            formData[key].forEach(item => {
              formDataObj.append(`${key}[]`, item);
            });
          }
        } else {
          // For non-array values, append normally
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Update form data with the file and all other fields
      setFormData(prevData => ({
        ...prevData,
        profileImage: file
      }));
    }
  };

  const handleMultiSelectChange = (event, fieldName) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      [fieldName]: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a FormData object for submission
    const submitData = new FormData();
    
    // If there's a profile image file, append it
    if (formData.profileImage) {
      submitData.append('profileImage', formData.profileImage);
    }
    
    // Append all other form fields
    Object.keys(formData).forEach(key => {
      if (key !== 'profileImage') {
        // Special handling for arrays
        if (Array.isArray(formData[key])) {
          if (formData[key].length === 0) {
            submitData.append(`${key}[]`, '');
          } else {
            formData[key].forEach(item => {
              submitData.append(`${key}[]`, item);
            });
          }
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });
    
    await addNutritionist(submitData);
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
                  required
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

            {/* Section: Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="success" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  label="Gender"
                  required
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State/Province"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ZIP/Postal Code"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </Grid>

            {/* Section: Professional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="orange" gutterBottom sx={{ mt: 2 }}>
                Professional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Primary Qualification"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                required
                placeholder="e.g., BSc Nutrition, Registered Dietitian"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Specialized Degrees"
                value={formData.specializedDegrees}
                onChange={(e) => setFormData({ ...formData, specializedDegrees: e.target.value })}
                placeholder="e.g., MS in Sports Nutrition"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Certifications"
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                placeholder="e.g., Certified Diabetes Educator"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (in years)"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
                placeholder="e.g., Weight Management, Sports Nutrition"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="diet-types-label">Diet Types Handled</InputLabel>
                <Select
                  labelId="diet-types-label"
                  multiple
                  value={formData.dietTypesHandled || []} // Ensure it's always an array
                  onChange={(e) => handleMultiSelectChange(e, 'dietTypesHandled')}
                  input={<OutlinedInput id="select-diet-types" label="Diet Types Handled" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {dietTypes.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="health-conditions-label">Health Conditions Handled</InputLabel>
                <Select
                  labelId="health-conditions-label"
                  multiple
                  value={formData.healthConditionsHandled || []} // Ensure it's always an array
                  onChange={(e) => handleMultiSelectChange(e, 'healthConditionsHandled')}
                  input={<OutlinedInput id="select-health-conditions" label="Health Conditions Handled" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {healthConditions.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Languages Spoken"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                placeholder="e.g., English, Spanish, Hindi"
                required
              />
            </Grid>

            {/* Section: Practice Details */}
            <Grid item xs={12}>
              <Typography variant="h6" color="orange" gutterBottom sx={{ mt: 2 }}>
                Practice Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Consultation Fee"
                type="number"
                value={formData.consultationFee}
                required
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid> */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Office Hours"
                value={formData.officeHours}
                onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                placeholder="e.g., Mon-Fri 9AM-5PM"
                required
              />
            </Grid>

            {/* Section: Social Media and Online Presence */}
            <Grid item xs={12}>
              <Typography variant="h6" color="orange" gutterBottom sx={{ mt: 2 }}>
                Online Presence
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                required
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Language />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn"
                required
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkedIn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram"
                required
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Instagram />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Section: Additional Details */}
            <Grid item xs={12}>
              <Typography variant="h6" color="orange" gutterBottom sx={{ mt: 2 }}>
                Additional Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                multiline
                rows={4}
                placeholder="Professional background, approach to nutrition, etc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
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