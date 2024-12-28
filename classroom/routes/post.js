const express=require("express");
const router=express.Router();

//Index 
router.get("/",(req,res)=>{
    res.send("POST for users");
});

//show 
router.get("/:id",(req,res)=>{
    res.send("posts show users");
});

//POST 
router.post("/",(req,res)=>{
    res.send("POST users");
});

//delete 
router.delete("/:id",(req,res)=>{
    res.send("Delete posts users");
});

module.exports=router;