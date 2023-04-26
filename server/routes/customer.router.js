const express = require("express");
const customerController = require("../controllers/customer.controller");

const router = express.Router();

// get all customers
router.get("/", customerController.getAllCustomers);

// get one customer
router.get("/:id", customerController.getOneCustomer);

// insert customers
router.post("/", customerController.createCustomer);

// update a customer
router.put("/:id", customerController.updateCustomer);

// delete a customer
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
