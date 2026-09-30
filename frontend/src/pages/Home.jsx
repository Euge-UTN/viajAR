import { useState } from "react";
import { useNavigate } from "react-router-dom";
import glaciar from "../assets/glaciar.jpg";
import bariloche from "../assets/bariloche.jpg";
import quebrada from "../assets/quebrada.jpg";

const resultadosPrueba = [
  {
    tipo: "Lugar turístico",
    nombre: "Cataratas del Iguazú",
    localidad: "Puerto Iguazú",
    provincia: "Misiones",
  },
  {
    tipo: "Lugar turístico",
    nombre: "Playa Grande",
    localidad: "Mar del Plata",
    provincia: "Buenos Aires",
  },
  {
    tipo: "Lugar turístico",
    nombre: "Parque Independencia",
    localidad: "Tandil",
    provincia: "Buenos Aires",
  },
  {
    tipo: "Localidad",
    nombre: "Mar del Plata",
    provincia: "Buenos Aires",
  },
];

const destinosDestacados = [
  {
    nombre: "Glaciar Perito Moreno",
    provincia: "Santa Cruz",
    puntuacion: 4.9,
    reseñas: "1.8K reseñas",
    descripcion:
      "Un impresionante glaciar rodeado de paisajes naturales únicos.",
    imagen: glaciar,
  },
  {
    nombre: "San Carlos de Bariloche",
    provincia: "Río Negro",
    puntuacion: 4.8,
    reseñas: "2.1K reseñas",
    descripcion:
      "Lagos cristalinos, montañas y la mejor gastronomía en la Patagonia.",
    imagen: bariloche,
  },
  {
    nombre: "Quebrada de Humahuaca",
    provincia: "Jujuy",
    puntuacion: 4.7,
    reseñas: "1.5K reseñas",
    descripcion:
      "Paisajes coloridos, cultura y pueblos históricos del norte argentino.",
    imagen: quebrada,
  },
];

export default function Home() {
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const resultados =
  busqueda.length >= 4
    ? resultadosPrueba.filter((resultado) => {
        const texto = busqueda.toLowerCase();

        return (
          resultado.nombre.toLowerCase().includes(texto) ||
          resultado.localidad?.toLowerCase().includes(texto) ||
          resultado.provincia?.toLowerCase().includes(texto)
        );
      })
    : [];

const seleccionarResultado = (resultado) => {
  if (resultado.tipo === "Lugar turístico") {
    navigate("/detalle-lugar");
  }
};

  return (
    <div className="min-h-[75vh] bg-[#F7F9F8] -mx-4 -mt-4 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Presentación */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C] mb-3">
            Descubrí Argentina
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#324851] mb-5">
            Explorá Argentina con{" "}
            <span className="text-[#86AC41]">ViajAR</span>
          </h1>

          <p className="text-lg text-[#46565A] max-w-2xl mx-auto">
            Encontrá nuevos lugares, descubrí destinos y empezá a planificar
            tu próximo viaje.
          </p>
        </div>

        {/* Buscador */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#7DA3A1] shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-[#324851] mb-2">
            ¿Dónde querés viajar?
          </h2>

          <p className="text-[#46565A] mb-6">
            Buscá una localidad, provincia o lugar turístico.
          </p>

          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Escribí al menos 4 letras..."
            className="w-full rounded-xl border border-[#7DA3A1] bg-white px-4 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
          />

          {busqueda.length >= 4 && (
            <div className="mt-4 space-y-3">
              {resultados.length > 0 ? (
                resultados.map((resultado) => (
                  <button
                    key={`${resultado.tipo}-${resultado.nombre}`}
                    onClick={() => seleccionarResultado(resultado)}
                    className="w-full text-left bg-[#F7F9F8] border border-[#7DA3A1] rounded-xl p-4 hover:bg-[#E6E6E6] transition"
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#34675C]">
                      {resultado.tipo}
                    </p>

                    <h3 className="text-lg font-semibold text-[#324851] mt-1">
                      {resultado.nombre}
                    </h3>

                    {resultado.localidad && (
                      <p className="text-sm text-[#46565A] mt-1">
                        {resultado.localidad} · {resultado.provincia}
                      </p>
                    )}

                    {!resultado.localidad && resultado.provincia && (
                      <p className="text-sm text-[#46565A] mt-1">
                        {resultado.provincia}
                      </p>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-[#46565A] py-3">
                  No se encontraron resultados.
                </p>
              )}
            </div>
          )}
        </div>

    {/* Destinos destacados */}
      <div className="max-w-5xl mx-auto mt-12">

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C]">
            Destinos destacados
          </p>

          <h2 className="text-3xl font-bold text-[#324851] mt-1">
            Los más valorados
          </h2>

          <p className="text-[#46565A] mt-2">
            Descubrí algunos de los destinos mejor valorados por la comunidad.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinosDestacados.map((destino) => (
            <button
              key={destino.nombre}
              onClick={() => navigate("/detalle-lugar")}
              className="group text-left bg-white rounded-2xl overflow-hidden border border-[#7DA3A1] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={destino.imagen}
                  alt={destino.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">
                    {destino.provincia}
                  </p>

                  <h3 className="text-white text-xl font-bold mt-1">
                    {destino.nombre}
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#D89B2B] font-semibold">
                    ★ {destino.puntuacion}
                  </span>

                  <span className="text-sm text-[#46565A]">
                    · {destino.reseñas}
                  </span>
                </div>

                <p className="text-sm text-[#46565A] leading-relaxed">
                  {destino.descripcion}
                </p>

                <p className="text-sm font-semibold text-[#34675C] mt-4 group-hover:text-[#86AC41] transition">
                  Ver destino →
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>
      </div>
    </div>
  );
}