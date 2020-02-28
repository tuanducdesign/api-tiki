const router = require('express').Router({ mergeParams: true });
const { getOrders } = require('../controller/orders');

const Order = require('../models/Order');
const advancedResults = require('../middleware/advancedResults');

router.route('/').get(
  advancedResults(Order),
  getOrders
);

module.exports = router;
