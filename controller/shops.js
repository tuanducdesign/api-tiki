// @desc    Get all shops
// @route   GET /api/v1/shops
// @access  Public
const getShops = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Get all shops'
  });
};

// @desc    Get single shop
// @route   GET /api/v1/shops/:id
// @access  Public
const getShop = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: `Get shop with id ${req.params.id}`
  });
};

// @desc    Create new shop
// @route   POST /api/v1/shops
// @access  Private
const createShop = (req, res, next) => {
  res.status(201).json({
    success: true,
    message: 'Create a new shop'
  });
};

// @desc    Update shop
// @route   PUT /api/v1/shops/:id
// @access  Private
const updateShop = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: `Update shop with id ${req.params.id}`
  });
};

// @desc    Update shop
// @route   DELETE /api/v1/shops/:id
// @access  Private
const deleteShop = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: `Delete shop with id ${req.params.id}`
  });
};

module.exports = { getShops, getShop, createShop, updateShop, deleteShop };
