import express from 'express';
import categoryController from '../controllers/category.controller.js';

const router = express.Router();
// get all categories
router.get('/', categoryController.getCategoryList);

export default router;