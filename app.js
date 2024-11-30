const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

const {listingSchema,reviewSchema}=require("./schema.js");

const Review=require("./models/review.js");
const listings=require("./routes/listing.js");


const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);


app.use(express.static(path.join(__dirname,"/public")));
async function main() {

    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')   
}

main()
.then(()=>{
    console.log("Connection successful");
})
.catch(err => console.log(err));

app.get("/",(req,res)=>{
    res.send("Hi,I am root");
});

//adding document to listing using get request/

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful testing")
// });


const validateReview=(req,res,next)=>
    {
        let {error}=reviewSchema.validate(req.body);
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
       else{
        next();
       }
    }

app.use("/listings",listings);

//Reviews
// Post Review Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
   let newReview=new Review(req.body.review);

   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//Post Review delete
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);

}));






//here if any request will not be matched then we will throw custom error
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});


//custom error handler
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});

