import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar Email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!regexEmail.test(email)) {
      nuevosErrores.email = 'Ingresá un correo electrónico válido.';
    }

    // Validar Contraseña
    if (!password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      // Extrae la parte anterior al @ del email para usarla como nombre de usuario
      const nombreUsuario = email.split('@')[0];
      alert(`¡Bienvenido de nuevo, ${nombreUsuario}!`);
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md border border-slate-100">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Iniciar Sesión</h2>
      
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com" 
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errores.email ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-sky-500'
            }`}
          />
          {errores.email && <p className="text-xs text-red-500 mt-1">{errores.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errores.password ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-sky-500'
            }`}
          />
          {errores.password && <p className="text-xs text-red-500 mt-1">{errores.password}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Ingresar
        </button>
      </form>

      <p className="text-sm text-center text-slate-600 mt-4">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="text-sky-500 hover:underline font-medium">
          Registrate acá
        </Link>
      </p>
    </div>
  );
}