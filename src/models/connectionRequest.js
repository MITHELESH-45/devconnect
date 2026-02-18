const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["intrested","ignored","accepted","rejected"],
            message:"Status must be intrested, ignored, accepted or rejected"
        }

    }
},{
    timestamps:true
});

connectionRequest.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        return next(new Error("Cannot send connection request to yourself"));
    }
    next();
})


const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequest;