export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-center py-4 text-sm border-t border-slate-800">
      <p>© {new Date().getFullYear()} ViajAR - Plataforma de Turismo</p>
    </footer>
  );
}