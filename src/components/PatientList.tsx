import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, FileText, Printer } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { Patient } from '../types';
import jsPDF from 'jspdf';
import { EditPatientModal } from './EditPatientModal';

interface PatientListProps {
  onAddNew: () => void;
}

export function PatientList({ onAddNew }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to fetch patients');
      console.error('Error fetching patients:', error);
    }
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    fetchPatients(); // Refresh the list
    toast.success('Patient list updated');
  };

  const handleDelete = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`/api/patients/${patientId}`);
        toast.success('Patient deleted successfully');
        fetchPatients(); // Refresh the list
      } catch (error) {
        toast.error('Failed to delete patient');
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handlePrintSticker = (patient: Patient) => {
    // Validate required fields
    if (!patient.name || !patient.age || !patient.gender || !patient.contact) {
      toast.error('Missing required patient information for sticker');
      return;
    }

    try {
      // Create new PDF document
      const doc = new jsPDF({
        format: 'a7',
        unit: 'mm',
        orientation: 'landscape'
      });

      // Set background color (light blue tint)
      doc.setFillColor(240, 248, 255);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

      // Add decorative header bar
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 15, 'F');

      // Add hospital name in white on blue background
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('CITY HOSPITAL', doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

      // Reset text color to dark blue for patient details
      doc.setTextColor(0, 51, 102);
      
      // Add patient details with better formatting
      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      // Create two columns
      const leftColumn = [
        { label: 'Patient Name', value: patient.name },
        { label: 'Age/Gender', value: `${patient.age} / ${patient.gender.toUpperCase()}` },
      ];

      const rightColumn = [
        { label: 'Contact', value: patient.contact },
        { label: 'Blood Group', value: patient.bloodGroup || 'N/A' },
      ];

      // Position for left column
      let yPosition = 25;
      leftColumn.forEach(item => {
        // Label in regular font
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(item.label + ':', 10, yPosition);
        
        // Value in bold font
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(item.value, 10, yPosition + 5);
        
        yPosition += 15;
      });

      // Position for right column
      yPosition = 25;
      rightColumn.forEach(item => {
        // Label in regular font
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(item.label + ':', doc.internal.pageSize.getWidth() / 2 + 5, yPosition);
        
        // Value in bold font
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(item.value, doc.internal.pageSize.getWidth() / 2 + 5, yPosition + 5);
        
        yPosition += 15;
      });

      // Add date at the bottom
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text(`Date: ${formattedDate}`, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 5, { align: 'right' });

      // Add a subtle border
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.5);
      doc.rect(3, 3, doc.internal.pageSize.getWidth() - 6, doc.internal.pageSize.getHeight() - 6, 'S');

      // Add corner decorations
      const cornerSize = 3;
      [
        [3, 3], // Top left
        [doc.internal.pageSize.getWidth() - 3, 3], // Top right
        [3, doc.internal.pageSize.getHeight() - 3], // Bottom left
        [doc.internal.pageSize.getWidth() - 3, doc.internal.pageSize.getHeight() - 3] // Bottom right
      ].forEach(([x, y]) => {
        doc.circle(x, y, cornerSize, 'S');
      });

      // Download the PDF
      const fileName = `${patient.name.replace(/\s+/g, '-')}-sticker-${formattedDate.replace(/\s+/g, '-')}.pdf`;
      doc.save(fileName.toLowerCase());
      toast.success('Sticker generated successfully');
    } catch (error) {
      console.error('Error generating sticker:', error);
      toast.error('Failed to generate sticker');
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={onAddNew}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Patient
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => {
                return (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.age} years</div>
                      <div className="text-sm text-gray-500 capitalize">{patient.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.contact}</div>
                      <div className="text-sm text-gray-500">{patient.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {patient.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(patient.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handlePrintSticker(patient)}
                          className="text-purple-600 hover:text-purple-900 transition-colors duration-200 p-1 rounded-full hover:bg-purple-100"
                          title="Print Sticker"
                        >
                          <Printer className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(patient)}
                          className="text-green-600 hover:text-green-900 transition-colors duration-200 p-1 rounded-full hover:bg-green-100"
                          title="Edit Patient"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(patient._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
                          title="Delete Patient"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPatient && (
        <EditPatientModal
          patient={selectedPatient}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPatient(null);
          }}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
}