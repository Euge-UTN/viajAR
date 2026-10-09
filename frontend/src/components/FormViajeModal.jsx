import { useState, useEffect } from 'react';

export default function FormViajeModal({ isOpen, onClose, onSave, viajeEditar }) {
  const [formData, setFormData] = useState({
    titulo: '',
    destino: '',
    fechaInicio: '',
    fechaFin: '',
    presupuestoTotal: '',
    estado: 'Planificado'
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (viajeEditar) {
      setFormData({
        titulo: viajeEditar.titulo || '',
        destino: viajeEditar.destino || '',
        fechaInicio: viajeEditar.fechaInicio || '',
        fechaFin: viajeEditar.fechaFin || '',
        presupuestoTotal: viajeEditar.presupuestoTotal || '',
        estado: viajeEditar.estado || 'Planificado'
      });
    } else {
      setFormData({
        titulo: '',
        destino: '',
        fechaInicio: '',
        fechaFin: '',
        presupuestoTotal: '',
        estado: 'Planificado'
      });
    }
    setError('');
  }, [viajeEditar, isOpen]);

  if (!isOpen) return null;

  const formatFechaMostrar = (fechaISO) => {
    if (!fechaISO) return '';
    if (fechaISO.includes('/')) return fechaISO;
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatFechaInput = (fechaEsp) => {
    if (!fechaEsp || !fechaEsp.includes('/')) return fechaEsp;
    const [day, month, year] = fechaEsp.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.titulo.trim() || !formData.destino.trim() || !formData.fechaInicio || !formData.fechaFin || !formData.presupuestoTotal) {
      setError('Por favor, completá todos los campos obligatorios.');
      return;
    }

      if (Number(formData.presupuestoTotal) <= 0) {
      setError('El presupuesto debe ser mayor a 0.');
      return;
    }

    onSave({
      ...formData,
      fechaInicio: formatFechaMostrar(formData.fechaInicio),
      fechaFin: formatFechaMostrar(formData.fechaFin),
      presupuestoTotal: Number(formData.presupuestoTotal),
      gastosActuales: viajeEditar ? viajeEditar.gastosActuales : 0,
      itinerario: viajeEditar ? viajeEditar.itinerario : [],
      gastos: viajeEditar ? viajeEditar.gastos || [] : []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 sm:p-8 relative">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#324851]">
            {viajeEditar ? 'Editar Viaje' : 'Nuevo Viaje'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título del viaje
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ej: Escapada a Mendoza"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#86AC41] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Destino
            </label>
            <input
              type="text"
              value={formData.destino}
              onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
              placeholder="Ej: San Rafael, Mendoza"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#86AC41] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fecha de inicio
              </label>
              <input
                type="date"
                value={formatFechaInput(formData.fechaInicio)}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#86AC41] focus:outline-none text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fecha de fin
              </label>
              <input
                type="date"
                min={formatFechaInput(formData.fechaInicio)}
                value={formatFechaInput(formData.fechaFin)}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#86AC41] focus:outline-none text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Presupuesto Total ($)
              </label>
              <input
                type="number"
                min="0"
                value={formData.presupuestoTotal}
                onChange={(e) => setFormData({ ...formData, presupuestoTotal: e.target.value })}
                placeholder="350000"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#86AC41] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#86AC41] focus:outline-none bg-white text-slate-700"
              >
                <option value="Planificado">Planificado</option>
                <option value="En curso">En curso</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#86AC41] hover:bg-[#6F9635] text-white rounded-xl transition font-semibold"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}