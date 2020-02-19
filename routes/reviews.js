const router = require('express').Router({ mergeParams: true });
const { getReviews, getReview } = require('../controller/reviews');

const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(
  advancedResults(Review, {
    path: 'product',
    select: 'name'
  }),
  getReviews
);

router.route('/:id').get(getReview);

module.exports = router;
