import express from 'express';
import customerController from '../controllers/customer.controller.js';

const router = express.Router();

// get all customers
router.get('/', customerController.getAllCustomers);

// get customer by id
router.get('/:id', customerController.getOneCustomer);

// create a new customer
router.post('/create', customerController.createCustomer);

// update a customer by id
router.put('/:id', customerController.updateCustomer);

// delete a customer by id
router.delete('/:id', customerController.deleteCustomer);

// search for a customer by name
router.post('/search', customerController.searchCustomerByName);

export default router;
