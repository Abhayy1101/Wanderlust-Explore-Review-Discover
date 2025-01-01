const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");

const cookieParser=require("cookie-parser");

const session=require("express-session");
const flash=require("connect-flash");

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(cookieParser("secretcode"));



const sessionOptions={
    secret:"mysupersecretkey",
    resave: false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));

app.use(flash());

//middleware for res.locals
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

//express sesssions
app.get("/test",(req,res)=>{
    res.send("test successfull!!");
});

app.get("/reqcount",(req,res)=>{
    if(req.session.count)
    {
        req.session.count++;
    }
    else
    {
        req.session.count=1;
    }
    res.send(`You send the request for ${req.session.count} times`);
});

//Storing and using session info
app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous")
    {
        req.flash("error","user not registered");
    }
    else{
        
        req.flash("success","user registered successfully");
    }
   
    res.redirect("/hello");

});

app.get("/hello",(req,res)=>{

    // res.render("page.ejs" , {name:req.session.name,msg: req.flash("success")}); this line for using connect flash below line upadated version using res.locals as here we dont use msg parameter 


    //instead of writing below 2 lines we have written middleware line NO - 30 to 34
    // res.locals.success=req.flash("success");
    // res.locals.error=req.flash("error");
    res.render("page.ejs" , {name:req.session.name});
});

//cookie-parsing
app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi I am root");
});


app.get("/greet",(req,res)=>{
    let{name="anonymous"}=req.cookies;//sets name as anonymous if no name value present in cookie
    res.send(`Hi ${name}`);
});

//signed cookies
app.get("/getsignedcookies",(req,res)=>{
    res.cookie("animal","peacock",{signed:true});
    res.send("Done!!!");
});

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
});


//sending cookies
app.get("/getcookies",(req,res)=>{
    res.cookie("greet","namaste");
    res.cookie("madeIn","India");
    res.send("You sent a cookies");
});

app.use("/users",users);
app.use("/posts",posts);

app.listen(3000,(req,res)=>{
    console.log("Server is listening on port 3000");
})