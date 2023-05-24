import express from 'express'
import orderController from '../controllers/order.controller.js'

const router = express.Router()

// create(data) (post), url = `${PREFIX}/create`
// delete(id) (delete), url = `${PREFIX}/${id}`
////// update(id, data) (patch), url = `${PREFIX}/${id}`
////// updateCost(id, data) (patch), url = `${PREFIX}/cost/${id}
// getOrderById(id) (get), url = `${PREFIX}/${id}`
// search(name, date) (get), url = `${PREFIX}/search`
// getComboAndDisk(id) (get),  url = `${PREFIX}/combo-and-disk/${id}`
////// getStatistic(data)(get), url = `${PREFIX}/statistic`
// getOrdersBetweenDate(data) (get), url = `${PREFIX}/orderBetweenDate`

router.post('/create', orderController.createOrder);

router.delete('/:id', orderController.deleteByOrderId);

router.put('/:id', orderController.updateOrderById);

router.get('/:id', orderController.getOrderByOrderId);

// router.post('/search', orderController.search);
// router.patch('/cost/:id', orderController.updateCostByOrderId);
// router.get('/orderBetweenDate', orderController.getOrdersBetweenDate);

export default router;