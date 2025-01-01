const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

const {listingSchema,reviewSchema}=require("./schema.js");

const Review=require("./models/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);


app.use(express.static(path.join(__dirname,"/public")));

const session=require("express-session");
const flash=require("connect-flash");
async function main() {

    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')   
}

main()
.then(()=>{
    console.log("Connection successful");
})
.catch(err => console.log(err));


const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true ,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    } ,
};

app.get("/",(req,res)=>{
    res.send("Hi,I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
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



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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

