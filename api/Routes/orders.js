const express = require("express");
const OrdersController = require('../Controllers/orders.controller');
const checkAuth = require('../Middleware/check-auth');
const router = express.Router();


/**
 *  getting all orders
 */
router.get('/', checkAuth, OrdersController.orders_get_all);

/**
 *  creating order
 */
router.post('/', checkAuth, OrdersController.createOrder);

/**
 *  getting all orders by id
 */
router.get('/:orderId', checkAuth, OrdersController.getOrderById);

/**
 *  delete orders by id
 */
router.delete('/:orderId', checkAuth, OrdersController.deleteOrderById);

module.exports = router;