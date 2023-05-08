const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const customerController = new CustomerController();

// POST /customer/login
router.post('/login', customerController.login);

module.exports = router;
