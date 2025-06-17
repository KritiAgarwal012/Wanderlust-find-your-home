const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");
module.exports.createReview=async (req,res)=>{
    const {id }= req.params;
    const userId = req.user._id;
    let user= await User.findById(userId);
    let listing = await Listing.findById(id);
    const newReview = new Review (req.body.review);
    newReview.author=req.user._id;
    newReview.listing=listing._id;
    await newReview.save();
    listing.reviews.push(newReview);
    user.reviews.push(newReview);
    await listing.save();
    await user.save();
    req.flash("success","Review Added Successfully!!")
    res.redirect(`/listings/${id}`);

};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}= req.params;
    const userId = req.user._id;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await User.findByIdAndUpdate(userId,{$pull: {reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully!!")
    res.redirect(`/listings/${id}`);
};