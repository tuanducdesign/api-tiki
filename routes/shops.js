const router = require('express').Router();

const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop
} = require('../controller/shops');

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
