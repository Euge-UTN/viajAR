import { BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';


function AppContent() {
  const location = useLocation();

  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

useEffect(() => {
  const verificarSesion = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUsuario(null);
      setCargandoSesion(false);
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/auth/perfil', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error('Sesión inválida');
      }

      setUsuario(datos.usuario);

      localStorage.setItem(
        'usuario',
        JSON.stringify(datos.usuario)
      );

    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);

    } finally {
      setCargandoSesion(false);
    }
  };

  verificarSesion();
}, []);

  const mostrarNavbar = true;

return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {mostrarNavbar && <Navbar usuario={usuario} setUsuario={setUsuario} />}

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AppRoutes
        usuario={usuario}
        setUsuario={setUsuario}
        cargandoSesion={cargandoSesion}
      />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;