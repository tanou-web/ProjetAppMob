import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Si pas connecté, rediriger vers login
    return <Navigate to="/login" replace />;
  }

  // Si connecté, afficher le contenu
  return children;
}

export default ProtectedRoute;