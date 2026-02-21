const express=require('express');
const requestRouter=express.Router();
const UserAuth=require('../middlewares/auth');
const ConnectionRequest=require('../models/connectionRequest');
const User=require('../models/user');

requestRouter.post("/request/send/:status/:toUserid",UserAuth,async(req,res)=>{
    try{     
        
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserid;
        const status=req.params.status;

        const allowedStatus=["interested","ignored"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({ error: "Invalid status only interested or ignored" });
        }
        
         

        const fromUser=await User.findById(fromUserId);
        const toUser=await User.findById(toUserId);

        
        if(!fromUser ||!toUser)  
        {
           return res.status(404).json({ error: "User not found" });
        }
        
        // if (fromUserId.toString() === toUserId) {
        //          res.status(400).json({
        //             error: "You cannot send connection request to yourself"
        //     });

        const existingRequest=await ConnectionRequest.findOne({
            $or:[
                
                {fromUserId:fromUserId,toUserId:toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(existingRequest){
            return res.status(400).json({ error: "Connection request already exists between these users" });
        }
        

        const connectionRequest=new ConnectionRequest({
                fromUserId,
                toUserId,
                status
        });
        const savedRequest=await connectionRequest.save();
        res.json({ 
            message: "Connection request sent successfully from "+fromUserId+" to "+ toUserId,
            data:savedRequest
        });
        
    }catch(err){
        console.error("Error sending connection request:", err);
        res.status(500).json({ error: err.message });
    }
});

requestRouter.post("/request/review/:status/:requestId",UserAuth,async(req,res)=>{
    try{
    const loggedInUser=req.user;

    const {status,requestId}=req.params;
    
    const allowedStatus=["accepted","rejected"];

    if(!allowedStatus.includes(status)){
        return res.status(400).json({ error: "Invalid status only accepted or rejected" });
    }

    const connection=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
    });

    if(!connection){
        return res.status(404).json({ error: "Connection request not found " });
    }

    connection.status=status;

    const updatedConnection=await connection.save();

        res.json({
            message: "Connection request "+status+" successfully",
            data:updatedConnection
        });
    }catch(err){
        console.error("Error reviewing connection request:", err);
        res.status(500).json({ error: err.message });
    }

});


module.exports=requestRouter;