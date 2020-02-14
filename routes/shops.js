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

const { protect } = require('../middleware/auth');

// Include other resource routers
const productRouter = require('./products');
// Reroute into other resoure routers
router.use('/:shopId/products', productRouter);

router
  .route('/')
  .get(advancedResults(Shop, 'products'), getShops)
  .post(protect, createShop);

router
  .route('/:id')
  .get(getShop)
  .put(protect, updateShop)
  .delete(protect, deleteShop);

module.exports = router;
