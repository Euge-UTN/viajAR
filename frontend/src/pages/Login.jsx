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
    } else if (password.length < 8) {
      nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres.';
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
      navigate('/home');
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
          Iniciar sesión
        </h1>

        <p className="text-[#46565A]">
          Ingresá para continuar con tu viaje.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#7DA3A1] shadow-sm p-6 sm:p-8">

        <form onSubmit={handleSubmit} className="space-y-5">

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
              <p className="text-red-600 text-sm mt-2">
                {errores.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#324851] mb-2">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#7DA3A1] px-4 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
              placeholder="Ingresá tu contraseña"
            />

            {errores.password && (
              <p className="text-red-600 text-sm mt-2">
                {errores.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#86AC41] hover:bg-[#6F9635] text-white font-semibold rounded-xl py-3 transition shadow-sm"
          >
            Iniciar sesión
          </button>

        </form>

        <div className="text-center mt-6">
          <p className="text-[#46565A] text-sm">
            ¿No tenés una cuenta?{" "}
            <Link
              to="/registro"
              className="font-semibold text-[#34675C] hover:text-[#86AC41] transition"
            >
              Registrate
            </Link>
          </p>
        </div>

      </div>
    </div>
  </div>
);
}