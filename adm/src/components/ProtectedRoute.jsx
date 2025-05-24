import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../Context/Context';

const ProtectedRoute = ({ children }) => {
  const { admin, setAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    if (!admin && token) {
      // If there's a token but no admin in context, set the admin
      setAdmin(token);
    } else if (!admin && !token) {
      // Only redirect if there's no admin AND no token
      navigate('/login');
    }
  }, [admin, navigate, setAdmin]);

  return children;
};

export default ProtectedRoute;