import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';

function porcentajeGastoColor(porcentaje) {
  if (porcentaje > 90) return 'bg-red-500';
  if (porcentaje > 75) return 'bg-amber-500';
  return 'bg-[#86AC41]';
}

export default function DetalleViaje() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const actividadPendiente = location.state?.actividadPendiente;

const [viaje, setViaje] = useState(() => {
const viajesGuardados = localStorage.getItem('viajes');

  if (viajesGuardados) {
    const viajes = JSON.parse(viajesGuardados);
    const viajeEncontrado = viajes.find((v) => v.id === Number(id));

    if (viajeEncontrado) {
      return {
        ...viajeEncontrado,
        gastos: viajeEncontrado.gastos || [],
        itinerario: viajeEncontrado.itinerario || []
      };
    }
  }

  return null;
});

  const [pestanaActiva, setPestanaActiva] = useState('itinerario');
  const [modalActividad, setModalActividad] = useState(false);
  const [modalGasto, setModalGasto] = useState(false);
  const [actividadAEditar, setActividadAEditar] = useState(null);
  const [actividadAEliminar, setActividadAEliminar] = useState(null);
  const [gastoAEditar, setGastoAEditar] = useState(null);
  const [gastoAEliminar, setGastoAEliminar] = useState(null);
  
  const [nuevaActividad, setNuevaActividad] = useState({ 
    diaIndex: 0, hora: '', 
    descripcion: '', 
    categoria: 'Excursión',
    costo: ''
  });
  const [nuevoGasto, setNuevoGasto] = useState({ 
    concepto: '', 
    categoria: 'Comida', 
    monto: '' 
  });

  useEffect(() => {
    if (actividadPendiente) {
      setNuevaActividad({
        diaIndex: actividadPendiente.diaIndex,
        hora: '',
        descripcion: actividadPendiente.descripcion,
        categoria: actividadPendiente.categoria,
        costo: ''
      });

      setModalActividad(true);
    }
  }, [actividadPendiente]);

  const totalGastado = viaje.gastos.reduce((acc, g) => acc + Number(g.monto), 0);
  const saldoRestante = viaje.presupuestoTotal - totalGastado;
  const porcentajeEjecutado = Math.min(Math.round((totalGastado / viaje.presupuestoTotal) * 100), 100);

const handleAgregarActividad = (e) => {
  e.preventDefault();
  if (!nuevaActividad.descripcion.trim()) return;

  const itinerarioActualizado = [...viaje.itinerario];
  const diaObj = itinerarioActualizado[nuevaActividad.diaIndex];

  if (!diaObj) return;

  const costoActividad = Number(nuevaActividad.costo) || 0;

  if (actividadAEditar) {
    const actividadAnterior = actividadAEditar;

    const actividadActualizada = {
      ...actividadAnterior,
      hora: nuevaActividad.hora || '12:00',
      descripcion: nuevaActividad.descripcion,
      categoria: nuevaActividad.categoria,
      costo: costoActividad
    };

    diaObj.actividades = diaObj.actividades.map((actividad) =>
      actividad.id === actividadAnterior.id
        ? actividadActualizada
        : actividad
    );

    let gastosActualizados = [...(viaje.gastos || [])];

    const gastoAsociado = gastosActualizados.find(
      (gasto) => gasto.actividadId === actividadAnterior.id
    );

    if (gastoAsociado && costoActividad > 0) {
      gastosActualizados = gastosActualizados.map((gasto) =>
        gasto.actividadId === actividadAnterior.id
          ? {
              ...gasto,
              concepto: nuevaActividad.descripcion,
              categoria: nuevaActividad.categoria,
              monto: costoActividad,
              fecha: diaObj.fecha
            }
          : gasto
      );
    }

    if (gastoAsociado && costoActividad === 0) {
      gastosActualizados = gastosActualizados.filter(
        (gasto) => gasto.actividadId !== actividadAnterior.id
      );
    }

    if (!gastoAsociado && costoActividad > 0) {
      gastosActualizados.push({
        id: Date.now(),
        actividadId: actividadAnterior.id,
        concepto: nuevaActividad.descripcion,
        categoria: nuevaActividad.categoria,
        monto: costoActividad,
        fecha: diaObj.fecha
      });
    }

    const totalGastado = gastosActualizados.reduce(
      (acc, gasto) => acc + Number(gasto.monto),
      0
    );

    const viajeActualizado = {
      ...viaje,
      itinerario: itinerarioActualizado,
      gastos: gastosActualizados,
      gastosActuales: totalGastado
    };

    setViaje(viajeActualizado);

    const viajesGuardados =
      JSON.parse(localStorage.getItem('viajes')) || [];

    const viajesActualizados = viajesGuardados.map((v) =>
      v.id === viajeActualizado.id ? viajeActualizado : v
    );

    localStorage.setItem('viajes', JSON.stringify(viajesActualizados));

    setActividadAEditar(null);
  } else {
    const actividadId = Date.now();

    diaObj.actividades.push({
      id: actividadId,
      hora: nuevaActividad.hora || '12:00',
      descripcion: nuevaActividad.descripcion,
      categoria: nuevaActividad.categoria,
      costo: costoActividad
    });

    const gastosActualizados = [...(viaje.gastos || [])];

    if (costoActividad > 0) {
      gastosActualizados.push({
        id: Date.now() + 1,
        actividadId: actividadId,
        concepto: nuevaActividad.descripcion,
        categoria: nuevaActividad.categoria,
        monto: costoActividad,
        fecha: diaObj.fecha
      });
    }

    const totalGastado = gastosActualizados.reduce(
      (acc, gasto) => acc + Number(gasto.monto),
      0
    );

    const viajeActualizado = {
      ...viaje,
      itinerario: itinerarioActualizado,
      gastos: gastosActualizados,
      gastosActuales: totalGastado
    };

    setViaje(viajeActualizado);

    const viajesGuardados =
      JSON.parse(localStorage.getItem('viajes')) || [];

    const viajesActualizados = viajesGuardados.map((v) =>
      v.id === viajeActualizado.id ? viajeActualizado : v
    );

    localStorage.setItem('viajes', JSON.stringify(viajesActualizados));
  }

  setNuevaActividad({
    diaIndex: 0,
    hora: '',
    descripcion: '',
    categoria: 'Excursión',
    costo: ''
  });

  setModalActividad(false);
};

const handleEliminarActividad = (actividadId, diaIndex) => {
  const itinerarioActualizado = [...viaje.itinerario];

  itinerarioActualizado[diaIndex].actividades =
    itinerarioActualizado[diaIndex].actividades.filter(
      (actividad) => actividad.id !== actividadId
    );

  const gastosActualizados = (viaje.gastos || []).filter(
    (gasto) => gasto.actividadId !== actividadId
  );

  const totalGastado = gastosActualizados.reduce(
    (acc, gasto) => acc + Number(gasto.monto),
    0
  );

  const viajeActualizado = {
    ...viaje,
    itinerario: itinerarioActualizado,
    gastos: gastosActualizados,
    gastosActuales: totalGastado
  };

  setViaje(viajeActualizado);

  const viajesGuardados =
    JSON.parse(localStorage.getItem('viajes')) || [];

  const viajesActualizados = viajesGuardados.map((v) =>
    v.id === viajeActualizado.id ? viajeActualizado : v
  );

  localStorage.setItem('viajes', JSON.stringify(viajesActualizados));
};

const handleEliminarGasto = (gastoId) => {
  const gasto = viaje.gastos.find((g) => g.id === gastoId);

  const gastosActualizados = viaje.gastos.filter(
    (g) => g.id !== gastoId
  );

  let itinerarioActualizado = [...viaje.itinerario];

  if (gasto?.actividadId) {
    itinerarioActualizado = itinerarioActualizado.map((dia) => ({
      ...dia,
      actividades: dia.actividades.map((actividad) =>
        actividad.id === gasto.actividadId
          ? {
              ...actividad,
              costo: 0
            }
          : actividad
      )
    }));
  }

  const totalGastado = gastosActualizados.reduce(
    (acc, gasto) => acc + Number(gasto.monto),
    0
  );

  const viajeActualizado = {
    ...viaje,
    gastos: gastosActualizados,
    itinerario: itinerarioActualizado,
    gastosActuales: totalGastado
  };

  setViaje(viajeActualizado);

  const viajesGuardados =
    JSON.parse(localStorage.getItem('viajes')) || [];

  const viajesActualizados = viajesGuardados.map((v) =>
    v.id === viajeActualizado.id ? viajeActualizado : v
  );

  localStorage.setItem(
    'viajes',
    JSON.stringify(viajesActualizados)
  );
};

const handleAgregarGasto = (e) => {
  e.preventDefault();

  if (!nuevoGasto.concepto.trim() || !nuevoGasto.monto) return;

  if (gastoAEditar) {
    const gastosActualizados = viaje.gastos.map((gasto) =>
      gasto.id === gastoAEditar.id
        ? {
            ...gasto,
            concepto: nuevoGasto.concepto,
            categoria: nuevoGasto.categoria,
            monto: Number(nuevoGasto.monto)
          }
        : gasto
    );

    let itinerarioActualizado = [...viaje.itinerario];

    if (gastoAEditar.actividadId) {
      itinerarioActualizado = itinerarioActualizado.map((dia) => ({
        ...dia,
        actividades: dia.actividades.map((actividad) =>
          actividad.id === gastoAEditar.actividadId
            ? {
                ...actividad,
                costo: Number(nuevoGasto.monto)
              }
            : actividad
        )
      }));
    }

    const totalGastado = gastosActualizados.reduce(
      (acc, gasto) => acc + Number(gasto.monto),
      0
    );

    const viajeActualizado = {
      ...viaje,
      gastos: gastosActualizados,
      itinerario: itinerarioActualizado,
      gastosActuales: totalGastado
    };

    setViaje(viajeActualizado);

    const viajesGuardados =
      JSON.parse(localStorage.getItem('viajes')) || [];

    const viajesActualizados = viajesGuardados.map((v) =>
      v.id === viajeActualizado.id ? viajeActualizado : v
    );

    localStorage.setItem(
      'viajes',
      JSON.stringify(viajesActualizados)
    );

    setGastoAEditar(null);
  } else {
    const gastoObj = {
      id: Date.now(),
      concepto: nuevoGasto.concepto,
      categoria: nuevoGasto.categoria,
      monto: Number(nuevoGasto.monto),
      fecha: new Date().toLocaleDateString('es-AR')
    };

    const gastosActualizados = [...viaje.gastos, gastoObj];

    const totalGastado = gastosActualizados.reduce(
      (acc, gasto) => acc + Number(gasto.monto),
      0
    );

    const viajeActualizado = {
      ...viaje,
      gastos: gastosActualizados,
      gastosActuales: totalGastado
    };

    setViaje(viajeActualizado);

    const viajesGuardados =
      JSON.parse(localStorage.getItem('viajes')) || [];

    const viajesActualizados = viajesGuardados.map((v) =>
      v.id === viajeActualizado.id ? viajeActualizado : v
    );

    localStorage.setItem(
      'viajes',
      JSON.stringify(viajesActualizados)
    );
  }

  setNuevoGasto({
    concepto: '',
    categoria: 'Comida',
    monto: ''
  });

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

          {viaje.itinerario.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
              <p className="text-slate-500 text-sm">
                Todavía no hay actividades cargadas para este viaje.
              </p>
            </div>
          ) : (
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
                    <p className="text-slate-400 text-sm italic">
                      No hay actividades planificadas para este día.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {diaObj.actividades.map((act) => (
                        <div key={act.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[#34675C] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                              {act.hora}
                            </span>
                            <span className="text-slate-700 text-sm font-medium">
                              {act.descripcion}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                              {act.categoria}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                setActividadAEditar({
                                  ...act,
                                  diaIndex: idx
                                });
                                setNuevaActividad({
                                  diaIndex: idx,
                                  hora: act.hora,
                                  descripcion: act.descripcion,
                                  categoria: act.categoria,
                                  costo: act.costo || ''
                                });
                                setModalActividad(true);
                              }}
                              className="text-slate-400 hover:text-[#34675C] p-1 transition"
                              title="Editar actividad"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125 16.875 4.5" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActividadAEliminar({ id: act.id, diaIndex: idx })}
                              className="text-slate-400 hover:text-red-500 p-1 transition"
                              title="Eliminar actividad"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0C9.91 2.834 9 3.818 9 5v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: CONTROL DE PRESUPUESTO */}
      {pestanaActiva === 'presupuesto' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#324851]">Desglose de Gastos</h2>
          <button
            onClick={() => {
              setGastoAEditar(null);
              setNuevoGasto({
                concepto: '',
                categoria: 'Comida',
                monto: ''
              });
              setModalGasto(true);
            }}
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
                  <th className="p-4 text-right">Acciones</th>
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

                    <td className="p-4 text-right font-bold text-[#324851]">
                      ${gasto.monto.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => {
                            setGastoAEditar(gasto);
                            setNuevoGasto({
                              concepto: gasto.concepto,
                              categoria: gasto.categoria,
                              monto: gasto.monto
                            });
                            setModalGasto(true);
                          }}
                          className="text-slate-400 hover:text-[#34675C] p-1 transition"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125 16.875 4.5" />
                        </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => setGastoAEliminar(gasto)}
                          className="text-slate-400 hover:text-red-500 p-1 transition"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.682-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0C9.91 2.834 9 3.818 9 5v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        </button>

                      </div>
                    </td>
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
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoría
                </label>

                <select
                  value={nuevaActividad.categoria}
                  onChange={(e) =>
                    setNuevaActividad({
                      ...nuevaActividad,
                      categoria: e.target.value
                    })
                  }
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Costo ($)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={nuevaActividad.costo}
                    onChange={(e) =>
                      setNuevaActividad({
                        ...nuevaActividad,
                        costo: e.target.value
                      })
                    }
                    placeholder="Ej: 25000"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#86AC41] focus:outline-none"
                  />
                </div>
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
            <h3 className="text-xl font-bold text-[#324851]">
              {gastoAEditar ? 'Editar Gasto' : 'Registrar Gasto'}
            </h3>
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

      {/* MODAL ELIMINAR ACTIVIDAD */}
      {actividadAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl">
            
            <h3 className="text-xl font-bold text-[#324851] mb-2">
              ¿Eliminar actividad?
            </h3>

            <p className="text-sm text-slate-500 mb-6">
              Esta actividad se eliminará del itinerario. Si tiene un costo asociado,
              también se eliminará del presupuesto.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActividadAEliminar(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  handleEliminarActividad(
                    actividadAEliminar.id,
                    actividadAEliminar.diaIndex
                  );
                  setActividadAEliminar(null);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
              >
                Eliminar
              </button>
            </div>

          </div>
        </div>
      )}

      {gastoAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl">
            <h3 className="text-xl font-bold text-[#324851] mb-2">
              ¿Eliminar gasto?
            </h3>

            <p className="text-sm text-slate-500 mb-6">
              Este gasto se eliminará del presupuesto.
              {gastoAEliminar.actividadId &&
                ' Si está asociado a una actividad, la actividad permanecerá en el itinerario pero sin costo asociado.'}
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setGastoAEliminar(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  handleEliminarGasto(gastoAEliminar.id);
                  setGastoAEliminar(null);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}