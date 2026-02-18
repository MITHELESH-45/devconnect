const express=require('express');
const requestRouter=express.Router();
const UserAuth=require('../middlewares/auth');
const ConnectionRequest=require('../models/connectionRequest');

requestRouter.post("/request/send/:status/:toUserid",UserAuth,async(req,res)=>{
    try{     

        const fromUserId=req.user._id;
        const toUserId=req.params.toUserid;
        const status=req.params.status;

        const allowedStatus=["intrested","ignored"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({ error: "Invalid status only intrested or ignored" });
        }
        
         

        const fromUser=await User.findById(fromUserId);
        const toUser=await User.findById(toUserId);

        
        if(!fromUser ||!toUser)  
        {
            return res.status(404).json({ error: "User not found" });
        }

        const existingRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
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
        res.json({ message: "Connection request sent successfully from "+fromUserId+"to "+ toUserId },savedRequest);
        
    }catch(err){
        console.error("Error sending connection request:", err);
        res.status(500).json({ error: err.message });
    }
});


module.exports=requestRouter;