import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import NutritionistList from './Pages/NutritionistList'
import Context from './Context/Context'
import ProtectedRoute from './components/ProtectedRoute'
import AboutUs from './Pages/About'
import NutritionistProfile from './Pages/NutritionistProfile'
import RequestHistory from './Pages/RequestHistory'
import ApplyMealPlan from './Pages/ApplyMealPlan'
import UserRequests from './Pages/UserRequests'
import MealPlanView from './Pages/MealPlanView'
import ProgressTracking from './Pages/ProgressTracking'
import Profile from './Pages/Profile'
import Feedback from './Pages/Feedback'


function App() {
  return (
    <Router>
      <Context>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Protected Routes */}
          <Route path="/apply-meal-plan/:nutritionistId" element={
            <ProtectedRoute>
              <ApplyMealPlan />
            </ProtectedRoute>
          } />
          <Route path="/nutritionists" element={
            <ProtectedRoute>
              <NutritionistList />
            </ProtectedRoute>
          } />
          <Route path="/nutritionist/:id" element={
            <ProtectedRoute>
              <NutritionistProfile />
            </ProtectedRoute>
          } />
          {/* Add other protected routes here */}
          <Route path="/request-status" element={
            <ProtectedRoute>
              <RequestHistory />
            </ProtectedRoute>
          } />
          <Route path="/meal-plans" element={
            <ProtectedRoute>
              <UserRequests />
            </ProtectedRoute>
          } />
          <Route path="/meal-plan/:requestId" element={
            <ProtectedRoute>
              <MealPlanView />
            </ProtectedRoute>
          } />
          <Route path="/progress/:requestId" element={
            <ProtectedRoute>
              <ProgressTracking />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />
          {/* Add other protected routes here */}
        </Routes>
      </Context>
    </Router>
  );
}

export default App;
