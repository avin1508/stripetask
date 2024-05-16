const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/create',customerController.createCustomer);
router.post('/login',customerController.loginCustomer);

module.exports = router;

