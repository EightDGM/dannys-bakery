import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function RutaProtegida({ children }) {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
