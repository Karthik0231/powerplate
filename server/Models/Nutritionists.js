const mongoose = require('mongoose');

const NutritionistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  },
  dateOfBirth: {
    type: Date,
  },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  qualification: {
    type: String,
    required: true,
    trim: true,
  },
  specializedDegrees: {
    type: String,
    trim: true,
  },
  certifications: {
    type: String,
    trim: true,
  },
  experience: {
    type: String, // you can use Number if storing just years
    required: true,
  },
  specialization: {
    type: String,
    default: 'General',
  },
  dietTypesHandled: {
    type: [String],
  },
  healthConditionsHandled: {
    type: [String],
  },
  languages: {
    type: String,
    trim: true,
  },
  consultationFee: {
    type: Number,
    min: 0,
  },
  officeHours: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  linkedIn: {
    type: String,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Nutritionist', NutritionistSchema);