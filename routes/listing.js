const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");



const validateListing=(req,res,next)=>
    {
        let {error}=listingSchema.validate(req.body);
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
       else{
        next();
       }
    }

//1) Index Route
router.get("/",wrapAsync(async (req,res)=>{

    let alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings});

}));

//New Route
router.get("/new", (req,res)=>{ 
    res.render("listings/new.ejs");

});


//Show Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const all=await Listing.findById(id).populate("reviews");//it will give all information of specific record
    res.render("listings/show.ejs",{all});

}));


//Create Route
router.post("/",validateListing, wrapAsync(async (req,res,next)=>{
    
        if(! req.body.listing){
            throw new ExpressError(400,"Send valid data for listing");
            //this will work when you will send post request through hoppscotch and in body not send any data
        }
        console.log(req.body.listing);//another method see name field of each input value in new.ejs
        let newListing=new Listing(req.body.listing);


        //Validation for Schema
        // if(!newListing.title){
        //     throw new ExpressError(400,"Title is missing");
        // }

        // if(!newListing.description){
        //     throw new ExpressError(400,"Description is missing");
        // }

        // if(!newListing.location){
        //     throw new ExpressError(400,"LOcation is missing");
        // }

        //No need to write above code as below we have written code alternate to above

        // let result=listingSchema.validate(req.body);
        // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400,result.error);
        // }

        //instead of above code we have written function which handles above responsibility line 51


        await newListing.save();
        res.redirect("/listings");
    }));


//Edit Route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));

//Update Route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

}));

//Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");

}));


module.exports=router;