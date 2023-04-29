import express from 'express';
import studentController from '../controllers/student.controller.js';

const router = express.Router();

// get all customers
router.get('/', studentController.getStudent);

export default router;
