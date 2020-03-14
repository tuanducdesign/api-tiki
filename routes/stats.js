const router = require('express').Router();
const { getTopProduct } = require('../controller/stats');

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getTopProduct);

module.exports = router;
