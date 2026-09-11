import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-sky-400">
            ViajAR
          </Link>
          
          {/* Menú de Escritorio */}
          <div className="hidden md:flex space-x-4 items-center text-sm font-medium">
            <Link to="/" className="hover:text-sky-300 transition">Destinos</Link>
            <Link to="/mis-viajes" className="hover:text-sky-300 transition">Mis Viajes</Link>
            <Link to="/favoritos" className="hover:text-sky-300 transition">Favoritos</Link>
            <Link to="/perfil" className="hover:text-sky-300 transition">Perfil</Link>
            
            <div className="flex items-center space-x-2 pl-2">
              <Link 
                to="/login" 
                className="text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/registro" 
                className="bg-sky-500 hover:bg-sky-600 px-3 py-1.5 rounded-lg text-white font-semibold transition shadow-sm"
              >
                Registrarse
              </Link>
            </div>
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
      {menuAbierto && (
        <div className="md:hidden bg-slate-800 px-4 pt-2 pb-4 space-y-2 text-sm border-t border-slate-700">
          <Link to="/" onClick={() => setMenuAbierto(false)} className="block py-2 hover:text-sky-300">Destinos</Link>
          <Link to="/mis-viajes" onClick={() => setMenuAbierto(false)} className="block py-2 hover:text-sky-300">Mis Viajes</Link>
          <Link to="/favoritos" onClick={() => setMenuAbierto(false)} className="block py-2 hover:text-sky-300">Favoritos</Link>
          <Link to="/perfil" onClick={() => setMenuAbierto(false)} className="block py-2 hover:text-sky-300">Perfil</Link>
          <div className="pt-2 border-t border-slate-700 flex flex-col space-y-2">
            <Link 
              to="/login" 
              onClick={() => setMenuAbierto(false)}
              className="text-center py-2 rounded-lg border border-slate-600 hover:bg-slate-700"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/registro" 
              onClick={() => setMenuAbierto(false)}
              className="text-center py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}