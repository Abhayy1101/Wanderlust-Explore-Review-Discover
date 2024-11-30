const mongoose=require("mongoose");
const {Schema}=mongoose;
const Review=require("./review.js");

const listingSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1618385044176-e2100a381a37?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //it sets defalut value if we dont mention image field

        set:(v)=>v===""?"https://images.unsplash.com/photo-1618385044176-e2100a381a37?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,

        // set is function which sets default link of image if image url is not send the link is copied from unsplash images online
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;