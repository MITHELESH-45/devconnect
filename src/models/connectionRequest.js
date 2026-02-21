const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:"Status must be intrested, ignored, accepted or rejected"
        }

    }
},{
    timestamps:true
});

connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    
})


const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequest;