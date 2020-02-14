const router = require('express').Router();
const { register, login, getMe } = require('../controller/auth');

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
