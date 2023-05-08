const express = require('express');
const router = express.Router();

const customerRoutes = require('./customer');

// Add routes to router
router.use('/api', customerRoutes);

module.exports = router;
