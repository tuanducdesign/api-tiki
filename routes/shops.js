const router = require('express').Router();

const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop
} = require('../controller/shops');

// Include other resource routers
const productRouter = require('./products');
// Reroute into other resoure routers
router.use('/:shopId/products', productRouter);

router
  .route('/')
  .get(getShops)
  .post(createShop);

router
  .route('/:id')
  .get(getShop)
  .put(updateShop)
  .delete(deleteShop);

module.exports = router;
