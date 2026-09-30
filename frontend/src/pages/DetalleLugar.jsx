import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cataratas from "../assets/cataratas.jpg";

function DetalleLugar() {
  return (
    <div className="min-h-[75vh] bg-[#F7F9F8] -mx-4 -mt-4 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Imagen principal */}
        <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden">
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

      </div>
    </div>
  );
}

export default DetalleLugar;