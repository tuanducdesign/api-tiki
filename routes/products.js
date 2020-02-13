const router = require('express').Router();
const { getProducts } = require('../controller/products');

router.route('/').get(getProducts);

module.exports = router;
