import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { config } from "../Config/Config";
import { useNavigate } from "react-router-dom";

export const userContext = createContext();

export default function UserContextProvider(props) {
    const { host } = config;
    const [user, setUser] = useState({});
    const [state, setState] = useState(false);
    const [nutritionists, setNutritionists] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [mealPlans, setMealPlans] = useState([]);
    const [progress, setProgress] = useState([]);
    const [consultancyRequests, setConsultancyRequests] = useState([]);
    const [consultancyHistory, setConsultancyHistory] = useState([]);

    const navigate = useNavigate();

    // Check if user is logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            // You could add token verification here if needed
            setUser({ token });
        }
    }, [state]);

    const LoginUser = (data) => {
        axios.post(`${host}/customer/login`, data)
            .then((res) => {
                if (res.data.success) {
                    localStorage.setItem("userToken", res.data.token);
                    setState(!state);
                    setUser(res.data.user);
                    Swal.fire("Success", "You will be redirected to the Home", "success");
                    setTimeout(() => {
                        navigate("/home");
                    }, 1000);
                } else {
                    Swal.fire("Error", res.data.message, "error");
                }
            })
            .catch((err) => {
                Swal.fire("Error Login Failed", err.response?.data?.message || "Check Your Login Details", "error");
            });
    };

    const RegisterUser = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("phone", data.phone);
        formData.append("gender", data.gender);
        formData.append("profile", data.profile[0]);
        formData.append("age", data.age);
        formData.append("weight", data.weight);
        formData.append("height", data.height);

        axios.post(`${host}/customer/Register`, formData)
        .then((res) =>
            {
                if (res.data.success) {
                    Swal.fire("Success", "You will be redirected to the Home", "success");
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                } else {
                    Swal.fire( res.data.message, "Success");
                }
            })
        .catch((err) => {
            Swal.fire("Error Registration Failed", err.response?.data?.message || "Check Your Registration Details", "error");
        });
    };

    const LogoutUser = () => {
        localStorage.removeItem("userToken");
        setUser({});
        setState(!state);
        Swal.fire("Success", "You will be redirected to the Home", "success");
        setTimeout(() => {
            navigate("/home");
        }, 1000);
    }

    const getUserProfile = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                throw new Error("No authentication token found");
            }
            const response = await axios.get(`${host}/customer/viewCustomer`, {
                headers: {
                    'auth-token': token
                },
            });
            if (response.data.success) {
                setUserData(response.data.user);
                setUserId(response.data.user._id);
            } else {
                throw new Error("Failed to fetch user profile");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const getNutritionists = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                throw new Error("No authentication token found");
            }
            const response = await axios.get(`${host}/customer/getNutritionists`, {
                headers: {
                    'auth-token': token
                },
            });
            if (response.data.success) {
                setNutritionists(response.data.nutritionists);
            } else {
                throw new Error("Failed to fetch nutritionists");
            }
        } catch (error) {
            console.error("Error fetching nutritionists:", error);
        }
    };

    const getNutritionistProfile = async (id) => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await axios.get(`${host}/customer/nutritionist/${id}`, {
                headers: { 'auth-token': token }
            });
            return response.data.nutritionist;
        } catch (error) {
            console.error("Error fetching nutritionist profile:", error);
            return null;
        }
    };

    const requestConsultancy = async (nutritionistId, message, problem) => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await axios.post(
                `${host}/customer/request-consultancy`,
                { nutritionistId, message, problem },
                { headers: { 'auth-token': token } }
            );
            if (response.data.success) {
                Swal.fire("Success", "Consultancy request sent successfully", "success");
            }
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Failed to send consultancy request", "error");
        }
    };

    const viewConsultancyHistory = async () => {
        try{
            const token = localStorage.getItem("userToken");
            const response = await axios.get(`${host}/customer/consultancy-history`, {
                headers: { 'auth-token': token }                
            });
            if (response.data.success) {
                // Update this line to use the correct property name from the response
                setConsultancyHistory(response.data.requests);  // Changed from response.data.consultancyHistory
            }
        } catch (error) {
            console.error("Error fetching consultancy history:", error);
            Swal.fire("Error", "Failed to fetch consultancy history", "error");
        }
    }

    // Update the progress-related functions in Context
    const updateProgress = async (planId, formData) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) throw new Error("No authentication token found");

            const response = await axios.post(
                `${host}/customer/progress/${planId}`,
                formData,
                {
                    headers: {
                        'auth-token': token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                Swal.fire('Success', 'Progress updated successfully', 'success');
                return true;
            }
            throw new Error(response.data.message || 'Failed to update progress');
        } catch (error) {
            console.error('Error updating progress:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to update progress', 'error');
            return false;
        }
    };

    const getProgressHistory = async (planId) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) throw new Error("No authentication token found");

            const response = await axios.get(
                `${host}/customer/progress/${planId}`,
                {
                    headers: {
                        'auth-token': token
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error fetching progress:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to fetch progress history', 'error');
            return null;
        }
    };

    const getMealPlans = async () => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await axios.get(`${host}/customer/meal-plan-requests`, {
                headers: { 'auth-token': token }
            });
            if (response.data.success) {
                setMealPlans(response.data.mealPlans);
                console.log(response.data.mealPlans);
            }
        } catch (error) {
            console.error("Error fetching meal plans:", error);
            Swal.fire("Error", "Failed to fetch meal plans", "error");
        }
    };

    const submitFeedback = async (feedbackData) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) throw new Error("No authentication token found");

            const response = await axios.post(
                `${host}/customer/submit-feedback`,
                feedbackData,
                {
                    headers: {
                        'auth-token': token
                    }
                }
            );

            if (response.data.success) {
                Swal.fire('Success', 'Feedback submitted successfully', 'success');
                return true;
            }
            throw new Error(response.data.message || 'Failed to submit feedback');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to submit feedback', 'error');
            return false;
        }
    };

// Update the applyForMealPlan function in your UserContextProvider.js
const applyForMealPlan = async (nutritionistId, formData) => {
    try {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("No authentication token found");

        // The request should be sent to the correct endpoint with the nutritionistId as a parameter
        const response = await axios.post(
            `${host}/customer/apply-for-meal-plan/${nutritionistId}`,
            formData, // Send the form data directly as received from the component
            {
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            Swal.fire('Success', 'Meal plan application submitted successfully', 'success');
            return true;
        } else {
            throw new Error(response.data.message || 'Failed to submit meal plan application');
        }
    } catch (error) {
        console.error('Error applying for meal plan:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to apply for meal plan', 'error');
        return false;
    }
};

    // Add these to the context provider value
    const getUserRequests = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                throw new Error("No authentication token found");
            }
            const response = await axios.get(`${host}/customer/meal-plan-requests`, {
                headers: {
                    'auth-token': token
                },
            });
            if (response.data.success) {
                setConsultancyRequests(response.data.mealPlanRequests); // Updated to match the backend response
            } else {
                throw new Error("Failed to fetch meal plan requests");
            }
        } catch (error) {
            console.error("Error fetching user requests:", error);
            Swal.fire("Error", "Failed to fetch meal plan requests", "error");
        }
    };

// Add this function inside UserContextProvider
const verifyPayment = async (requestId, referenceId) => {
    try {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.post(
            `${host}/customer/verify-payment`,
            { requestId, referenceId },
            {
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Payment verification failed');
        }

        Swal.fire('Success', 'Payment verification submitted successfully', 'success');
        getUserRequests(); // Refresh the requests list
        return true;
    } catch (error) {
        console.error('Error verifying payment:', error);
        Swal.fire({
            icon: 'error',
            title: 'Payment Error',
            text: error.response?.data?.message || error.message || 'Failed to verify payment'
        });
        return false;
    }
};

// Replace the commented out getMealPlanById with this implementation
const getMealPlanById = async (requestId) => {
    try {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
            `${host}/customer/meal-plan-data/${requestId}`,
            {
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch meal plan');
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to fetch meal plan', 'error');
        return null;
    }
};

// Add this function inside UserContextProvider
const getProfile = async () => {
    try {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
            `${host}/customer/profile`,
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success) {
            setUserData(response.data.customer);
            return response.data.customer;
        }
        throw new Error(response.data.message || 'Failed to fetch profile');
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

    // Add this function inside UserContextProvider
    const updateProfile = async (formData) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) throw new Error("No authentication token found");

            const response = await axios.put(
                `${host}/customer/update-profile`,
                formData,
                {
                    headers: {
                        'auth-token': token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                setUserData(response.data.customer);
                Swal.fire('Success', 'Profile updated successfully', 'success');
                return true;
            }
            throw new Error(response.data.message || 'Failed to update profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to update profile', 'error');
            return false;
        }
    };

    return (
        <userContext.Provider
            value={{
                user,
                LoginUser,
                RegisterUser,
                LogoutUser,
                getUserProfile,
                getNutritionists,
                nutritionists,
                userData,
                userId,
                error,
                loading,
                getNutritionistProfile,
                requestConsultancy,
                updateProgress,
                mealPlans,
                progress,
                consultancyRequests,
                getProgressHistory,
                getMealPlans,
                submitFeedback,
                state,
                setState,   
                setNutritionists,
                setUserData,
                setUserId,
                setError,
                viewConsultancyHistory,
                consultancyHistory,
                setConsultancyHistory,
                applyForMealPlan,
                getUserRequests,
                verifyPayment,
                getMealPlanById,
                getProfile,
                updateProfile,
            }}
        >
            {props.children}
        </userContext.Provider>
    );
};
