const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/user");

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    listing:{
        type:Schema.Types.ObjectId,
        ref:"Listing",
    },
    created_at:{
        type:Date,
        default:Date.now(),
    }
})

const Review = mongoose.model("Review",reviewSchema);
module.exports= Review;