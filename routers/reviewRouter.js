const express = require('express');

const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const reviewRouter = express.Router({ mergeParams: true });

// POST /tours/21321412/reviews
// GET /tours/21321412/reviews

reviewRouter.use(authController.protect);

reviewRouter
  .route('/')
  .post(
    authController.restricTo('user'),
    reviewController.setReviewUserId,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

reviewRouter
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restricTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restricTo('user', 'admin'),
    reviewController.updateReview
  );

module.exports = reviewRouter;
