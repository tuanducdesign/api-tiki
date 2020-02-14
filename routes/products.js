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

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'shop',
      select: 'name description'
    }),
    getProducts
  )
  .post(protect, addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
