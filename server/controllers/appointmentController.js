import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patientId')
    .sort({ date: 1 });
  res.json(appointments);
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create(req.body);
  const populatedAppointment = await appointment.populate('patientId');
  res.status(201).json(populatedAppointment);
});

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  ).populate('patientId');

  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});