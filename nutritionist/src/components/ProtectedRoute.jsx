import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NutritionistContext } from '../Context/Context';

const ProtectedRoute = ({ children }) => {
  const { nutritionist, setNutritionist } = useContext(NutritionistContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('nutritionistToken');
    
    if (!nutritionist && token) {
      // If there's a token but no nutritionist in context, set the nutritionist
      setNutritionist(token);
    } else if (!nutritionist && !token) {
      // Redirect to login if there's no nutritionist AND no token
      navigate('/login');
    }
  }, [nutritionist, navigate, setNutritionist]);

  // Show children only if authenticated
  if (!nutritionist) {
    return null;
  }

  return children;
};

export default ProtectedRoute;