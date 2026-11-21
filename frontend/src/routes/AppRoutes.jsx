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
function RutaPrivada({ usuario, cargandoSesion, children }) {
  if (cargandoSesion) {
    return <p className="text-center">Verificando sesión...</p>;
  }

  return usuario ? children : <Navigate to="/login" replace />;
}

function AppRoutes({ usuario = null, setUsuario, cargandoSesion }) {
  return (
    <Routes>
      <Route
        path="/"
        element={cargandoSesion ? (
          <p className="text-center">Verificando sesión...</p>
        ) : usuario ? <Home /> : <LandingPage />}
      />

      <Route
        path="/login"
        element={
          cargandoSesion ? (
            <p className="text-center">Verificando sesión...</p>
          ) : usuario ? (
            <Navigate to="/home" replace />
          ) : (
            <Login setUsuario={setUsuario} />
          )
        }
      />

      <Route
        path="/registro"
        element={
          cargandoSesion ? (
            <p className="text-center">Verificando sesión...</p>
          ) : usuario ? (
            <Navigate to="/home" replace />
          ) : (
            <Registro setUsuario={setUsuario} />
          )
        }
      />

      <Route
        path="/home"
        element={
          <RutaPrivada usuario={usuario} cargandoSesion={cargandoSesion}>
            <Home />
          </RutaPrivada>
        }
      />

      <Route
        path="/detalle-lugar"
        element={
          <RutaPrivada usuario={usuario} cargandoSesion={cargandoSesion}>
            <DetalleLugar />
          </RutaPrivada>
        }
      />

      <Route
        path="/clima"
        element={
          <RutaPrivada usuario={usuario} cargandoSesion={cargandoSesion}>
            <Clima />
          </RutaPrivada>
        }
      />

      <Route
        path="/mis-viajes"
        element={
          <RutaPrivada usuario={usuario} cargandoSesion={cargandoSesion}>
            <MisViajes />
          </RutaPrivada>
        }
      />

      <Route
        path="/mis-viajes/:id"
        element={
          <RutaPrivada usuario={usuario} cargandoSesion={cargandoSesion}>
            <DetalleViaje />
          </RutaPrivada>
        }
      />

      <Route
        path="/favoritos"
        element={
          <RutaPrivada usuario={usuario} cargandoSesion={cargandoSesion}>
            <Favoritos />
          </RutaPrivada>
        }
      />

      <Route
        path="/perfil"
        element={
          <RutaPrivada usuario={usuario} cargandoSesion={cargandoSesion}>
            <Perfil usuario={usuario} />
          </RutaPrivada>
        }
      />

      <Route
        path="/destino/:id"
        element={
          <RutaPrivada usuario={usuario} cargandoSesion={cargandoSesion}>
            <DetalleLugar />
          </RutaPrivada>
        }
      />
    </Routes>
  );
}

export default AppRoutes;

