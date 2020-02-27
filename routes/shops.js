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

const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const productRouter = require('./products');
const orderRouter = require('./orders');
// Reroute into other resoure routers
router.use('/:shopId/products', productRouter);
router.use('/:shopId/orders', orderRouter);

router
  .route('/')
  .get(advancedResults(Shop, 'products'), getShops)
  .post(protect, authorize('seller', 'admin'), createShop);

router
  .route('/:id')
  .get(getShop)
  .put(protect, authorize('seller', 'admin'), updateShop)
  .delete(protect, authorize('seller', 'admin'), deleteShop);

module.exports = router;
