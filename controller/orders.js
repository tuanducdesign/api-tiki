const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all orders
// @route   GET /api/v1/orders
// @route   GET /api/v1/shops/:shopId/orders
// @access  Private/ Admin
const getOrders = asyncHandler(async (req, res, next) => {
  if (req.params.shopId) {
    const orders = await Order.find({ 'cart.shop': req.params.shopId });
    // return res.status(200).json({
    //   success: true,
    //   total: orders.length,
    //   data: orders
    // });
    return res.status(200).json({
      data: "hello"
    })
  } else {
    res.status(200).json(res.advancedResults);
  }
});

module.exports = {
  getOrders
};
