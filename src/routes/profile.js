const express=require('express');
const profileRouter=express.Router();
const UserAuth=require('../middlewares/auth');
const {validateAllowedList}=require('../utils/validate');



profileRouter.get("/profile/view",UserAuth,async(req,res)=>{
    
    try{
     
     const user=req.user;
     res.json({data:user});
    
    }catch(err){
        console.error("Error fetching profile:", err);
        res.json({message:err.message});
    }

});

profileRouter.patch("/profile/edit",UserAuth,async(req,res)=>{
     
    const allowed=validateAllowedList(req);

    if(!allowed){
        return res.status(400).json({message:"Invalid fields in request body"});
    }
    try{
           const user=req.user;

           Object.keys(req.body).forEach((key)=>{
              user[key]=req.body[key];
           })

           await user.save();
           res.json({message:`${user.firstName} Profile updated successfully`,data:user});

    }catch(err){
        console.error("Error updating profile:", err);
        res.json({message:"Error updating profile: "+err.message});
    }
});

module.exports=profileRouter;