const router = require('express').Router({ mergeParams: true });
const { getOrders, getOrder } = require('../controller/orders');

const advancedResults = require('../middleware/advancedResults');
const Order = require('../models/Order');

router.route('/').get(
  advancedResults(Order, {
    path: 'product shop user',
    select: 'name'
  }),
  getOrders
);

router.route('/:id').get(getOrder);

module.exports = router;
