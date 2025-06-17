const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const Review = require("./review.js")
const Listing= require("./listing.js");
const passportlocalmongoose= require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    listings:[
        {
            type:Schema.Types.ObjectId,
            ref:"Listing"
        }
    ]
});

userSchema.plugin(passportlocalmongoose);
const User = mongoose.model("User",userSchema);
module.exports=User;