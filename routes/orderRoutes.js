const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/createorder', orderController.createOrder);

module.exports = router;
