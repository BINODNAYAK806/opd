import express from 'express';
import {
  getPatients,
  createPatient,
  getPatientById,
} from '../controllers/patientController.js';

const router = express.Router();

router.route('/').get(getPatients).post(createPatient);
router.route('/:id').get(getPatientById);

export default router;