import { useState } from 'react';
import { DollarSign } from 'lucide-react';

export function Billing() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <DollarSign className="h-5 w-5 mr-2" />
          New Bill
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Billing interface coming soon...</p>
      </div>
    </div>
  );
}

export default Billing;