import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (isTokenValid(token)) {
    return children;
  } else {
    return <Navigate to='/login' />;
  }
};

export default ProtectedRoute;
