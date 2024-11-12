import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PatientRegistration } from './components/PatientRegistration';
import { PatientList } from './components/PatientList';
import { AppointmentScheduling } from './components/AppointmentScheduling';
import { Billing } from './components/Billing';

export function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientList onAddNew={() => setCurrentView('patient-registration')} />;
      case 'patient-registration':
        return <PatientRegistration onBack={() => setCurrentView('patients')} />;
      case 'appointments':
        return <AppointmentScheduling />;
      case 'billing':
        return <Billing />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Navbar onNavigate={setCurrentView} currentView={currentView} />
      <main className="container mx-auto py-6 px-4">
        {renderView()}
      </main>
    </div>
  );
}

export default App;