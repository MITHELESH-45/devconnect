const jwt=require('jsonwebtoken');
const User=require('../models/user');

const UserAuth=async(req,res,next)=>{

    
    
    try{

        const token=req.cookies.token;
        
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const decoded=jwt.verify(token,"Mithul@45");

        const id=decoded.userId;

        const user=await User.findById(id);

        if(!user){
            throw new Error("Unauthorized");
        }
        req.user=user;
        next();



    }catch(err){
        console.error("Authentication error:", err);
        res.status(401).send("Unauthorized: "+err.message);
    }
}

module.exports=UserAuth;