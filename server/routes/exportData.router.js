import express from 'express';
import exportDataController from '../controllers/exportData.controller.js';

const router = express.Router();

router.get('/', exportDataController.exportData);

export default router;
