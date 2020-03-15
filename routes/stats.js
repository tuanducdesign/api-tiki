const router = require('express').Router();
const { getTopSoldProduct } = require('../controller/stats');

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/products').get(getTopSoldProduct);

module.exports = router;
