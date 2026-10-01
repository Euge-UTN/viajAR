import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Clima() {
  const location = useLocation();
  const navigate = useNavigate();

  const lugar = location.state?.lugar;
  const localidad = location.state?.localidad;

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [clima, setClima] = useState(null);
  const [error, setError] = useState("");

  const consultarClima = (e) => {
    e.preventDefault();

    setError("");
    setClima(null);

    if (!fechaDesde || !fechaHasta) {
      setError("Seleccioná una fecha de inicio y una fecha de finalización.");
      return;
    }

    if (fechaHasta < fechaDesde) {
      setError(
        "La fecha de finalización no puede ser anterior a la fecha de inicio."
      );
      return;
    }

    // Datos de prueba
    setClima({
      temperatura: 22,
      probabilidadLluvia: 20,
      estado: "Parcialmente nublado",
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-2 text-2xl font-medium text-[#324851] hover:text-[#34675C] transition"
          aria-label="Volver"
        >
          ←
        </button>

        {/* Encabezado */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#34675C]">
            Clima
          </p>

          <h1 className="text-3xl font-bold text-[#324851] mt-1">
            ¿Cómo estará el clima?
          </h1>

          <p className="text-[#46565A] mt-2">
            Consultá el pronóstico para las fechas de tu viaje.
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={consultarClima}
          className="bg-white rounded-2xl border border-[#7DA3A1] shadow-sm p-6"
        >
          {/* Destino */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#324851]">
              Destino
            </p>

            <p className="text-lg font-medium text-[#34675C] mt-1">
              {lugar}
            </p>

            <p className="text-sm text-[#46565A]">
              {localidad}
            </p>
          </div>

          {/* Fechas */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#324851] mb-2">
                Desde
              </label>

              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full rounded-xl border border-[#7DA3A1] bg-white px-4 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#324851] mb-2">
                Hasta
              </label>

              <input
                type="date"
                value={fechaHasta}
                min={fechaDesde}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full rounded-xl border border-[#7DA3A1] bg-white px-4 py-3 text-[#324851] outline-none focus:border-[#34675C] focus:ring-2 focus:ring-[#7DA3A1]/30"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Botón */}
          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-[#86AC41] px-4 py-3 font-semibold text-white hover:bg-[#6F9635] transition"
          >
            Consultar clima
          </button>
        </form>

        {/* Resultado */}
        {clima && (
          <div className="mt-6 bg-white rounded-2xl border border-[#7DA3A1] shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#324851]">
              Pronóstico
            </h2>

            <p className="text-[#46565A] mt-1">
              {localidad} · {fechaDesde} al {fechaHasta}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-5">

              {/* Temperatura */}
              <div className="rounded-xl bg-[#F7F9F8] p-4">
                <p className="text-sm text-[#46565A]">
                  Temperatura
                </p>

                <p className="text-2xl font-bold text-[#324851] mt-1">
                  {clima.temperatura} °C
                </p>
              </div>

              {/* Lluvia */}
              <div className="rounded-xl bg-[#F7F9F8] p-4">
                <p className="text-sm text-[#46565A]">
                  Probabilidad de lluvia
                </p>

                <p className="text-2xl font-bold text-[#324851] mt-1">
                  {clima.probabilidadLluvia}%
                </p>
              </div>

              {/* Estado */}
              <div className="rounded-xl bg-[#F7F9F8] p-4">
                <p className="text-sm text-[#46565A]">
                  Estado
                </p>

                <p className="text-lg font-bold text-[#324851] mt-1">
                  {clima.estado}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Clima;