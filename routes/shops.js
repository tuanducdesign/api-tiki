const router = require('express').Router();

const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop
} = require('../controller/shops');

const advancedResults = require('../middleware/advancedResults');
const Shop = require('../models/Shop');

// Include other resource routers
const productRouter = require('./products');
// Reroute into other resoure routers
router.use('/:shopId/products', productRouter);

router
  .route('/')
  .get(advancedResults(Shop, 'products'), getShops)
  .post(createShop);

router
  .route('/:id')
  .get(getShop)
  .put(updateShop)
  .delete(deleteShop);

module.exports = router;
