import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Perfil({ usuario }) {
  const navigate = useNavigate();

  const [viajes, setViajes] = useState([]);
  const [reseñas, setReseñas] = useState([]);

  useEffect(() => {
    const viajesGuardados = JSON.parse(
      localStorage.getItem("viajes") || "[]"
    );

    setViajes(viajesGuardados);

    const reseñasGuardadas = JSON.parse(
      localStorage.getItem("reseñas") || "[]"
    );

    setReseñas(reseñasGuardadas);
  }, []);

    const viajesCompletados = viajes.filter(
    (viaje) => viaje.estado === "Finalizado"
    );

    const lugaresVisitados = JSON.parse(
    localStorage.getItem("lugaresVisitados") || "[]"
    );

  const medallas = [
    {
      id: 1,
      nombre: "Primer viaje",
      descripcion: "Completaste tu primer viaje.",
      obtenida: viajesCompletados.length >= 1
    },
    {
      id: 2,
      nombre: "Viajero frecuente",
      descripcion: "Completaste 3 viajes.",
      obtenida: viajesCompletados.length >= 3
    },
    {
      id: 3,
      nombre: "Explorador",
      descripcion: "Visitaste 5 lugares.",
      obtenida: lugaresVisitados.length >= 5
    },
    {
      id: 4,
      nombre: "Crítico viajero",
      descripcion: "Publicaste tu primera reseña.",
      obtenida: reseñas.length >= 1
    }
  ];

  return (
    <div className="min-h-[75vh] bg-[#F7F9F8] -mx-4 -mt-4 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Volver */}
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

        {/* Encabezado */}
        <div className="bg-white rounded-3xl border border-[#7DA3A1]/30 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-[#BAC8B1] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-10 h-10 text-[#34675C]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm text-[#34675C] font-semibold">
                Diario de viajero
              </p>

                <h1 className="text-3xl sm:text-4xl font-bold text-[#324851]">
                {usuario?.nombre || "Mi perfil"}
                </h1>

              <p className="mt-1 text-[#46565A]">
                Tu recorrido, experiencias y logros en ViajAR.
              </p>
            </div>

          </div>
        </div>

        {/* Estadísticas */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-[#324851] mb-4">
            Mis estadísticas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-white rounded-2xl border border-[#7DA3A1]/30 p-5">
              <p className="text-sm text-[#46565A]">
                Viajes realizados
              </p>

              <p className="text-3xl font-bold text-[#34675C] mt-1">
                {viajesCompletados.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#7DA3A1]/30 p-5">
              <p className="text-sm text-[#46565A]">
                Viajes planificados
              </p>

              <p className="text-3xl font-bold text-[#34675C] mt-1">
                {viajes.filter((viaje) => viaje.estado === "Planificado").length}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#7DA3A1]/30 p-5">
              <p className="text-sm text-[#46565A]">
                Reseñas realizadas
              </p>

              <p className="text-3xl font-bold text-[#34675C] mt-1">
                {reseñas.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#7DA3A1]/30 p-5">
                <p className="text-sm text-[#46565A]">
                    Lugares visitados
                </p>
                <p className="text-3xl font-bold text-[#34675C] mt-1">
                    {lugaresVisitados.length}
                </p>
            </div>

          </div>
        </section>

        {/* Medallas */}
        <section className="bg-white rounded-3xl border border-[#7DA3A1]/30 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-[#324851] mb-5">
            Mis medallas
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {medallas.map((medalla) => (
              <div
                key={medalla.id}
                className={`rounded-2xl p-4 text-center border ${
                  medalla.obtenida
                    ? "bg-[#BAC8B1]/30 border-[#7DA3A1]/40"
                    : "bg-slate-50 border-slate-200 opacity-50"
                }`}
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#E6E6E6] flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={medalla.obtenida ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="w-7 h-7 text-[#86AC41]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l2.2 4.45 4.92.71-3.56 3.47.84 4.9L12 14.2l-4.4 2.33.84-4.9L4.88 8.16l4.92-.71L12 3Z"
                    />
                  </svg>
                </div>

                <h3 className="font-bold text-[#324851] text-sm">
                  {medalla.nombre}
                </h3>

                <p className="text-xs text-[#46565A] mt-1">
                  {medalla.descripcion}
                </p>

                <p className="text-xs font-semibold mt-2 text-[#34675C]">
                  {medalla.obtenida ? "Obtenida" : "Bloqueada"}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* Historial */}
        <section className="bg-white rounded-3xl border border-[#7DA3A1]/30 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#324851]">
              Historial de viajes
            </h2>

            <button
              type="button"
              onClick={() => navigate("/mis-viajes")}
              className="text-sm font-semibold text-[#34675C] hover:text-[#86AC41] transition"
            >
              Ver mis viajes
            </button>
          </div>

          {viajesCompletados.length === 0 ? (
            <p className="text-sm text-[#46565A]">
              Todavía no tenés viajes completados.
            </p>
          ) : (
            <div className="space-y-3">
              {viajesCompletados.map((viaje) => (
                <div
                  key={viaje.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-[#F7F9F8] border border-[#7DA3A1]/20"
                >
                  <div>
                    <h3 className="font-bold text-[#324851]">
                      {viaje.titulo}
                    </h3>

                    <p className="text-sm text-[#46565A]">
                      {viaje.destino}
                    </p>
                  </div>

                  <p className="text-sm text-[#34675C] font-medium">
                    {viaje.fechaInicio} - {viaje.fechaFin}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reseñas */}
        <section className="bg-white rounded-3xl border border-[#7DA3A1]/30 shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#324851] mb-5">
            Mis reseñas
          </h2>

          {reseñas.length === 0 ? (
            <p className="text-sm text-[#46565A]">
              Todavía no publicaste ninguna reseña.
            </p>
          ) : (
            <div className="space-y-4">
              {reseñas.map((reseña) => (
                <div
                  key={reseña.id}
                  className="p-4 rounded-2xl bg-[#F7F9F8] border border-[#7DA3A1]/20"
                >
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-[#324851]">
                        {reseña.lugar}
                    </span>

                    <span className="text-[#86AC41]">
                        {"★".repeat(reseña.puntuacion || 0)}
                    </span>

                    {reseña.fecha && (
                        <span className="text-sm text-[#46565A]">
                         {reseña.fecha}
                        </span>
                    )}
                </div>
                  <p className="text-sm text-[#46565A] mt-2">
                    {reseña.comentario}
                  </p>
                </div>
              ))}
            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default Perfil;
