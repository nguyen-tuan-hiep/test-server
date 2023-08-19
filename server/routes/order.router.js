import express from 'express';
import orderController from '../controllers/order.controller.js';

const router = express.Router();

router.get('/search', orderController.search);

router.post('/create', orderController.createOrder);

router.delete('/:id', orderController.deleteByOrderId);

router.put('/:id', orderController.updateOrderById);

router.get('/:id', orderController.getOrderByOrderId);

// Get dishes by order id
router.get('/:id/dishes', orderController.getDishesByOrderId);

// router.patch('/cost/:id', orderController.updateCostByOrderId);
// router.get('/orderBetweenDate', orderController.getOrdersBetweenDate);

export default router;
