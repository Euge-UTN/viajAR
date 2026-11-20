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

// PROTEGER RUTAS PRIVADAS
function RutaPrivada({ usuario, children }) {
  return usuario ? children : <Navigate to="/login" replace />;
}

function AppRoutes({ usuario = null, setUsuario }) {
  return (
    <Routes>
      <Route
        path="/"
        element={usuario ? <Home /> : <LandingPage />}
      />

      <Route
        path="/login"
        element={usuario ? <Navigate to="/home" replace /> : <Login setUsuario={setUsuario} />}
      />

      <Route
        path="/registro"
        element={usuario ? <Navigate to="/home" replace /> : <Registro setUsuario={setUsuario} />}
      />

      <Route
        path="/home"
        element={
          <RutaPrivada usuario={usuario}>
            <Home />
          </RutaPrivada>
        }
      />

      <Route
        path="/detalle-lugar"
        element={
          <RutaPrivada usuario={usuario}>
            <DetalleLugar />
          </RutaPrivada>
        }
      />

      <Route
        path="/clima"
        element={
          <RutaPrivada usuario={usuario}>
            <Clima />
          </RutaPrivada>
        }
      />

      <Route
        path="/mis-viajes"
        element={
          <RutaPrivada usuario={usuario}>
            <MisViajes />
          </RutaPrivada>
        }
      />

      <Route
        path="/mis-viajes/:id"
        element={
          <RutaPrivada usuario={usuario}>
            <DetalleViaje />
          </RutaPrivada>
        }
      />

      <Route
        path="/favoritos"
        element={
          <RutaPrivada usuario={usuario}>
            <Favoritos />
          </RutaPrivada>
        }
      />

      <Route
        path="/perfil"
        element={
          <RutaPrivada usuario={usuario}>
            <Perfil usuario={usuario} />
          </RutaPrivada>
        }
      />

      <Route
        path="/destino/:id"
        element={
          <RutaPrivada usuario={usuario}>
            <DetalleLugar />
          </RutaPrivada>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
