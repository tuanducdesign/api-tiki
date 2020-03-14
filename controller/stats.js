const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get top sold product
// @route   GET /api/v1/stats
// @access  Private/Admin
const getTopProduct = asyncHandler(async (req, res, next) => {
  const result = await Order.aggregate([{ $sortByCount: '$product' }]);
  await Product.populate(result, {
    path: '_id',
    select: 'name',
    populate: { path: 'shop', model: 'Shop', select: 'name' }
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = { getTopProduct };
