const express= require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const{ isLoggedIn,isOwner,validatelisting} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validatelisting, wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.get("/country",listingController.searchCountry);

router.get("/category",listingController.searchCategory);
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validatelisting,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports= router;