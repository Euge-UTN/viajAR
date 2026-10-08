import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import DetalleLugar from "../pages/DetalleLugar";
import Clima from "../pages/Clima";
import MisViajes from '../pages/MisViajes';
import DetalleViaje from '../pages/DetalleViaje';
import Favoritos from '../pages/Favoritos';
import Perfil from '../pages/Perfil';

function AppRoutes({ usuario = null, setUsuario }) {
  return (
    <Routes>
      <Route path="/" element={usuario ? <Home /> : <LandingPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setUsuario={setUsuario} />} />
      <Route path="/registro" element={<Registro setUsuario={setUsuario} />} />
      <Route path="/detalle-lugar" element={<DetalleLugar />} />
      <Route path="/clima" element={<Clima />} />
      <Route path="/mis-viajes" element={<MisViajes />} />
      <Route path="/mis-viajes/:id" element={<DetalleViaje />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/perfil" element={<Perfil usuario={usuario} />} />
      <Route path="/destino/:id" element={<DetalleLugar />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;