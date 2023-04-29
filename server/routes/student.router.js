const express = require('express');
const { getStudent } = require('../controllers/student.controller');

const router = express.Router();

// get all customers
router.get('/', getStudent);

module.exports = router;
