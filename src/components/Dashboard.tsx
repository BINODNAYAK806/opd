import { Activity, Users, Calendar, CreditCard } from 'lucide-react';




export function Dashboard() {
  const stats = [
    { title: 'Total Patients', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: 'Today\'s Appointments', value: '28', icon: Calendar, color: 'bg-green-500' },
    { title: 'Revenue (Today)', value: '₹45,670', icon: CreditCard, color: 'bg-purple-500' },
    { title: 'Active Cases', value: '156', icon: Activity, color: 'bg-yellow-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${item.color} rounded-md p-3`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.title}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;