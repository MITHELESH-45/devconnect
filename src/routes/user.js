const express=require('express');
const userRouter=express.Router();
const UserAuth=require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');


userRouter.get("/user/requests/received",UserAuth,async(req,res)=>{
       
    try{
        const loggedInUser=req.user;

        const connection=await ConnectionRequest.findOne({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId","firstName lastName  skills age gender about photoUrl");

        if(!connection){
            return res.status(404).json({ error: "No connection requests found" });
        }
        res.json({
            message:"Received connection requests fetched successfully",
            data:connection
        });

    }catch(err){
        console.error("Error fetching received requests:", err);
        res.status(500).json({ error: "Error fetching received requests" });
    }
});