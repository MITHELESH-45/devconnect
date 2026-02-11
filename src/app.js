const express=require('express');
const connectDb=require('./config/database');
const User=require('./models/user');
const bcrypt=require('bcrypt');
const {validateSignUpData,validateEmail}=require('./utils/validate');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');


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
     req.body.password=hashedPassword;

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

app.get("/profile",async(req,res)=>{
    
    try{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).send("Unauthorized");
    }
    const decodedMessage=jwt.verify(token,'Mithul@45');
    
    const user=await User.findById(decodedMessage.userId);
    if(!user){
        throw new Error("User not found");
    }
    res.send("User profile page - token: "+token);
    console.log("Token from cookie:", token);
    }catch(err){
        console.error("Error fetching profile:", err);
    }

})
app.post("/login",async (req,res)=>{

    try{
        const {email,password}=req.body;
        validateEmail(email);

        const user=await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const passwordMatch=await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            throw new Error("Invalid credentials");
        }
        
        const token=jwt.sign({userId:user._id},'Mithul@45');
        res.cookie("token",token);
        res.send("Login successful");

    }catch(err){
        console.error("Error validating email:", err);
        res.status(400).send("Invalid email address",err.message);
    }
});


app.get("/feed",async (req,res)=>{

    const email=req.query.email;

    try{
        const user=await User.findOne({email:email}).select("-password");
        res.send(user);
        
    }catch(err){
        console.log(err);
        res.status(500).send("Error fetching user");
    }
});

app.delete("/user",async(req,res)=>{
    const id=req.body.id;
    try{
        await User.findByIdAndDelete(id);
        res.send("User deleted successfully");
    }catch(err){
        console.log(err);
        res.status(500).send("Error deleting user");
    }
});

app.patch("/user/:userId",async(req,res)=>{
    const id=req.params.userId;
    const data=req.body;
    try{

        const allowed_updates=["firstName","lastName","age","about","skills","photoUrl"];

        const isAllowed=Object.keys(data).every((k)=>
            allowed_updates.includes(k)
        );

        if(!isAllowed){
            throw new Error("Invalid updates");
        }

        if(data.skills && data.skills.length>10){
            throw new Error("Skills should be less than 10");
        }
        const user=await User.findByIdAndUpdate(id,data,{runValidators:true});
        res.send("User updated successfully");
    }catch(err){
        console.log(err);
        res.status(500).send("Error updating user" + err.message);
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





