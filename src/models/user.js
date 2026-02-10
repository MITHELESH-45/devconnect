const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,

    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        /* validate only execulte at user creation first time not on the 
        updating so we need to add runValidators:true 
        in findByIdAndUpdate method in app.js file*/
        validate(value){
            if(!["male","female","others"].contains(value)){
                throw new Error("Invalid gender");
            }
        }
    },

    about:{
        type:String,
        maxlength:500,
        default:"this is a default about section"
    },

    photoUrl:{
        type:String,
        default:"https://www.w3schools.com/howto/img_avatar.png"
    },

    skills:{
        type:[String],
    },
},
{
   timestamps:true,
},
);

const User=mongoose.model("User",userSchema);

module.exports=User;

