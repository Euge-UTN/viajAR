import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();
  const mostrarBotones = location.pathname === '/' || location.pathname === '/home';

  return (
    <nav className="bg-[#3F5145] text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         <Link to="/home" className="text-2xl font-bold text-white">
          ViajAR
         </Link>
          
          {/* Menú de Escritorio */}
          <div className="hidden md:flex space-x-4 items-center text-sm font-medium">
            {mostrarBotones && (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="text-white hover:text-[#86AC41] px-4 py-2 rounded-xl border border-[#7DA3A1] hover:bg-[#34675C] transition"
                >
                  Iniciar Sesión
                </Link>

                <Link 
                  to="/registro" 
                  className="bg-[#86AC41] hover:bg-[#6F9635] px-4 py-2 rounded-xl text-white font-semibold transition shadow-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón Menú para Móviles */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-slate-300 hover:text-white focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable en Móviles */}
      {menuAbierto && mostrarBotones && (
        <div className="md:hidden bg-slate-800 px-4 pt-2 pb-4 space-y-2 text-sm border-t border-slate-700">
          <Link 
            to="/login" 
            onClick={() => setMenuAbierto(false)}
            className="block text-center py-2 rounded-xl border border-[#7DA3A1] text-white hover:bg-[#34675C] transition"
          >
            Iniciar Sesión
          </Link>

          <Link 
            to="/registro" 
            onClick={() => setMenuAbierto(false)}
            className="block text-center py-2 bg-[#86AC41] hover:bg-[#6F9635] text-white rounded-xl font-semibold transition"
          >
            Registrarse
          </Link>
        </div>
      )}
    </nav>
  );
}