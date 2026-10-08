import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Favoritos() {
  const navigate = useNavigate();

  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const favoritosGuardados = JSON.parse(
      localStorage.getItem("favoritos") || "[]"
    );

    setFavoritos(favoritosGuardados);
  }, []);

  const eliminarFavorito = (id) => {
    const favoritosActualizados = favoritos.filter(
      (favorito) => favorito.id !== id
    );

    localStorage.setItem(
      "favoritos",
      JSON.stringify(favoritosActualizados)
    );

    setFavoritos(favoritosActualizados);
  };

  return (
    <div className="min-h-[75vh] bg-[#F7F9F8] -mx-4 -mt-4 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 mb-6 px-3.5 py-2 rounded-xl bg-white border border-[#7DA3A1]/30 text-[#324851] text-sm font-semibold hover:bg-[#34675C] hover:text-white hover:border-[#34675C] shadow-sm hover:shadow transition-all duration-200 group"
        aria-label="Volver"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
        </svg>
        <span>Volver</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#324851]">
            Mis favoritos
          </h1>

          <p className="mt-2 text-[#46565A]">
            Guardá los lugares que querés visitar y tenelos siempre a mano.
          </p>
        </div>

        {favoritos.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#7DA3A1]/30 p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#BAC8B1]/40 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-8 h-8 text-[#34675C]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-[#324851]">
              Todavía no tenés lugares favoritos
            </h2>

            <p className="text-sm text-[#46565A] mt-2 mb-6">
              Explorá los destinos y guardá los lugares que más te interesen.
            </p>

            <button
              onClick={() => navigate("/home")}
              className="px-5 py-3 rounded-xl bg-[#86AC41] text-white font-semibold hover:bg-[#6F9635] transition"
            >
              Explorar destinos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((favorito) => (
              <div
                key={favorito.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#7DA3A1]/30 shadow-sm hover:shadow-md transition"
              >
                <div className="relative h-52">
                  <img
                    src={favorito.imagen}
                    alt={favorito.nombre}
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => eliminarFavorito(favorito.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-[#34675C] hover:text-red-500 transition"
                    title="Quitar de favoritos"
                    aria-label="Quitar de favoritos"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-sm text-[#34675C] font-medium">
                    {favorito.localidad}, {favorito.provincia}
                  </p>

                  <h2 className="text-xl font-bold text-[#324851] mt-1">
                    {favorito.nombre}
                  </h2>

                  <p className="text-sm text-[#46565A] mt-2 line-clamp-2">
                    {favorito.descripcion}
                  </p>

                  <button
                    onClick={() => navigate("/detalle-lugar")}
                    className="mt-5 w-full px-4 py-2.5 rounded-xl bg-[#34675C] text-white font-semibold hover:bg-[#2B574E] transition"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Favoritos;
