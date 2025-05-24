import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { config } from "../Config/Config";
import { useNavigate } from "react-router-dom";

export const NutritionistContext = createContext();

export default function NutritionistContextProvider({ children }) {
  const { host } = config;
  const [nutritionist, setNutritionist] = useState(null);
  const [state, setState] = useState(false);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("nutritionistToken");
    if (token) {
      setNutritionist({ token });
    }
  }, [state]);

  const LoginNutritionist = (data) => {
    axios
      .post(`${host}/nutritionist/login`, data)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("nutritionistToken", res.data.token);
          setState(!state);
          Swal.fire("Success", "You will be redirected to the dashboard", "success");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      })
      .catch((err) => {
        Swal.fire(
          "Error Login Failed", 
          err.response?.data?.message || "Check Your Login Details", 
          "error"
        );
      });
  };

  const LogoutNutritionist = () => {
    localStorage.removeItem("nutritionistToken");
    setNutritionist(null);
    setState(!state);
    navigate("/login");
  };

  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${host}/nutritionist/profile`,
        formData,
        {
          headers: {
            'auth-token': token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Profile updated successfully', 'success');
        setState(!state);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${host}/nutritionist/change-password`,
        passwordData,
        {
          headers: {
            'auth-token': token
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Password changed successfully', 'success');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getAssignedClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${host}/nutritionist/clients`, {
        headers: {
          'auth-token': token
        }
      });

      if (response.data.success) {
        setClients(response.data.clients);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'An error occurred');
      setClients([]);
      
      if (err.response?.status === 401) {
        Swal.fire('Error', 'Please login to continue', 'error');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConsultancyRequest = async (requestId, status, responseMessage) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${host}/nutritionist/consultancy-request/${requestId}`,
        { status, responseMessage },
        {
          headers: {
            'auth-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', `Request ${status} successfully`, 'success');
        return response.data.request;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error handling request:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to handle request', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (requestId) => {
      try{
        setLoading(true);
        const token = localStorage.getItem("nutritionistToken");
        if (!token) throw new Error("No authentication token found");
  
        const response = await axios.delete(
          `${host}/nutritionist/consultancy-request/${requestId}`,
          {
            headers: {
              'auth-token': token
            }
          }
        );
  
        if (response.data.success) {
          Swal.fire('Success', response.data.message, 'success');
          return true;
        } else {
          throw new Error(response.data.message || 'Failed to delete request');
        }
      } catch (err) {
        console.error('Error deleting request:', err);
        Swal.fire('Error', err.response?.data?.message || 'Failed to delete request', 'error');
        throw err;
      } finally {
        setLoading(false);
      }
  };


  const createMealPlan = async (mealPlanData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${host}/nutritionist/meal-plan`,
        mealPlanData,
        {
          headers: {
            'auth-token': token
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Meal plan created successfully', 'success');
        return response.data.mealPlan;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error creating meal plan:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to create meal plan', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");
  
      const response = await axios.get(
        `${host}/nutritionist/requests`,
        {
          headers: {
            'auth-token': token
          }
        }
      );
  
      if (response.data.success) {
        return response.data.requests;
      } else {
        throw new Error(response.data.message || 'Failed to fetch requests');
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMealPlanRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${host}/nutritionist/mealplan-requests`,
        {
          headers: {
            'auth-token': token
          }
        }
      );

      if (response.data.success) {
        return response.data.requests;
      } else {
        throw new Error(response.data.message || 'Failed to fetch meal plan requests');
      }
    } catch (err) {
      console.error('Error fetching meal plan requests:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add new function for single meal plan request
  const getSingleMealPlanRequest = async (requestId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${host}/nutritionist/mealplan-requests/${requestId}`,
        {
          headers: {
            'auth-token': token
          }
        }
      );

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch meal plan request');
      }
    } catch (err) {
      console.error('Error fetching meal plan request:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitMealPlan = async (mealPlanData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(`${host}/nutritionist/submit-meal-plan`, mealPlanData, {
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        Swal.fire('Success', 'Meal plan saved successfully', 'success');
        return true; // Indicate success
      } else {
        throw new Error(response.data.message || 'Failed to save meal plan');
      }
    } catch (error) {
      console.error("Error submitting meal plan:", error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save meal plan', 'error');
      throw error; // Re-throw to be caught by the component
    } finally {
      setLoading(false);
    }
  };

  //new function

  const getNutritionistMealPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${host}/nutritionist/nutritionist-meal-plans`,
        {
          headers: {
            'auth-token': token
          }
        }
      );

      if (response.data.success) {
        return response.data.mealPlans;
      } else {
        throw new Error(response.data.message || 'Failed to fetch meal plans');
      }
    } catch (err) {
      console.error('Error fetching meal plans:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSingleNutritionistMealPlan = async (mealPlanId) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("nutritionistToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
            `${host}/nutritionist/nutritionist-meal-plans/${mealPlanId}`,
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success && response.data.mealPlan) {
            return response.data.mealPlan;
        } else {
            throw new Error(response.data.message || 'Failed to fetch meal plan');
        }
    } catch (err) {
        console.error('Error fetching meal plan:', err);
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        throw new Error(errorMessage);
    } finally {
        setLoading(false);
    }
};
/** 
* Paste one or more documents here
*/

  const updateNutritionistMealPlan = async (mealPlanId, mealPlanData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${host}/nutritionist/nutritionist-meal-plans/${mealPlanId}`,
        mealPlanData,
        {
          headers: {
            'auth-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Meal plan updated successfully', 'success');
        return response.data.mealPlan;
      } else {
        throw new Error(response.data.message || 'Failed to update meal plan');
      }
    } catch (err) {
      console.error('Error updating meal plan:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to update meal plan', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNutritionistMealPlan = async (mealPlanId) => {
      try {
          setLoading(true);
          const token = localStorage.getItem("nutritionistToken");
          if (!token) throw new Error("No authentication token found");
  
          const response = await axios.delete(
              `${host}/nutritionist/nutritionist-meal-plans/${mealPlanId}`,
              {
                  headers: {
                      'auth-token': token
                  }
              }
          );
  
          if (response.data.success) {
              return response.data; // Ensure this is returned
          } else {
              throw new Error(response.data.message || 'Failed to delete meal plan');
          }
      } catch (err) {
          console.error('Error deleting meal plan:', err);
          throw err;
      } finally {
          setLoading(false);
      }
  };

  const updateMealPlanStatus = async (mealPlanId, status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nutritionistToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${host}/nutritionist/meal-plans/${mealPlanId}/status`,
        { status },
        {
          headers: {
            'auth-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', `Meal plan status updated to ${status}`, 'success');
        return response.data.mealPlan;
      } else {
        throw new Error(response.data.message || 'Failed to update meal plan status');
      }
    } catch (err) {
      console.error('Error updating meal plan status:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to update meal plan status', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getClientProgress = async (clientId) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("nutritionistToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
            `${host}/nutritionist/client-progress/${clientId}`,
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success) {
            return response.data.progress;
        } else {
            throw new Error(response.data.message || 'Failed to fetch progress history');
        }
    } catch (err) {
        console.error('Error fetching client progress:', err);
        Swal.fire('Error', err.response?.data?.message || 'Failed to fetch progress history', 'error');
        return [];
    } finally {
        setLoading(false);
    }
};

  // Add this new function in the NutritionistContextProvider
  const getProgressByMealPlanRequest = async (requestId) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("nutritionistToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
            `${host}/nutritionist/meal-plan-progress/${requestId}`,
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success) {
            return {
                progress: response.data.progress,
                clientDetails: response.data.clientDetails,
                mealPlanDetails: response.data.mealPlanDetails
            };
        } else {
            throw new Error(response.data.message || 'Failed to fetch progress history');
        }
    } catch (err) {
        console.error('Error fetching progress:', err);
        Swal.fire('Error', err.response?.data?.message || 'Failed to fetch progress history', 'error');
        return null;
    } finally {
        setLoading(false);
    }
};

  const getNutritionistFeedbacks = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem("nutritionistToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
            `${host}/nutritionist/feedbacks`,
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success) {
            return response.data.feedbacks;
        } else {
            throw new Error(response.data.message || 'Failed to fetch feedbacks');
        }
    } catch (err) {
        console.error('Error fetching feedbacks:', err);
        Swal.fire('Error', err.response?.data?.message || 'Failed to fetch feedbacks', 'error');
        return [];
    } finally {
        setLoading(false);
    }
};

  const getNutritionistPayments = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem("nutritionistToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
            `${host}/nutritionist/payments`,
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success) {
            return response.data.payments;
        } else {
            throw new Error(response.data.message || 'Failed to fetch payments');
        }
    } catch (err) {
        console.error('Error fetching payments:', err);
        Swal.fire('Error', err.response?.data?.message || 'Failed to fetch payments', 'error');
        return [];
    } finally {
        setLoading(false);
    }
};

  return (
    <NutritionistContext.Provider
      value={{
        LoginNutritionist,
        LogoutNutritionist,
        nutritionist,
        setNutritionist,
        state,
        setState,
        updateProfile,
        changePassword,
        getAssignedClients,
        handleConsultancyRequest,
        createMealPlan,
        getRequests,
        clients,
        loading,
        error,
        setLoading,
        setError,
        getMealPlanRequests,
        getSingleMealPlanRequest,
        deleteRequest,
        submitMealPlan,
        getNutritionistMealPlans,
        getSingleNutritionistMealPlan,
        updateNutritionistMealPlan,
        deleteNutritionistMealPlan,
        updateMealPlanStatus,
        getClientProgress,
        getProgressByMealPlanRequest,
        getNutritionistFeedbacks,
        getNutritionistPayments
      }}
    >
      {children}
    </NutritionistContext.Provider>
  );
}