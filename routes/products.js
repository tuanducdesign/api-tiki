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

router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'shop',
      select: 'name description'
    }),
    getProducts
  )
  .post(addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
