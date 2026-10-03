import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import DetalleLugar from "../pages/DetalleLugar";
import Clima from "../pages/Clima";

function AppRoutes({ usuario = null, setUsuario }) {
  return (
    <Routes>
      <Route path="/" element={usuario ? <Home /> : <LandingPage />} />
      <Route path="/home" element={usuario ? <Home /> : <Navigate to="/" replace />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setUsuario={setUsuario} />} />
      <Route path="/registro" element={<Registro setUsuario={setUsuario} />} />
      <Route path="/detalle-lugar" element={<DetalleLugar />} />
      <Route path="/clima" element={<Clima />} />
    </Routes>
  );
}

export default AppRoutes;