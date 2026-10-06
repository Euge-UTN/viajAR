import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function porcentajeGastoColor(porcentaje) {
  if (porcentaje > 90) return 'bg-red-500';
  if (porcentaje > 75) return 'bg-amber-500';
  return 'bg-[#86AC41]';
}

export default function DetalleViaje() {
  const { id } = useParams();
  const navigate = useNavigate();

const [viaje, setViaje] = useState(() => {
const viajesGuardados = localStorage.getItem('viajes');

  if (viajesGuardados) {
    const viajes = JSON.parse(viajesGuardados);
    const viajeEncontrado = viajes.find((v) => v.id === Number(id));

    if (viajeEncontrado) {
      return viajeEncontrado;
    }
  }

  return null;
});

  const [pestanaActiva, setPestanaActiva] = useState('itinerario');
  const [modalActividad, setModalActividad] = useState(false);
  const [modalGasto, setModalGasto] = useState(false);
  
  const [nuevaActividad, setNuevaActividad] = useState({ diaIndex: 0, hora: '', descripcion: '', categoria: 'Excursión' });
  const [nuevoGasto, setNuevoGasto] = useState({ concepto: '', categoria: 'Comida', monto: '' });

  const totalGastado = viaje.gastos.reduce((acc, g) => acc + Number(g.monto), 0);
  const saldoRestante = viaje.presupuestoTotal - totalGastado;
  const porcentajeEjecutado = Math.min(Math.round((totalGastado / viaje.presupuestoTotal) * 100), 100);

  const handleAgregarActividad = (e) => {
    e.preventDefault();
    if (!nuevaActividad.descripcion.trim()) return;

    const itinerarioActualizado = [...viaje.itinerario];
    const diaObj = itinerarioActualizado[nuevaActividad.diaIndex];

    if (diaObj) {
      diaObj.actividades.push({
        id: Date.now(),
        hora: nuevaActividad.hora || '12:00',
        descripcion: nuevaActividad.descripcion,
        categoria: nuevaActividad.categoria
      });

      const viajeActualizado = {
        ...viaje,
        itinerario: itinerarioActualizado
      };

      setViaje(viajeActualizado);

      const viajesGuardados = JSON.parse(localStorage.getItem('viajes')) || [];

      const viajesActualizados = viajesGuardados.map((v) =>
        v.id === viajeActualizado.id ? viajeActualizado : v
      );

      localStorage.setItem('viajes', JSON.stringify(viajesActualizados));
    }

    setNuevaActividad({ diaIndex: 0, hora: '', descripcion: '', categoria: 'Excursión' });
    setModalActividad(false);
  };

  const handleAgregarGasto = (e) => {
    e.preventDefault();
    if (!nuevoGasto.concepto.trim() || !nuevoGasto.monto) return;

    const gastoObj = {
      id: Date.now(),
      concepto: nuevoGasto.concepto,
      categoria: nuevoGasto.categoria,
      monto: Number(nuevoGasto.monto),
      fecha: new Date().toLocaleDateString('es-AR')
    };

    const viajeActualizado = {
      ...viaje,
      gastos: [...viaje.gastos, gastoObj]
    };

    setViaje(viajeActualizado);

    const viajesGuardados = JSON.parse(localStorage.getItem('viajes')) || [];

    const viajesActualizados = viajesGuardados.map((v) =>
      v.id === viajeActualizado.id ? viajeActualizado : v
    );

    localStorage.setItem('viajes', JSON.stringify(viajesActualizados));

    setNuevoGasto({ concepto: '', categoria: 'Comida', monto: '' });
    setModalGasto(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Botón Volver */}
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>Volver</span>
      </button>

      {/* Tarjeta Resumen del Viaje */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#7DA3A1]/15 text-[#34675C]">
              {viaje.estado}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {viaje.fechaInicio} - {viaje.fechaFin}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#324851] mb-1">{viaje.titulo}</h1>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-[#86AC41]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {viaje.destino}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 min-w-[260px]">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Presupuesto ejecutado</span>
            <span className="font-bold text-[#324851]">{porcentajeEjecutado}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-300 ${porcentajeGastoColor(porcentajeEjecutado)}`}
              style={{ width: `${porcentajeEjecutado}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-600">Gastado: <strong>${totalGastado.toLocaleString()}</strong></span>
            <span className="text-slate-600">Total: <strong>${viaje.presupuestoTotal.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setPestanaActiva('itinerario')}
          className={`pb-4 text-base font-bold transition relative ${
            pestanaActiva === 'itinerario'
              ? 'text-[#34675C] border-b-2 border-[#34675C]'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Itinerario Diario
        </button>

        <button
          onClick={() => setPestanaActiva('presupuesto')}
          className={`pb-4 text-base font-bold transition relative ${
            pestanaActiva === 'presupuesto'
              ? 'text-[#34675C] border-b-2 border-[#34675C]'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Control de Presupuesto
        </button>
      </div>

      {/* PESTAÑA 1: ITINERARIO DIARIO */}
      {pestanaActiva === 'itinerario' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#324851]">Cronograma de días</h2>
            <button
              onClick={() => setModalActividad(true)}
              className="bg-[#86AC41] hover:bg-[#6F9635] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              + Agregar Actividad
            </button>
          </div>

          <div className="space-y-6">
            {viaje.itinerario.map((diaObj, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-[#324851]">
                    Día {diaObj.dia} <span className="text-sm font-normal text-slate-500">({diaObj.fecha})</span>
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                    {diaObj.actividades.length} actividades
                  </span>
                </div>

                {diaObj.actividades.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No hay actividades planificadas para este día.</p>
                ) : (
                  <div className="space-y-3">
                    {diaObj.actividades.map((act) => (
                      <div key={act.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#34675C] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            {act.hora}
                          </span>
                          <span className="text-slate-700 text-sm font-medium">{act.descripcion}</span>
                        </div>
                        <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                          {act.categoria}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: CONTROL DE PRESUPUESTO */}
      {pestanaActiva === 'presupuesto' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#324851]">Desglose de Gastos</h2>
            <button
              onClick={() => setModalGasto(true)}
              className="bg-[#86AC41] hover:bg-[#6F9635] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              + Registrar Gasto
            </button>
          </div>

          {/* Tarjetas de Métricas Financieras */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Presupuesto Total</span>
              <span className="text-2xl font-extrabold text-[#324851]">${viaje.presupuestoTotal.toLocaleString()}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Total Gastado</span>
              <span className="text-2xl font-extrabold text-amber-600">${totalGastado.toLocaleString()}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block mb-1">Saldo Disponible</span>
              <span className={`text-2xl font-extrabold ${saldoRestante < 0 ? 'text-red-600' : 'text-[#86AC41]'}`}>
                ${saldoRestante.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Tabla de Gastos */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                  <th className="p-4">Concepto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {viaje.gastos.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-medium text-[#324851]">{gasto.concepto}</td>
                    <td className="p-4">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        {gasto.categoria}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{gasto.fecha}</td>
                    <td className="p-4 text-right font-bold text-[#324851]">${gasto.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL ACTIVIDAD */}
      {modalActividad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-xl font-bold text-[#324851]">Agregar Actividad</h3>
            <form onSubmit={handleAgregarActividad} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Día</label>
                <select
                  value={nuevaActividad.diaIndex}
                  onChange={(e) => setNuevaActividad({ ...nuevaActividad, diaIndex: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {viaje.itinerario.map((d, i) => (
                    <option key={i} value={i}>Día {d.dia} ({d.fecha})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                <input
                  type="time"
                  value={nuevaActividad.hora}
                  onChange={(e) => setNuevaActividad({ ...nuevaActividad, hora: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Visita al Cerro Catedral"
                  value={nuevaActividad.descripcion}
                  onChange={(e) => setNuevaActividad({ ...nuevaActividad, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalActividad(false)} className="px-4 py-2 text-slate-600">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#86AC41] text-white rounded-xl font-semibold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GASTO */}
      {modalGasto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-xl font-bold text-[#324851]">Registrar Gasto</h3>
            <form onSubmit={handleAgregarGasto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Concepto</label>
                <input
                  type="text"
                  placeholder="Ej: Alquiler de auto"
                  value={nuevoGasto.concepto}
                  onChange={(e) => setNuevoGasto({ ...nuevoGasto, concepto: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <select
                  value={nuevoGasto.categoria}
                  onChange={(e) => setNuevoGasto({ ...nuevoGasto, categoria: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  <option value="Alojamiento">Alojamiento</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Comida">Comida</option>
                  <option value="Excursión">Excursión</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monto ($)</label>
                <input
                  type="number"
                  placeholder="15000"
                  value={nuevoGasto.monto}
                  onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalGasto(false)} className="px-4 py-2 text-slate-600">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#86AC41] text-white rounded-xl font-semibold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}