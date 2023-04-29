import express from 'express';
import customerController from '../controllers/customer.controller.js';

const router = express.Router();

// get all customers
router.get('/', customerController.getAllCustomers);

// get one customer
router.get('/:id', customerController.getOneCustomer);

// insert a customer
router.post('/', customerController.createCustomer);

// update a customer
router.put('/:id', customerController.updateCustomer);

// delete a customer
router.delete('/:id', customerController.deleteCustomer);

export default router;
