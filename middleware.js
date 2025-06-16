const Listing= require("./models/listing.js");
const Review= require("./models/review.js");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressErrors.js");
const {listingSchema,reviewSchema}= require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please Login to proceed further!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
   console.log(listing);
    if (listing.owner._id.toString() !== res.locals.currUser._id.toString()) {
        req.flash("error", "You don't have authorization to manipulate this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if(review.author._id.toString()!==res.locals.currUser._id.toString()){
        req.flash("error","You are not authorised to alter or delete this review!!!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};