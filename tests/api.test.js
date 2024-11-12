// Test Patient Registration
const testPatient = {
  method: 'POST',
  url: 'http://localhost:5000/api/patients',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Doe",
    age: 30,
    gender: "male",
    contact: "1234567890",
    email: "john@example.com",
    address: "123 Main St",
    bloodGroup: "O+"
  })
};

// Test Appointment Creation
const testAppointment = {
  method: 'POST',
  url: 'http://localhost:5000/api/appointments',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientId: "PATIENT_ID", // Replace with actual ID after creating patient
    date: new Date().toISOString(),
    time: "10:00",
    type: "General Checkup",
    notes: "Regular checkup"
  })
};

console.log('Copy these test objects and use them in Thunder Client or Postman');