const express=require('express');
const userRouter=express.Router();
const UserAuth=require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const user_safe_fields="firstName lastName photoUrl age gender skills about";
userRouter.get("/user/requests/received",UserAuth,async(req,res)=>{
       
    try{
        const loggedInUser=req.user;

        const connection=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",user_safe_fields);

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

userRouter.get("/user/connections",UserAuth,async(req,res)=>{
     
    try{

        const loggedInUser=req.user;

        const connections=await ConnectionRequest.find({
             $or:[
                {fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"}
             ]
        }).populate("fromUserId",user_safe_fields).populate("toUserId",user_safe_fields);

        const data=connections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            message:"Connections fetched successfully",
            data:data
        });

    }catch(err){
        console.error("Error fetching connections:", err);
        res.status(500).json({ error: "Error fetching connections" });
    }

});

module.exports=userRouter;