const Shop = require('../models/Shop');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all shops
// @route   GET /api/v1/shops
// @access  Public
const getShops = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  // Select only field from query
  const removeFields = ['select', 'sort', 'page', 'limit'];
  // Remove removeFields from reqQuery
  removeFields.forEach(item => delete reqQuery[item]);

  let queryString = JSON.stringify(reqQuery);

  // Add $ to query string --> it become mongodb query
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  let query = Shop.find(JSON.parse(queryString));

  // Select query
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // Sorting query
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Default sorting by createdAt
    query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Shop.countDocuments();

  query.skip(startIndex).limit(limit);

  // Execute the query
  const shops = await query;

  // Paginating the result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    total: shops.length,
    pagination: pagination,
    data: shops
  });
});

// @desc    Get single shop
// @route   GET /api/v1/shops/:id
// @access  Public
const getShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) {
    return next(
      new ErrorResponse(`Shop not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: shop
  });
});

// @desc    Create new shop
// @route   POST /api/v1/shops
// @access  Private
const createShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.create(req.body);

  res.status(201).json({
    success: true,
    data: shop
  });
});

// @desc    Update shop
// @route   PUT /api/v1/shops/:id
// @access  Private
const updateShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!shop) {
    return next(
      new ErrorResponse(`Shop not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: shop
  });
});

// @desc    Delete shop
// @route   DELETE /api/v1/shops/:id
// @access  Private
const deleteShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findByIdAndDelete(req.params.id);

  if (!shop) {
    next(new ErrorResponse(`Shop not found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = { getShops, getShop, createShop, updateShop, deleteShop };
