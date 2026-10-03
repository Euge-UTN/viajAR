import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Registro({ setUsuario }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar Nombre
    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    } else if (nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

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
    } else if (password.length < 8) {
      nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    // Validar Confirmación de Contraseña
    if (!confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Debés confirmar la contraseña.';
    } else if (confirmarPassword !== password) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      if (setUsuario) {
        setUsuario({
          nombre: nombre.trim() || email.split('@')[0] || "Viajero",
          email: email.trim()
        });
      }
      navigate('/');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#F7F9F8] px-4 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C] mb-3">
            Bienvenido a ViajAR
          </p>

          <h1 className="text-3xl font-bold text-[#324851] mb-2">
            Crear cuenta
          </h1>

          <p className="text-[#46565A]">
            Registrate para comenzar tu viaje.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#7DA3A1] shadow-sm p-6 sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-[#324851] mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-xl border border-[#7DA3A1] px-4 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
                placeholder="Ingresá tu nombre"
              />
              {errores.nombre && (
                <p className="text-red-600 text-sm mt-2">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#324851] mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#7DA3A1] px-4 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
                placeholder="Ingresá tu correo"
              />
              {errores.email && (
                <p className="text-red-600 text-sm mt-2">{errores.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#324851] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#7DA3A1] pl-4 pr-12 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
                  placeholder="Ingresá tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#324851] p-1 transition"
                  title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.074-4.65 5.234-8 10.064-8 4.83 0 8.99 3.35 10.064 8-1.074 4.65-5.234 8-10.064 8-4.83 0-8.99-3.35-10.064-8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errores.password && (
                <p className="text-red-600 text-sm mt-2">{errores.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#324851] mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarConfirmar ? "text" : "password"}
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#7DA3A1] pl-4 pr-12 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
                  placeholder="Repetí tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#324851] p-1 transition"
                  title={mostrarConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarConfirmar ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.074-4.65 5.234-8 10.064-8 4.83 0 8.99 3.35 10.064 8-1.074 4.65-5.234 8-10.064 8-4.83 0-8.99-3.35-10.064-8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errores.confirmarPassword && (
                <p className="text-red-600 text-sm mt-2">{errores.confirmarPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#86AC41] hover:bg-[#6F9635] text-white font-semibold rounded-xl py-3 transition shadow-sm"
            >
              Registrarse
            </button>

          </form>

          <div className="text-center mt-6">
            <p className="text-[#46565A] text-sm">
              ¿Ya tenés una cuenta?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#34675C] hover:text-[#86AC41] transition"
              >
                Iniciá sesión
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}