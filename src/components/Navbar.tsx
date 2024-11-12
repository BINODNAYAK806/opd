import { Menu, Bell, User } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export function Navbar({ onNavigate, currentView }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'patients', label: 'Patients' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'billing', label: 'Billing' },
  ];

  const handleNavigation = (view: string) => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 lg:hidden hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4">
              <h1 className="text-2xl font-bold text-blue-600">MediCare</h1>
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentView === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;