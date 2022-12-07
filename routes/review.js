const express=require('express');
const router= express.Router({mergeParams:true});

// const Campground = require('../models/campground');
// const Review = require('../models/review');

const catchAsync= require('../utilities/catchAsync');
const {isLoggedIn,validateReviews,isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post("/",isLoggedIn, validateReviews, catchAsync(reviews.createReviews));

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReviews));

module.exports=router;