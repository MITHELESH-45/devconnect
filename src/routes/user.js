const express=require('express');
const userRouter=express.Router();
const UserAuth=require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const user_safe_fields="firstName lastName photoUrl age gender skills about";
userRouter.get("/user/requests/received",UserAuth,async(req,res)=>{
       
    try{
        const loggedInUser=req.user;

        const connection=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",user_safe_fields);

        if(!connection || connection.length === 0){
            return res.status(200).json({
                message: "No request found",
                data: []
            });
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

        
        if(!connections || connections.length === 0){
            return res.status(200).json({
                message: "No connections found",
                data: []
            });
        }
        
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

userRouter.get("/user/feed",UserAuth,async(req,res)=>{

    try{
        const loggedInUser=req.user;

        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10;
        const skip=(page-1)*limit;
        
        const connections=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId");

        const hideUserFromFeed=new Set();
        connections.forEach(row=>{
            hideUserFromFeed.add(row.fromUserId.toString());
            hideUserFromFeed.add(row.toUserId.toString());
        });

        const feed=await User.find({
            $and:[
               {_id:{$nin:Array.from(hideUserFromFeed)}},
               {_id:{$ne:loggedInUser._id}}
            ],
        }).select(user_safe_fields).skip(skip).limit(limit);

        res.json({
            message:"Feed fetched successfully",
            data:feed
        });

    }catch(err){
        console.error("Error fetching feed:", err);
        res.status(500).json({ error: "Error fetching feed" });
    }
});

module.exports=userRouter;