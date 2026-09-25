import { useState } from "react";

const destinos = {
  "Buenos Aires": {
    "Mar del Plata": [
      {
        nombre: "Playa Grande",
        descripcion: "Una de las playas más conocidas de Mar del Plata.",
      },
      {
        nombre: "Puerto de Mar del Plata",
        descripcion: "Zona turística con restaurantes y actividades.",
      },
    ],
    Tandil: [
      {
        nombre: "Parque Independencia",
        descripcion: "Espacio verde con senderos y miradores.",
      },
    ],
  },

  Córdoba: {
    "Villa Carlos Paz": [
      {
        nombre: "Reloj Cucú",
        descripcion: "Uno de los lugares más reconocidos de la ciudad.",
      },
    ],
  },
};

const destinosDestacados = [
  {
    nombre: "Cataratas del Iguazú",
    provincia: "Misiones",
    puntuacion: 4.9,
  },
  {
    nombre: "San Carlos de Bariloche",
    provincia: "Río Negro",
    puntuacion: 4.8,
  },
  {
    nombre: "Quebrada de Humahuaca",
    provincia: "Jujuy",
    puntuacion: 4.7,
  },
];

export default function Home() {
  const [provincia, setProvincia] = useState("");
  const [localidad, setLocalidad] = useState("");

  const provincias = Object.keys(destinos);

  const localidades = provincia
    ? Object.keys(destinos[provincia])
    : [];

  const lugares =
    provincia && localidad
      ? destinos[provincia][localidad]
      : [];

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
            Seleccioná una provincia y una localidad.
          </p>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Provincia */}
            <div>
              <label className="block text-sm font-medium text-[#324851] mb-2">
                Provincia
              </label>

              <select
                value={provincia}
                onChange={(e) => {
                  setProvincia(e.target.value);
                  setLocalidad("");
                }}
                className="w-full rounded-xl border border-[#7DA3A1] bg-white px-4 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
              >
                <option value="">Seleccionar provincia</option>

                {provincias.map((nombreProvincia) => (
                  <option key={nombreProvincia} value={nombreProvincia}>
                    {nombreProvincia}
                  </option>
                ))}
              </select>
            </div>

            {/* Localidad */}
            <div>
              <label className="block text-sm font-medium text-[#324851] mb-2">
                Localidad
              </label>

              <select
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                disabled={!provincia}
                className="w-full rounded-xl border border-[#7DA3A1] bg-white px-4 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30 disabled:bg-[#E6E6E6] disabled:text-[#7DA3A1]"
              >
                <option value="">Seleccionar localidad</option>

                {localidades.map((nombreLocalidad) => (
                  <option key={nombreLocalidad} value={nombreLocalidad}>
                    {nombreLocalidad}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Lugares turísticos */}
        {lugares.length > 0 && (
          <div className="max-w-5xl mx-auto mt-12">

            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C]">
                Destinos
              </p>

              <h2 className="text-3xl font-bold text-[#324851] mt-1">
                Lugares turísticos
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {lugares.map((lugar) => (
                <div
                  key={lugar.nombre}
                  className="bg-white rounded-2xl border border-[#7DA3A1] p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E6E6E6] flex items-center justify-center mb-4">
                    <span className="text-[#34675C] text-lg">
                      →
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-[#324851] mb-2">
                    {lugar.nombre}
                  </h3>

                  <p className="text-[#46565A] leading-relaxed">
                    {lugar.descripcion}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinosDestacados.map((destino) => (
            <div
              key={destino.nombre}
              className="bg-white rounded-2xl border border-[#7DA3A1] p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-[#324851] mb-2">
                {destino.nombre}
              </h3>

              <p className="text-[#46565A] mb-4">
                {destino.provincia}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-[#86AC41] font-semibold">
                  ★ {destino.puntuacion}
                </span>

                <span className="text-sm text-[#46565A]">
                  valoración
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
      </div>
    </div>
  );
}