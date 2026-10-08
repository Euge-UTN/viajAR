import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cataratas from "../assets/cataratas.jpg";

function DetalleLugar() {
  const navigate = useNavigate();
  const [modalItinerario, setModalItinerario] = useState(false);
  const [viajes, setViajes] = useState([]);
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [esVisitado, setEsVisitado] = useState(false);
  const [modalReseña, setModalReseña] = useState(false);
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [esFavorito, setEsFavorito] = useState(false);

  const cargarViajes = () => {
  const viajesGuardados = localStorage.getItem("viajes");

  if (viajesGuardados) {
    setViajes(JSON.parse(viajesGuardados));
  }
};

useEffect(() => {
  const favoritosGuardados = JSON.parse(
    localStorage.getItem("favoritos") || "[]"
  );

  const favoritoExiste = favoritosGuardados.some(
    (favorito) => favorito.nombre === "Cataratas del Iguazú"
  );

  setEsFavorito(favoritoExiste);
}, []);

useEffect(() => {
  const lugaresVisitados = JSON.parse(
    localStorage.getItem("lugaresVisitados") || "[]"
  );

  const lugarVisitado = lugaresVisitados.some(
    (lugar) => lugar.nombre === "Cataratas del Iguazú"
  );

  setEsVisitado(lugarVisitado);
}, []);

const cambiarFavorito = () => {
  const favoritosGuardados = JSON.parse(
    localStorage.getItem("favoritos") || "[]"
  );

  if (esFavorito) {
    const favoritosActualizados = favoritosGuardados.filter(
      (favorito) => favorito.nombre !== "Cataratas del Iguazú"
    );

    localStorage.setItem(
      "favoritos",
      JSON.stringify(favoritosActualizados)
    );

    setEsFavorito(false);
  } else {
    const nuevoFavorito = {
      id: 1,
      nombre: "Cataratas del Iguazú",
      localidad: "Puerto Iguazú",
      provincia: "Misiones",
      imagen: cataratas,
      descripcion:
        "Las Cataratas del Iguazú son uno de los principales atractivos turísticos de Argentina."
    };

    const favoritosActualizados = [
      ...favoritosGuardados,
      nuevoFavorito
    ];

    localStorage.setItem(
      "favoritos",
      JSON.stringify(favoritosActualizados)
    );

    setEsFavorito(true);
  }
};

const marcarComoVisitado = () => {
  const lugaresVisitados = JSON.parse(
    localStorage.getItem("lugaresVisitados") || "[]"
  );

  const yaVisitado = lugaresVisitados.some(
    (lugar) => lugar.nombre === "Cataratas del Iguazú"
  );

  if (!yaVisitado) {
    const nuevoLugar = {
      id: 1,
      nombre: "Cataratas del Iguazú",
      localidad: "Puerto Iguazú",
      provincia: "Misiones"
    };

    const lugaresActualizados = [
      ...lugaresVisitados,
      nuevoLugar
    ];

    localStorage.setItem(
      "lugaresVisitados",
      JSON.stringify(lugaresActualizados)
    );

    setEsVisitado(true);
  }
};

  return (
    <div className="min-h-[75vh] bg-[#F7F9F8] -mx-4 -mt-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span>Volver</span>
        </button>

        {/* Imagen principal */}
        <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden">
          <button
            type="button"
            onClick={cambiarFavorito}
            className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center text-[#34675C] hover:bg-white transition"
            title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={esFavorito ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
            <img
                src={cataratas}
                alt="Cataratas del Iguazú"
                className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#263832]/70 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <p className="text-white/90 text-sm font-medium mb-1">
                Misiones, Argentina
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Cataratas del Iguazú
                </h2>
                <div className="flex items-center gap-2 mt-2">
                <span className="text-[#86AC41] tracking-wide">
                    ★★★★★
                </span>

                <span className="text-white/90 text-sm">
                    4.9
                </span>
                </div>
            </div>
            </div>

        {/* Información principal */}
        <div className="grid lg:grid-cols-3 gap-8 mt-10">

          {/* Descripción */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#324851] mb-4">
              Sobre este lugar
            </h2>

            <p className="text-[#46565A] leading-relaxed">
              Las Cataratas del Iguazú son uno de los principales atractivos
              turísticos de Argentina. Se encuentran rodeadas de naturaleza y
              ofrecen diferentes recorridos para conocer el paisaje y disfrutar
              del entorno.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">

              <button
                onClick={() => {
                  cargarViajes();
                  setModalItinerario(true);
                }}
                className="px-5 py-3 rounded-xl bg-[#86AC41] text-white font-semibold hover:bg-[#6F9635] transition"
              >
                Agregar a mi itinerario
              </button>

              {!esVisitado ? (
                <button
                  type="button"
                  onClick={marcarComoVisitado}
                  className="px-5 py-3 rounded-xl bg-white border border-[#7DA3A1]/50 text-[#34675C] font-semibold hover:bg-[#34675C] hover:text-white transition"
                >
                  Marcar como visitado
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setModalReseña(true)}
                  className="px-5 py-3 rounded-xl bg-[#34675C] text-white font-semibold hover:bg-[#2B574E] transition"
                >
                  ✓ Lugar visitado · Escribir reseña
                </button>
              )}

            </div>
          </div>

          {/* Clima */}
          <div className="bg-white rounded-2xl border border-[#7DA3A1] p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C] mb-4">
                Clima actual
            </p>

            <div className="flex items-center justify-between">
                <div>
                <p className="text-4xl font-bold text-[#324851]">
                    22 °C
                </p>

                <p className="text-[#46565A] mt-1">
                    Parcialmente nublado
                </p>
                </div>

                <div className="text-right text-sm text-[#46565A]">
                <p>Humedad</p>
                <p className="font-medium text-[#324851]">72%</p>

                <p className="mt-2">Viento</p>
                <p className="font-medium text-[#324851]">12 km/h</p>
                </div>
            </div>

            <button
              onClick={() =>
                navigate("/clima", {
                  state: {
                    lugar: "Cataratas del Iguazú",
                    localidad: "Puerto Iguazú",
                  },
                })
              }
              className="mt-5 w-full rounded-xl bg-[#86AC41] px-4 py-3 font-semibold text-white hover:bg-[#6F9635] transition"
            >
              Consultar clima
            </button>
            </div>

        </div>

        {/* Actividades */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#324851] mb-4">
            ¿Qué podés hacer?
          </h2>

          <div className="flex flex-wrap gap-3">
            <span className="bg-white border border-[#7DA3A1] text-[#34675C] px-4 py-2 rounded-full">
              Senderismo
            </span>

            <span className="bg-white border border-[#7DA3A1] text-[#34675C] px-4 py-2 rounded-full">
              Fotografía
            </span>

            <span className="bg-white border border-[#7DA3A1] text-[#34675C] px-4 py-2 rounded-full">
              Visita guiada
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C] mb-2">
                Entorno
            </p>

            <span className="inline-block bg-white border border-[#7DA3A1] text-[#34675C] px-4 py-2 rounded-full">
                Al aire libre
            </span>
            </div>
        </div>

        {/* Experiencias */}
        <div className="mt-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C]">
                Comunidad ViajAR
            </p>

            <h2 className="text-2xl font-bold text-[#324851] mt-1">
                Experiencias de otros viajeros
            </h2>
            </div>

            <button className="text-[#34675C] font-medium hover:text-[#86AC41] transition">
            Ver todas las reseñas →
            </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">

            {/* Reseña 1 */}
            <div className="bg-white rounded-2xl border border-[#7DA3A1] p-6 shadow-sm">

            <div className="flex items-center justify-between mb-3">
                <p className="text-[#86AC41] font-semibold">
                ★★★★★
                </p>

                <p className="text-sm text-[#46565A]">
                Juan
                </p>
            </div>

            <p className="text-[#46565A] leading-relaxed">
                Un lugar increíble para conocer y disfrutar de la naturaleza.
                La experiencia fue muy linda.
            </p>

            </div>

            {/* Reseña 2 */}
            <div className="bg-white rounded-2xl border border-[#7DA3A1] p-6 shadow-sm">

            <div className="flex items-center justify-between mb-3">
                <p className="text-[#86AC41] font-semibold">
                ★★★★☆
                </p>

                <p className="text-sm text-[#46565A]">
                Ana
                </p>
            </div>

            <p className="text-[#46565A] leading-relaxed">
                Una experiencia muy linda y con muchos lugares para recorrer.
                Sin dudas volvería a visitar este destino.
            </p>

            </div>

        </div>

        </div>

        {/* Ubicación */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#324851] mb-5">
            Ubicación
          </h2>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">

            <div className="bg-white rounded-2xl border border-[#7DA3A1] p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C] mb-3">
                ¿Dónde está?
              </p>

              <p className="text-lg font-medium text-[#324851]">
                Puerto Iguazú
              </p>

              <p className="text-[#46565A] mt-1">
                Misiones, Argentina
              </p>

              <p className="text-[#46565A] mt-4 leading-relaxed">
                Las Cataratas del Iguazú se encuentran en el Parque Nacional Iguazú.
                </p>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden border border-[#7DA3A1] shadow-sm">
                <MapContainer
                    center={[-25.6953, -54.4367]}
                    zoom={14}
                    className="h-full w-full"
                >
                    <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[-25.6953, -54.4367]}>
                    <Popup>
                        Cataratas del Iguazú
                    </Popup>
                    </Marker>
                </MapContainer>
                </div>

          </div>
        </div>
        {modalItinerario && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto border border-slate-200 shadow-xl">
              
              <h3 className="text-xl font-bold text-[#324851] mb-2">
                Agregar a mi itinerario
              </h3>

              <p className="text-sm text-[#46565A] mb-5">
                Seleccioná el viaje al que querés agregar este lugar.
              </p>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  Mis viajes
                </p>

                {viajeSeleccionado ? (
                  <div className="space-y-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="font-semibold text-[#324851]">
                        {viajeSeleccionado.titulo}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Seleccioná el día para agregar este lugar.
                      </p>
                    </div>

                    {viajeSeleccionado.itinerario?.map((dia, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setModalItinerario(false);
                        setViajeSeleccionado(null);

                        navigate(`/mis-viajes/${viajeSeleccionado.id}`, {
                          state: {
                            actividadPendiente: {
                              diaIndex: index,
                              descripcion: "Cataratas del Iguazú",
                              categoria: "Excursión"
                            }
                          }
                        });
                      }}
                      className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-[#86AC41] hover:bg-[#F7F9F8] transition"
                    >
                      <p className="font-semibold text-[#324851]">
                        Día {dia.dia}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {dia.fecha}
                      </p>
                    </button>
                    ))}
                  </div>
                ) : viajes.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No tenés viajes creados todavía.
                  </p>
                ) : (
                  viajes.map((viaje) => (
                    <div
                      key={viaje.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                    >
                      <p className="font-semibold text-[#324851]">
                        {viaje.titulo}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {viaje.destino}
                      </p>

                      <button
                        onClick={() => setViajeSeleccionado(viaje)}
                        className="mt-3 w-full px-4 py-2 bg-[#86AC41] text-white rounded-xl font-semibold hover:bg-[#6F9635] transition"
                      >
                        Seleccionar
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end mt-5">
                <button
                  type="button"
                  onClick={() => setModalItinerario(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        )}
        {modalReseña && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl">

              <h3 className="text-xl font-bold text-[#324851] mb-1">
                Escribir reseña
              </h3>

              <p className="text-sm text-[#46565A] mb-5">
                Compartí tu experiencia en Cataratas del Iguazú.
              </p>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#324851] mb-2">
                  ¿Cómo calificás tu experiencia?
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <button
                      key={estrella}
                      type="button"
                      onClick={() => setPuntuacion(estrella)}
                      className={`text-3xl transition ${
                        estrella <= puntuacion
                          ? "text-[#86AC41]"
                          : "text-slate-300"
                      }`}
                      aria-label={`${estrella} estrellas`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="comentario"
                  className="block text-sm font-semibold text-[#324851] mb-2"
                >
                  Comentario
                </label>

                <textarea
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Contanos qué te pareció el lugar..."
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-[#7DA3A1]/40 focus:outline-none focus:ring-2 focus:ring-[#86AC41]/40 resize-none text-sm"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setModalReseña(false);
                    setComentario("");
                    setPuntuacion(5);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!comentario.trim()) return;

                    const reseñasGuardadas = JSON.parse(
                      localStorage.getItem("reseñas") || "[]"
                    );

                    const nuevaReseña = {
                      id: Date.now(),
                      lugar: "Cataratas del Iguazú",
                      puntuacion,
                      comentario: comentario.trim(),
                      fecha: new Date().toLocaleDateString("es-AR")
                    };

                    const reseñasActualizadas = [
                      ...reseñasGuardadas,
                      nuevaReseña
                    ];

                    localStorage.setItem(
                      "reseñas",
                      JSON.stringify(reseñasActualizadas)
                    );

                    setComentario("");
                    setPuntuacion(5);
                    setModalReseña(false);
                  }}
                  className="px-4 py-2 bg-[#86AC41] hover:bg-[#6F9635] text-white rounded-xl font-semibold transition"
                >
                  Publicar reseña
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalleLugar;