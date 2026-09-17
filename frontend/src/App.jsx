import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

function AppContent() {
  const location = useLocation();

  const mostrarNavbar = true;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {mostrarNavbar && <Navbar />}

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;