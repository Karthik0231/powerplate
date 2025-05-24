import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { config } from "../Config/Config";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();

export default function AdminContextProvider({ children }) {
  const { host } = config;
  const [admin, setAdmin] = useState(null);
  const [state, setState] = useState(false);
  const [nutritionists, setNutritionists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Check if admin is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      // You could add token verification here if needed
      setAdmin({ token });
    }
  }, [state]);

  const LoginAdmin = (data) => {
    axios
      .post(`${host}/admin/login`, data)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("adminToken", res.data.token);
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

  const LogoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
    setState(!state);
    navigate("/login");
  };

  const viewNutritionists = async () => {
    try {
      console.log('Fetching nutritionists...');
      setLoading(true);
      setError(null); // Reset error state
      
      const token = localStorage.getItem("adminToken");
      console.log('Token:', token);
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const response = await axios.get(`${host}/admin/nutritionists`, {
        headers: {
          'auth-token': token
        },
      });
      
      console.log('Response:', response.data);
      
      if (response.data.success) {
        setNutritionists(response.data.nutritionists);
        console.log('Nutritionists set:', response.data.nutritionists);
      } else {
        // Handle case where success is false
        setError(response.data.message || 'Failed to fetch nutritionists');
        setNutritionists([]);
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'An error occurred');
      setNutritionists([]); // Reset nutritionists to empty array on error
      
      console.error('Error fetching nutritionists:', err);
      
      if (err.response?.status === 401) {
        Swal.fire('Error', 'Please login to continue', 'error');
        navigate('/login');
      } else {
        Swal.fire('Error', err.message || 'An error occurred', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const addNutritionist = async (formData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${host}/admin/addNutritionist`,
        formData,
        {
          headers: {
            'auth-token': token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Nutritionist added successfully', 'success');
        setState(!state);
        navigate('/nutritionists');
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (err) {
      console.error('Error adding nutritionist:', err);
      Swal.fire(
        'Error',
        err.response?.data?.message || 'Failed to add nutritionist',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteNutritionist = async (nutritionistId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `${host}/admin/nutritionist/${nutritionistId}`,
        {
          headers: {
            'auth-token': token
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Nutritionist deleted successfully', 'success');
        setState(!state); // Trigger a state change to refresh data
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (err) {
      console.error('Error deleting nutritionist:', err);
      Swal.fire(
        'Error',
        err.response?.data?.message || 'Failed to delete nutritionist',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateNutritionistStatus = async (nutritionistId, newStatus) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${host}/admin/nutritionist/${nutritionistId}/status`,
        { status: newStatus },
        {
          headers: {
            'auth-token': token
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Nutritionist status updated successfully', 'success');
        setState(!state); // Trigger a state change to refresh data
      } else {
        Swal.fire('Error', response.data.message, 'error');
      }
    } catch (err) {
      console.error('Error updating nutritionist status:', err);
      Swal.fire(
        'Error',
        err.response?.data?.message || 'Failed to update nutritionist status',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const viewPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${host}/admin/payments`, {
        headers: {
          'auth-token': token
        }
      });

      if (response.data.success) {
        return response.data.payments;
      } else {
        throw new Error(response.data.message || 'Failed to fetch payments');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      Swal.fire('Error', err.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId, status) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.put(
            `${host}/admin/payments/${paymentId}/status`,
            { status },
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success) {
            return true;
        } else {
            throw new Error(response.data.message || 'Failed to update payment status');
        }
    } catch (err) {
        console.error('Error updating payment status:', err);
        throw err;
    } finally {
        setLoading(false);
    }
};

const viewUsers = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
            `${host}/admin/users`,
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success) {
            return response.data.users;
        } else {
            throw new Error(response.data.message || 'Failed to fetch users');
        }
    } catch (err) {
        console.error('Error fetching users:', err);
        Swal.fire('Error', err.message || 'An error occurred', 'error');
        return [];
    } finally {
        setLoading(false);
    }
};

const deleteUser = async (userId) => {
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.delete(
            `${host}/admin/user/${userId}`,
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success) {
            Swal.fire('Success', 'User deleted successfully', 'success');
            return true;
        } else {
            throw new Error(response.data.message || 'Failed to delete user');
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        Swal.fire('Error', err.message || 'Failed to delete user', 'error');
        return false;
    }
};

const viewFeedbacks = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
            `${host}/admin/feedbacks`,
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
        Swal.fire('Error', err.message || 'An error occurred', 'error');
        return [];
    } finally {
        setLoading(false);
    }
};

const deleteFeedback = async (feedbackId) => {
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.delete(
            `${host}/admin/feedback/${feedbackId}`,
            {
                headers: {
                    'auth-token': token
                }
            }
        );

        if (response.data.success) {
            Swal.fire('Success', 'Feedback deleted successfully', 'success');
            return true;
        } else {
            throw new Error(response.data.message || 'Failed to delete feedback');
        }
    } catch (err) {
        console.error('Error deleting feedback:', err);
        Swal.fire('Error', err.message || 'Failed to delete feedback', 'error');
        return false;
    }
};

  return (
    <AdminContext.Provider
      value={{
        LoginAdmin,
        admin,
        setAdmin,
        state,
        setState,
        LogoutAdmin,
        viewNutritionists,
        nutritionists,
        setNutritionists,
        loading,
        error,
        addNutritionist,
        setLoading,
        setError,
        deleteNutritionist,
        updateNutritionistStatus,
        viewPayments,
        updatePaymentStatus,
        viewUsers,
        deleteUser,
        viewFeedbacks,
        deleteFeedback
        
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}