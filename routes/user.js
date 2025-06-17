const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController= require("../controller/user.js");
const { populate } = require("../models/review.js");


router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        
        saveRedirectUrl
        ,passport.authenticate("local",{
            failureRedirect:"/login",
            failureFlash:true
        })
        ,userController.login);


router.get("/logout",userController.logout);

router.get("/userProfile/:id",isLoggedIn,userController.userProfile);
module.exports =router;