const router = require('express').Router();
const { getOrders } = require('../controller/orders');

const Order = require('../models/Order');
const advancedResults = require('../middleware/advancedResults');

router.route('/').get(
  advancedResults(Order, {
    path: 'product',
    select: 'name'
  }),
  getOrders
);

module.exports = router;
