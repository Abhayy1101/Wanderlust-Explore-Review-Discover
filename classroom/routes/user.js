const express=require("express");
const router=express.Router();

//Index route
router.get("",(req,res)=>{
    res.send("GET for users");
});

//show route
router.get("/:id",(req,res)=>{
    res.send("show users");
});

//POST users
router.post("/",(req,res)=>{
    res.send("POST users");
});

//delete route
router.delete("/:id",(req,res)=>{
    res.send("Delete users");
});

module.exports=router;