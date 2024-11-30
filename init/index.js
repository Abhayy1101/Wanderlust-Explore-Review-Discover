const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
//here .. means one step back as models is in another folder so we write it

async function main() {

    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust') ;  
}

main()
.then(()=>{
    console.log("Connection successful");
})
.catch(err => console.log(err));

const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    //here initdat is object and .data is a key from data.js(module.exports)
    console.log("Data was initialized");
};

initDB();//calling above anonymous function