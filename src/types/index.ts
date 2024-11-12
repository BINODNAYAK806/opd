export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contact: string;
  email: string;
  address: string;
  bloodGroup: string;
  registrationDate: string;
}

export interface Appointment {
  _id: string;
  patientId: Patient;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}