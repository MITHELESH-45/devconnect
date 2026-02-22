const express=require('express');
const {validateSignUpData,validateEmail}=require('../utils/validate');
const bcrypt=require('bcrypt');
const User=require('../models/user');
const authRouter=express.Router();

authRouter.post("/signup",async (req,res)=>{
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
        
        res.json({message:"User stored in db"});

    }catch(err){
        
        res.status(500).json({message:"Error saving user: "+err.message});
     
    }
});

authRouter.post("/login",async (req,res)=>{

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
        res.cookie("token",token,{
            httpOnly: true,
            secure: false,
            sameSite: "none",
            expires:new Date(Date.now()+7*24*60*60*1000)});
        res.json({message:"Login successful",data:user});

    }catch(err){
        console.error("Error validating email:", err);
        res.status(400).json({message:"Login failed: "+err.message});
    }
});

authRouter.post("/logout",async(req,res)=>{
     
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });

    res.json({message:"logout successful"});
});

module.exports=authRouter;
