import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Clima() {
  const location = useLocation();
  const navigate = useNavigate();

  const lugar = location.state?.lugar || "Cataratas del Iguazú";
  const localidad = location.state?.localidad || "Puerto Iguazú, Misiones";

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
    setClima([
      {
        fecha: "02/10/2026",
        temperaturaMin: 14,
        temperaturaMax: 23,
        probabilidadLluvia: 20,
        estado: "Parcialmente nublado",
      },
      {
        fecha: "03/10/2026",
        temperaturaMin: 15,
        temperaturaMax: 25,
        probabilidadLluvia: 35,
        estado: "Nublado",
      },
      {
        fecha: "04/10/2026",
        temperaturaMin: 16,
        temperaturaMax: 27,
        probabilidadLluvia: 15,
        estado: "Despejado",
      },
      {
        fecha: "05/10/2026",
        temperaturaMin: 17,
        temperaturaMax: 24,
        probabilidadLluvia: 50,
        estado: "Lluvias aisladas",
      },
    ]);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [año, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${año}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] px-4 py-10">
      <div className="max-w-4xl mx-auto">
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
            <p className="text-sm font-semibold text-[#324851]">Destino</p>

            <p className="text-lg font-medium text-[#34675C] mt-1">{lugar}</p>

            <p className="text-sm text-[#46565A]">{localidad}</p>
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
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

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
          <div className="mt-8 space-y-8">
            {/* Encabezado del pronóstico */}
            <div className="bg-white rounded-2xl border border-[#7DA3A1]/40 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#324851]">
                    Pronóstico del tiempo
                  </h2>
                  <p className="text-[#46565A] text-sm mt-1">
                    {localidad} · {formatearFecha(fechaDesde)} al{" "}
                    {formatearFecha(fechaHasta)}
                  </p>
                </div>
                <span className="self-start sm:self-auto bg-[#34675C]/10 text-[#34675C] text-xs font-semibold px-3 py-1.5 rounded-full">
                  {clima.length} días consultados
                </span>
              </div>

              {/* Único Gráfico Principal */}
              <div className="mb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#34675C] mb-4">
                  Evolución de temperaturas (°C)
                </h3>
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={clima}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E2E8F0"
                      />
                      <XAxis
                        dataKey="fecha"
                        tick={{ fill: "#46565A", fontSize: 12 }}
                      />
                      <YAxis
                        unit="°"
                        tick={{ fill: "#46565A", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "12px",
                          borderColor: "#7DA3A1",
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line
                        name="Temp. Máxima"
                        type="monotone"
                        dataKey="temperaturaMax"
                        stroke="#E05A47"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#E05A47" }}
                      />
                      <Line
                        name="Temp. Mínima"
                        type="monotone"
                        dataKey="temperaturaMin"
                        stroke="#34675C"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#34675C" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Detalle diario con tarjetas corregidas */}
            <div>
              <h3 className="text-xl font-bold text-[#324851] mb-4">
                Detalle día por día
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {clima.map((dia) => (
                  <div
                    key={dia.fecha}
                    className="bg-white rounded-2xl border border-[#7DA3A1]/30 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Encabezado Tarjeta */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <span className="font-bold text-[#324851] text-base">
                          {dia.fecha}
                        </span>
                        <span className="text-xs font-semibold text-[#34675C] bg-[#34675C]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                          {dia.probabilidadLluvia > 40 ? "🌧️ Lluvia" : "☀️ Estable"}
                        </span>
                      </div>

                      {/* Estado con altura fija y centrado perfecto */}
                      <div
                        className="bg-[#F7F9F8] p-3 rounded-xl border border-[#7DA3A1]/20 my-2 text-center flex flex-col justify-center items-center"
                        style={{ minHeight: "72px" }}
                      >
                        <span className="text-[11px] font-semibold text-[#46565A] uppercase tracking-wider mb-0.5 block">
                          Estado
                        </span>
                        <span className="text-sm font-bold text-[#324851] leading-tight">
                          {dia.estado}
                        </span>
                      </div>

                      {/* Temperaturas Mín / Máx */}
                      <div className="flex justify-between items-center text-sm py-2 px-1 mb-2">
                        <span className="text-[#46565A] text-xs font-medium">
                          Mín / Máx
                        </span>
                        <span className="font-bold text-sm">
                          <span className="text-[#34675C]">
                            {dia.temperaturaMin}°C
                          </span>
                          <span className="text-slate-300 mx-1.5">|</span>
                          <span className="text-[#E05A47]">
                            {dia.temperaturaMax}°C
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Probabilidad de lluvia */}
                    <div className="pt-3 border-t border-slate-100 mt-2">
                      <div className="flex justify-between text-xs text-[#46565A] mb-1.5">
                        <span className="font-medium">Prob. Lluvia</span>
                        <span className="font-bold text-[#34675C]">
                          {dia.probabilidadLluvia}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            dia.probabilidadLluvia > 40
                              ? "bg-[#E05A47]"
                              : "bg-[#34675C]"
                          }`}
                          style={{ width: `${dia.probabilidadLluvia}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clima;