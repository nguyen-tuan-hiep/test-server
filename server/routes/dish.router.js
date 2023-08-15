import express from 'express';
import dishController from '../controllers/dish.controller.js';

const router = express.Router();

// get all dishes
router.get('/', dishController.getAllDishes);

// search dish by name
router.get('/search', dishController.searchDishByName);

// create a dish
router.post('/create', dishController.createDish);

// get dish by Id
router.get('/:id', dishController.getOneDishById);

// update a dish
router.patch('/:id', dishController.updateDish);

// delete by Id (soft delete)
router.delete('/:id', dishController.deleteDishById);

// getTop5DishesBetweenDate
// router.post('/top5DishesBetweenDate', dishController.getTop5DishesBetweenDate);

export default router;