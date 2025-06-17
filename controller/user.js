const User = require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res,next)=>{
    try{
        let {email,username,password}= req.body;
        let user =new User({ email , username })
        const registeredUser= await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err)
                return next(err);
            req.flash("success",`Welcome to Wanderlust, ${username}`);
            res.redirect("/listings");
        })
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    
    req.flash("success",`Welcome Back  to Wanderlust`);
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.flash("error", "You are already Logged out");
        return res.redirect("/listings");
    }
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully Logged out");
    res.redirect("/listings");
    })
    
};

module.exports.userProfile=async(req,res)=>{
    let {id} = req.params;
    let user= await User.findById(id)
    .populate(
        {
            path:"reviews",
            populate:{path:"author"}
        })
    .populate(
        {
            path:"listings",
            populate:[
                {
                    path:"reviews",
                    populate:{path:"author"}
                },
                {
                    path:"owner"
                }
            ]
        });
    res.render("users/profile.ejs",{user});
};