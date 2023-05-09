import express from 'express';
import customerController from '../controllers/customer.controller.js';

const router = express.Router();

// get all customers
router.get('/', customerController.getAllCustomers);

// search for a customer by name
router.post('/search', customerController.searchCustomerByName);

// search for a customer by attributes
router.get('/search', customerController.searchCustomerByAttributes);

// get customer by id
router.get('/:id', customerController.getOneCustomer);

// create a new customer
router.post('/create', customerController.createCustomer);

// update a customer by id
router.patch('/:id', customerController.updateCustomer);

// delete a customer by id
router.delete('/:id', customerController.deleteCustomer);

export default router;
