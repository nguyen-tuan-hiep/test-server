const express = require('express');
const router = express.Router();
const exportData = require('../controllers/exportData.controller');

router.get('/', exportData);

module.exports = router;
