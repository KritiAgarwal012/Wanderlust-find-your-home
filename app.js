if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}


const express = require("express");
const mongoose = require("mongoose");
const app= express();
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError= require("./utils/ExpressErrors.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash =require("connect-flash")
const passport = require("passport");
const LocalSrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js")
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const dbUrl = process.env.ATLASDB_URL;
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

main().then(()=>{
    console.log("connection sucessful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("error in mongo store:",err);
});


const sessionOptions= {
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expiry:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalSrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.redirect("/listings");
})
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser= req.user;
    next();
})
app.get("/demouser", async (req,res)=>{
    let fake = new User({
        email:"fake@gmail.com",
        username:"fake human",
    });

    const newuser=await User.register(fake,"helloworld");
    res.send(newuser);
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(400,"Not a route!!"))
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}= err;
    res.status(statusCode).render("error.ejs",{message});
})
// server is listening...
app.listen(8080,()=>{
    console.log("server is listening");
})
