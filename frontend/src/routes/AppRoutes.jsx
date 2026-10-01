import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import DetalleLugar from "../pages/DetalleLugar";
import Clima from "../pages/Clima";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/detalle-lugar" element={<DetalleLugar />} />
      <Route path="/clima" element={<Clima />} />
    </Routes>
  );
}

export default AppRoutes;