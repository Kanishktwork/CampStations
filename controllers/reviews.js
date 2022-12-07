const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReviews=async(req, res)=>{
    const campground= await Campground.findById(req.params.id);
    // console.log(req.params.id);          ERROR FIXED OF NULL WITH MERGEPARAMS
  
    const review= new Review(req.body.review);
    review.author= req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    // console.log(review);
    req.flash('success','Successfully added a new review');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReviews=async(req, res)=>{
    const{id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{ reviews:reviewId }})
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success','Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
}