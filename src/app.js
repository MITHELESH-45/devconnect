const express=require('express');
const connectDb=require('./config/database');
const User=require('./models/user');
const bcrypt=require('bcrypt');
const {validateSignUpData,validateEmail}=require('./utils/validate');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const UserAuth=require('./middlewares/auth');



const app=express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup",async (req,res)=>{
    try{
    //validation of data
      validateSignUpData(req);
    
    //encrption of password
     const password=req.body.password;
     const hashedPassword=await bcrypt.hash(password,10);
     

        const{firstName,lastName,email}=req.body;
        const user=new User({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            skills:req.body.skills || [],
            age:req.body.age,
            gender:req.body.gender,
            about:req.body.about,
            photoUrl:req.body.photoUrl
        });
        await user.save()
        console.log("User saved successfully");
        res.send("user stored in db");

    }catch(err){
        console.error("Error saving user:", err);
        res.status(500).send("Error saving user"+err.message);
     
    }
});

app.get("/profile",UserAuth,async(req,res)=>{
    
    try{
   
     const user=req.user;
     res.send(user);
    
    }catch(err){
        console.error("Error fetching profile:", err);
    }

})

app.post("/connectionRequest",UserAuth,async(req,res)=>{
    try{     
        const sender=req.user;
        res.send("Connection request sent successfully from "+sender.firstName);
    }catch(err){
        console.error("Error sending connection request:", err);
    }
});
app.post("/login",async (req,res)=>{

    try{
        const {email,password}=req.body;
        validateEmail(email);

        const user=await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const passwordMatch=await user.verifyPassword(password);
        if(!passwordMatch){
            throw new Error("Invalid credentials");
        }
        
        const token= user.toJWT();
        res.cookie("token",token,{expires:new Date(Date.now()+7*24*60*60*1000)});
        res.send("Login successful");

    }catch(err){
        console.error("Error validating email:", err);
        res.status(400).send("Invalid email address",err.message);
    }
});



connectDb().then(()=>{
      console.log("Database connected successfully");
      app.listen(3000,()=>{
          console.log("Server is running on port 3000");
      });
}).catch((error)=>{
      console.error("Database connection failed:", error);
});





