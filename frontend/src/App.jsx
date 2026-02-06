import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainRoutes from './routes/Mainroutes';
import Preloader from './components/Preloader';
import BackgroundLayout from './components/BackgroundLayout';

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const location = useLocation();

  // Hide preloader after first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Show preloader only on initial load and not on route changes
  if (showPreloader && location.pathname === '/') {
    return <Preloader />;
  }

  return (
    <BackgroundLayout>
      <MainRoutes />
    </BackgroundLayout>
  );
}

export default App;