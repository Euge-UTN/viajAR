import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUsuario }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Por favor, completá todos los campos.');
      return;
    }

    if (setUsuario) {
      setUsuario({
        email: email,
        nombre: email.split('@')[0] || "Viajero"
      });
    }

    navigate('/');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#F7F9F8] px-4 py-10">
      <div className="w-full max-w-md">

        {/* Encabezado restaurado */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C] mb-3">
            Bienvenido a ViajAR
          </p>

          <h1 className="text-3xl font-bold text-[#324851] mb-2">
            Iniciar sesión
          </h1>

          <p className="text-[#46565A]">
            Ingresá a tu cuenta para continuar planificando tu viaje.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#7DA3A1] shadow-sm p-6 sm:p-8">

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#324851] mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full rounded-xl border border-[#7DA3A1] px-4 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
                placeholder="Ingresá tu correo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#324851] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
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
              ¿No tenés una cuenta?{' '}
              <Link
                to="/registro"
                className="font-semibold text-[#34675C] hover:text-[#86AC41] transition"
              >
                Registrate acá
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}