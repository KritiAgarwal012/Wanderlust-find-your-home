const Listing = require("../models/listing");

module.exports.index=async(req,res)=>{
    let listings= await Listing.find();
    // console.log(listings);
    res.render("listings/index.ejs",{listings});
}

module.exports.searchCountry= async(req,res)=>{
    
    let country = req.query.country;
    if(!country){
        return res.redirect("/listings");
    }
    let listings = await Listing.find({country:country});
    console.log(listings);
    if(listings.length==0){
        req.flash("error",`Sorry! no listing available in ${country}`);
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{listings});
}

module.exports.searchCategory= async(req,res)=>{
    
    let category = req.query.category;
    if(!category){
        return res.redirect("/listings");
    }
    let listings = await Listing.find({category:category});
    if(listings.length==0){
        req.flash("error",`Sorry! no listing available in ${category}`);
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{listings});
}
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing=async(req,res)=>{
    let url= req.file.path;
    let filename= req.file.filename;
    console.log(url,filename);
    const newListings= new Listing(req.body.listing);
    newListings.owner = req.user._id;
    newListings.image={url,filename};
    await newListings.save();
    console.log(newListings);
    req.flash("success","New Listing Added!!")
    res.redirect("/listings");
};

module.exports.showListing=async(req,res,next)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing Does Not Exists!!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Does Not Exists!!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing=async(req,res)=>{
    let {id}= req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
        let url= req.file.path;
        let filename= req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    
    req.flash("success","Listing Updated Successfully!!")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!!")
    res.redirect("/listings");
};