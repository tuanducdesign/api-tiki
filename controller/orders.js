const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all orders
// @route   GET /api/v1/orders
// @route   GET /api/v1/shops/:shopId/orders
// @access  Private/ Seller - Admin
const getOrders = asyncHandler(async (req, res, next) => {
  if (req.params.shopId) {
    let orders = await Order.find({ shop: req.params.shopId });

    return res.status(200).json({
      success: true,
      total: orders.length,
      data: orders
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Public
const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: 'product shop',
    select: 'name'
  });

  if (!order) {
    return next(
      new ErrorResponse(`No order found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

module.exports = {
  getOrders,
  getOrder
};
