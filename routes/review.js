const express= require("express");
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing= require("../models/listing.js");
const {isLoggedIn,isReviewAuthor,validatereview} = require("../middleware.js");
const reviewController = require("../controller/review.js");

//create review
router.post("/",isLoggedIn,validatereview,isLoggedIn,wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewController.destroyReview);

module.exports= router;
