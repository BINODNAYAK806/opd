import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
export const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find().sort({ registrationDate: -1 });
  res.json(patients);
});

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
export const createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create(req.body);
  res.status(201).json(patient);
});

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});