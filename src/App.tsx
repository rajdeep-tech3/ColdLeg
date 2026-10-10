import { AppProvider, useApp } from '@/context/AppContext';
import { Landing } from '@/pages/Landing';
import { FarmerAuth } from '@/pages/FarmerAuth';
import { FarmerDashboard } from '@/pages/FarmerDashboard';
import { DriverAuth } from '@/pages/DriverAuth';
import { DriverDashboard } from '@/pages/DriverDashboard';

function AppRouter() {
  const { portal, currentFarmer, currentDriver } = useApp();

  if (!portal) return <Landing />;

  if (portal === 'farmer') {
    if (!currentFarmer) return <FarmerAuth />;
    return <FarmerDashboard />;
  }

  if (portal === 'driver') {
    if (!currentDriver) return <DriverAuth />;
    return <DriverDashboard />;
  }

  return <Landing />;
}

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
