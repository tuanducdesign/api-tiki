const router = require('express').Router({ mergeParams: true });
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controller/products');

const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/Product');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'shop',
      select: 'name description'
    }),
    getProducts
  )
  .post(protect, authorize('seller', 'admin'), addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('seller', 'admin'), updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

module.exports = router;
