import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormViajeModal from '../components/FormViajeModal';

export default function MisViajes() {
  const navigate = useNavigate();

  const [viajes, setViajes] = useState(() => {
  const viajesGuardados = localStorage.getItem('viajes');
  

  if (viajesGuardados) {
    return JSON.parse(viajesGuardados);
  }

  return [
    {
      id: 1,
      titulo: 'Aventura en la Patagonia',
      destino: 'San Carlos de Bariloche, Río Negro',
      fechaInicio: '15/11/2026',
      fechaFin: '22/11/2026',
      presupuestoTotal: 450000,
      gastosActuales: 180000,
      estado: 'Planificado',
      itinerario: [
        {
          dia: 1,
          fecha: '15/11/2026',
          actividades: [
            {
              id: 101,
              hora: '10:00',
              descripcion: 'Llegada y check-in en hotel',
              categoria: 'Alojamiento'
            },
            {
              id: 102,
              hora: '15:00',
              descripcion: 'Circuito Chico y punto panorámico',
              categoria: 'Excursión'
            }
          ]
        },
        {
          dia: 2,
          fecha: '16/11/2026',
          actividades: [
            {
              id: 103,
              hora: '09:00',
              descripcion: 'Navegación a Isla Victoria y Bosque de Arrayanes',
              categoria: 'Excursión'
            }
          ]
        }
      ],
      gastos: [
        {
          id: 201,
          concepto: 'Hotel Llao Llao (Reserva)',
          categoria: 'Alojamiento',
          monto: 120000,
          fecha: '15/11/2026'
        },
        {
          id: 202,
          concepto: 'Excursión Circuito Chico',
          categoria: 'Excursión',
          monto: 35000,
          fecha: '15/11/2026'
        },
        {
          id: 203,
          concepto: 'Cena de bienvenida',
          categoria: 'Comida',
          monto: 25000,
          fecha: '15/11/2026'
        }
      ]
    }
  ];
});

  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [viajeAEditar, setViajeAEditar] = useState(null);
  const [viajeAEliminar, setViajeAEliminar] = useState(null);
  const [viajeAFinalizar, setViajeAFinalizar] = useState(null);
  useEffect(() => {
    localStorage.setItem('viajes', JSON.stringify(viajes));
  }, [viajes]);

  const abrirModalNuevo = () => {
    setViajeAEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (viaje) => {
    setViajeAEditar(viaje);
    setModalAbierto(true);
  };

  const eliminarViaje = (id) => {
    const viajesActualizados = viajes.filter((viaje) => viaje.id !== id);

    setViajes(viajesActualizados);
    localStorage.setItem('viajes', JSON.stringify(viajesActualizados));
    setViajeAEliminar(null);
  };

  const finalizarViaje = () => {
    if (!viajeAFinalizar) return;

    const viajesActualizados = viajes.map((v) =>
      v.id === viajeAFinalizar.id
        ? { ...v, estado: 'Finalizado' }
        : v
    );

    setViajes(viajesActualizados);
    localStorage.setItem('viajes', JSON.stringify(viajesActualizados));
    setViajeAFinalizar(null);
  };
  
  const generarItinerario = (fechaInicio, fechaFin) => {
  const [diaInicio, mesInicio, añoInicio] = fechaInicio.split('/');
  const [diaFin, mesFin, añoFin] = fechaFin.split('/');

  const inicio = new Date(añoInicio, mesInicio - 1, diaInicio);
  const fin = new Date(añoFin, mesFin - 1, diaFin);

  const itinerario = [];
  let fechaActual = new Date(inicio);
  let numeroDia = 1;

  while (fechaActual <= fin) {
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const año = fechaActual.getFullYear();

    itinerario.push({
      dia: numeroDia,
      fecha: `${dia}/${mes}/${año}`,
      actividades: []
    });

    fechaActual.setDate(fechaActual.getDate() + 1);
    numeroDia++;
  }

  return itinerario;
};

  const guardarViaje = (datosViaje) => {
    if (viajeAEditar) {
      setViajes(viajes.map(v => v.id === viajeAEditar.id ? { ...v, ...datosViaje } : v));
    } else {
      const nuevoViaje = {
        id: Date.now(),
        ...datosViaje,
        itinerario: generarItinerario(
          datosViaje.fechaInicio,
          datosViaje.fechaFin
        ),
        gastos: []
      };
      setViajes([...viajes, nuevoViaje]);
    }
  };

  const viajesFiltrados = filtroEstado === 'Todos'
    ? viajes
    : viajes.filter(v => v.estado === filtroEstado);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 mb-2 px-3.5 py-2 rounded-xl bg-white border border-[#7DA3A1]/30 text-[#324851] text-sm font-semibold hover:bg-[#34675C] hover:text-white hover:border-[#34675C] shadow-sm hover:shadow transition-all duration-200 group"
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#34675C] mb-1 block">
            Planificación y Control
          </span>
          <h1 className="text-3xl font-bold text-[#324851]">
            Mis Viajes
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Organizá tus itinerarios diarios y gestioná tu presupuesto de viaje.
          </p>
        </div>

        <button
          onClick={abrirModalNuevo}
          className="inline-flex items-center justify-center gap-2 bg-[#86AC41] hover:bg-[#6F9635] text-white font-semibold px-5 py-3 rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Viaje
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
        {['Todos', 'Planificado', 'En curso', 'Finalizado'].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
              filtroEstado === estado
                ? 'bg-[#324851] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {viajesFiltrados.map((viaje) => {

          return (
            <div
              key={viaje.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#7DA3A1]/15 text-[#34675C]">
                    {viaje.estado}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {viaje.fechaInicio} - {viaje.fechaFin}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#324851] mb-1">
                  {viaje.titulo}
                </h3>
                <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-[#86AC41]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {viaje.destino}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/mis-viajes/${viaje.id}`}
                  className="text-sm font-semibold text-[#34675C] hover:text-[#86AC41] transition flex items-center gap-1"
                >
                  Ver itinerario
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>

                <div className="flex items-center gap-1">
                  {viaje.estado !== 'Finalizado' && (
                    <>
                      <button
                        onClick={() => abrirModalEditar(viaje)}
                        className="text-slate-400 hover:text-[#324851] p-1 transition"
                        title="Editar viaje"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8a.75.75 0 01-.92-.92l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>

                      <button
                        onClick={() => setViajeAEliminar(viaje)}
                        className="text-slate-400 hover:text-red-500 p-1 transition"
                        title="Eliminar viaje"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12m-10.5 0v10.75A1.75 1.75 0 009.25 20h5.5a1.75 1.75 0 001.75-1.75V7.5m-7-3h4" />
                        </svg>
                      </button>

                      <button
                        onClick={() => setViajeAFinalizar(viaje)}
                        className="text-slate-400 hover:text-[#86AC41] p-1 transition"
                        title="Finalizar viaje"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {viajeAFinalizar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#86AC41]/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="w-5 h-5 text-[#86AC41]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 12 4 4L19 6"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#324851]">
                  Finalizar viaje
                </h3>
                <p className="text-sm text-slate-500">
                  El viaje quedará marcado como finalizado.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#46565A] mb-6">
              ¿Querés finalizar el viaje{' '}
              <span className="font-semibold text-[#324851]">
                {viajeAFinalizar.titulo}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setViajeAFinalizar(null)}
                className="px-4 py-2 text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={finalizarViaje}
                className="px-4 py-2 bg-[#86AC41] hover:bg-[#6F9635] text-white rounded-xl font-semibold transition"
              >
                Finalizar viaje
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal de Alta y Edición */}
      <FormViajeModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSave={guardarViaje}
        viajeEditar={viajeAEditar}
      />

      {viajeAEliminar && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl">

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-5 h-5 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.07 12.25A1.5 1.5 0 004.52 18.5h14.96a1.5 1.5 0 001.3-2.25L13.71 3.86a1.5 1.5 0 00-2.6 0z"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#324851]">
                Eliminar viaje
              </h3>
              <p className="text-sm text-slate-500">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <p className="text-sm text-[#46565A] mb-6">
            ¿Querés eliminar el viaje{' '}
            <span className="font-semibold text-[#324851]">
              {viajeAEliminar.titulo}
            </span>
            ?
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setViajeAEliminar(null)}
              className="px-4 py-2 text-slate-600 rounded-xl hover:bg-slate-100 transition"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => eliminarViaje(viajeAEliminar.id)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
            >
              Eliminar viaje
            </button>
          </div>

        </div>
      </div>
    )}
    </div>
  );
}