import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Historial from './pages/Historial';
import Registro from './pages/Registro';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<RutaProtegida><Home /></RutaProtegida>} />
          <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />
          <Route path="/carrito" element={<RutaProtegida><Carrito /></RutaProtegida>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/historial" element={<RutaProtegida><Historial /></RutaProtegida>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}