const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get top sold product
// @route   GET /api/v1/stats
// @access  Private/Admin
const getTopSoldProduct = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit || 5);
  let result;

  if (req.query.sort === 'order') {
    result = await Order.aggregate([
      { $sortByCount: '$product' },
      { $limit: limit }
    ]);
  } else {
    result = await Order.aggregate([
      {
        $group: {
          _id: '$product',
          'soldQuantity': { $sum: '$quantity' }
        }
      },
      { $sort: { soldQuantity: -1 } },
      { $limit: limit }
    ]);
  }

  await Product.populate(result, {
    path: '_id',
    select: 'name',
    populate: { path: 'shop', model: 'Shop', select: 'name' }
  });

  result.forEach(item => {
    item.name = item._id.name;
    item.shop = item._id.shop.name;
    item._id = item._id._id;
  });

  res.status(200).json({
    success: true,
    total: limit,
    data: result
  });
});

module.exports = { getTopSoldProduct };
