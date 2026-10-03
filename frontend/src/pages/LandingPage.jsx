import { Link } from 'react-router-dom';
import iguazuImg from '../assets/cataratas.jpg';
import peritoImg from '../assets/glaciar.jpg';
import jujuyImg from '../assets/quebrada.jpg';
import heroBgImg from '../assets/viaje.jpg';

export default function LandingPage() {
  const destinosDestacados = [
    {
      titulo: 'Cataratas del Iguazú',
      ubicacion: 'Misiones',
      imagen: iguazuImg,
      descripcion: 'Una de las siete maravillas naturales del mundo, rodeada de selva e imponentes saltos de agua.'
    },
    {
      titulo: 'Glaciar Perito Moreno',
      ubicacion: 'Santa Cruz',
      imagen: peritoImg,
      descripcion: 'Siente el rugido de los desprendimientos de hielo en pleno corazón de la Patagonia.'
    },
    {
      titulo: 'Quebrada de Humahuaca',
      ubicacion: 'Jujuy',
      imagen: jujuyImg,
      descripcion: 'Un deslumbrante paisaje multicultural moldeado por cerros de colores y tradiciones ancestrales.'
    }
  ];

  const caracteristicas = [
    {
      titulo: 'Itinerarios personalizados',
      descripcion: 'Organizá tus rutas de viaje adaptadas a tus tiempos, presupuesto y destinos preferidos.'
    },
    {
      titulo: 'Información en tiempo real',
      descripcion: 'Consultá el clima, recomendaciones locales y estado de atracciones al instante.'
    },
    {
      titulo: 'Comunidad viajera',
      descripcion: 'Accedé a reseñas auténticas y consejos de otros exploradores que ya recorrieron el país.'
    }
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section Redondeado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="relative h-[75vh] min-h-[480px] flex items-center justify-center bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/10">
          <img
            src={heroBgImg}
            alt="Paisaje de Argentina"
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />
          
          {/* Sombra sutil interna para dar profundidad en los bordes */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/30 to-slate-950/40"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <span className="text-xs sm:text-sm uppercase tracking-widest font-semibold text-[#86AC41] mb-3 block">
              Descubrí la Argentina
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Planificá tu próxima aventura con ViajAR
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Descubrí destinos increíbles, planificá tus recorridos y guardá todo lo importante para tu próximo viaje en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/registro"
                className="bg-[#86AC41] hover:bg-[#6F9635] text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg text-center"
              >
                Comenzar
              </Link>
              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition text-center"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Destinos Destacados */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#324851] tracking-tight">
            Destinos imperdibles
          </h2>
          <p className="text-slate-600 mt-2">
            Inspirate para tu próximo recorrido por el territorio nacional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinosDestacados.map((destino, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition duration-300 flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={destino.imagen}
                  alt={destino.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                  {destino.ubicacion}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#324851] mb-2">
                  {destino.titulo}
                </h3>
                <p className="text-slate-600 text-sm flex-grow leading-relaxed">
                  {destino.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Características del Sistema */}
      <section className="bg-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#324851] tracking-tight">
              Herramientas pensadas para tu viaje
            </h2>
            <p className="text-slate-600 mt-2">
              Funcionalidades pensadas para hacerte la ruta más fácil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caracteristicas.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="w-12 h-12 bg-[#86AC41]/15 text-[#34675C] rounded-xl flex items-center justify-center font-bold text-lg mb-6">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-bold text-[#324851] mb-2">
                  {item.titulo}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner de Llamado a la Acción */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-[#324851] rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              ¿Listo para armar tu itinerario?
            </h2>
            <p className="text-slate-300 mb-8 font-light leading-relaxed">
              Registrate en segundos para acceder al panel de planificación y empezar a organizar tu ruta.
            </p>
            <Link
              to="/registro"
              className="inline-block bg-[#86AC41] hover:bg-[#6F9635] text-white font-bold px-8 py-3.5 rounded-xl transition shadow-md"
            >
              Crear mi cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}