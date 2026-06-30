const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js');
const { createOrder, getUserOrders, getCarriers, getOrderById } = require('../controllers/orderController');

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);
router.get('/carriers', verifyToken, getCarriers);
router.get('/:id', verifyToken, getOrderById);

module.exports = router;