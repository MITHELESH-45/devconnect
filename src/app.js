const express=require('express');
const connectDb=require('./config/database');
const User=require('./models/user');
const app=express();
app.use(express.json());

app.post("/signup",async (req,res)=>{
    console.log(req.body);
    const data=req.body;
     try{

      if(data.skills && data.skills.length>10){
            throw new Error("Skills should be less than 10");
        }
    const user=new User(req.body);
    await user.save()
    console.log("User saved successfully");
    res.send("user stored in db");

    }catch(err){
        console.error("Error saving user:", err);
        res.status(500).send("Error saving user"+err.message);
     
    }
});

app.get("/feed",async (req,res)=>{

    const email=req.query.email;

    try{
        const user=await User.findOne({email:email});
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





