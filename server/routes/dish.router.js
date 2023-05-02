import express from 'express';
import dishController from '../controllers/dish.controller.js';

const router = express.Router();

// get all dishes
router.get("/", dishController.getAllDishes);

// get dish by Id
router.get("/:id", dishController.getOneDishById);

// search dish by name
router.post("/search", dishController.searchDishByName);

// create a dish
router.post("/create", dishController.createDish);

// update a dish
router.put("/:id", dishController.updateDish);

// delete by Id
router.delete("/:id", dishController.deleteDishById);

export default router;