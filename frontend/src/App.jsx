import { useState, useEffect } from 'react';
import MainRoutes from './routes/Mainroutes';
import Preloader from './components/Preloader';
import BackgroundLayout from './components/BackgroundLayout';

function App() {
  const [showPreloader, setShowPreloader] = useState(() => {
    // Check if preloader has been shown in this session
    const hasShownPreloader = sessionStorage.getItem('preloaderShown');
    return !hasShownPreloader;
  });

  // Hide preloader after first load and mark it as shown
  useEffect(() => {
    if (showPreloader) {
      const timer = setTimeout(() => {
        setShowPreloader(false);
        sessionStorage.setItem('preloaderShown', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPreloader]);

  // Show preloader only once per session
  if (showPreloader) {
    return <Preloader />;
  }

  return (
    <BackgroundLayout>
      <MainRoutes />
    </BackgroundLayout>
  );
}

export default App;